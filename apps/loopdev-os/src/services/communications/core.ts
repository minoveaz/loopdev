import {
  CreateCommunicationConversationCommandSchema,
  CreateCommunicationInternalNoteCommandSchema,
  CreateCommunicationMessageCommandSchema,
  RecordCommunicationMessageStatusCommandSchema,
  RetryCommunicationMessageCommandSchema,
  CommunicationInboxTemplateSchema,
} from '@loopdev/contracts';
import type {
  CreateCommunicationConversationCommand,
  CreateCommunicationInternalNoteCommand,
  CreateCommunicationMessageCommand,
  RecordCommunicationMessageStatusCommand,
  RetryCommunicationMessageCommand,
} from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  renderWhatsAppTemplateBody,
  resolveWhatsAppTemplateParameters,
  sendWhatsAppTemplate,
  sendWhatsAppText,
} from './whatsapp';
import type { Database } from '@/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function createConversation(input: CreateCommunicationConversationCommand) {
  const parsed = CreateCommunicationConversationCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const [contact, channel] = await Promise.all([
    supabase.from('crm_contacts').select('id').eq('id', parsed.contactId).eq('organization_id', parsed.organizationId).maybeSingle(),
    supabase.from('communication_channels').select('id, organization_id, contact_id').eq('id', parsed.channelId).eq('organization_id', parsed.organizationId).maybeSingle(),
  ]);
  if (contact.error || channel.error || !contact.data || !channel.data || channel.data.contact_id !== parsed.contactId) {
    throw new Error('Communication conversation references do not belong to the organization');
  }
  if (parsed.brandId) {
    const brand = await supabase.from('brands').select('id').eq('id', parsed.brandId).eq('organization_id', parsed.organizationId).maybeSingle();
    if (brand.error || !brand.data) throw new Error('Communication brand does not belong to the organization');
  }
  if (parsed.workspaceId) {
    const workspace = await supabase.from('workspaces').select('id').eq('id', parsed.workspaceId).eq('organization_id', parsed.organizationId).maybeSingle();
    if (workspace.error || !workspace.data) throw new Error('Communication workspace does not belong to the organization');
  }
  const { data, error } = await supabase.from('communication_conversations').insert({
    organization_id: parsed.organizationId,
    brand_id: parsed.brandId ?? null,
    workspace_id: parsed.workspaceId ?? null,
    contact_id: parsed.contactId,
    channel_id: parsed.channelId,
    channel: parsed.channel,
  }).select().single();
  if (error) throw new Error('Unable to create communication conversation');
  return data;
}

export async function createMessage(input: CreateCommunicationMessageCommand) {
  const parsed = CreateCommunicationMessageCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const conversation = await supabase.from('communication_conversations').select('id, organization_id')
    .eq('id', parsed.conversationId).eq('organization_id', parsed.organizationId).maybeSingle();
  if (conversation.error || !conversation.data) {
    throw new Error('Communication conversation does not belong to the organization');
  }
  const { data, error } = await supabase.from('communication_messages').insert({
    organization_id: parsed.organizationId,
    conversation_id: parsed.conversationId,
    external_id: parsed.externalId ?? null,
    direction: parsed.direction,
    status: parsed.status,
    body: parsed.body ?? null,
    template_id: parsed.templateId ?? null,
  }).select().single();
  if (error) throw new Error('Unable to create communication message');
  return data;
}

export async function sendWhatsAppConversationText(input: {
  organizationId: string;
  conversationId: string;
  body: string;
}) {
  const supabase = await createServerSupabaseClient();
  const conversation = await supabase.from('communication_conversations').select('id, channel_id, window_expires_at')
    .eq('id', input.conversationId).eq('organization_id', input.organizationId).maybeSingle();
  if (conversation.error || !conversation.data) throw new Error('Communication conversation does not belong to the organization');
  if (!conversation.data.window_expires_at || Date.parse(conversation.data.window_expires_at) <= Date.now()) {
    throw new Error('WhatsApp conversation window has expired; an approved template is required');
  }

  const channel = await supabase.from('communication_channels').select('id, account_id, address, channel')
    .eq('id', conversation.data.channel_id).eq('organization_id', input.organizationId).maybeSingle();
  if (channel.error || !channel.data || channel.data.channel !== 'whatsapp') throw new Error('WhatsApp channel not found');

  const account = await supabase.from('communication_accounts').select('id, external_account_id')
    .eq('id', channel.data.account_id).eq('organization_id', input.organizationId).maybeSingle();
  if (account.error || !account.data) throw new Error('WhatsApp account not found');
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!accessToken) throw new Error('META_ACCESS_TOKEN is not configured');

  const queued = await supabase.from('communication_messages').insert({
    organization_id: input.organizationId, conversation_id: input.conversationId,
    direction: 'outbound', status: 'queued', body: input.body,
  }).select().single();
  if (queued.error) throw new Error('Unable to queue communication message');

  try {
    const sent = await sendWhatsAppText({
      phoneNumberId: account.data.external_account_id,
      accessToken,
      to: channel.data.address,
      body: input.body,
      graphApiVersion: process.env.META_GRAPH_API_VERSION,
    });
    const updated = await supabase.from('communication_messages').update({
      external_id: sent.providerMessageId, status: 'sent', updated_at: new Date().toISOString(),
    }).eq('id', queued.data.id).eq('organization_id', input.organizationId).select().single();
    if (updated.error) throw new Error('Unable to finalize outbound communication message');
    return updated.data;
  } catch (error) {
    await supabase.from('communication_messages').update({
      status: 'failed', updated_at: new Date().toISOString(),
    }).eq('id', queued.data.id).eq('organization_id', input.organizationId);
    throw error;
  }
}

export async function listCommunicationTemplates(organizationId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('communication_templates')
    .select('id, organization_id, channel, external_template_id, language, status, body')
    .eq('organization_id', organizationId)
    .eq('channel', 'whatsapp')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false });
  if (error) throw new Error('Unable to list communication templates');

  const templates = (data ?? []).map((template) => ({
    id: template.id,
    organizationId: template.organization_id,
    channel: 'whatsapp' as const,
    externalTemplateId: template.external_template_id,
    language: template.language,
    name: template.external_template_id,
    body: template.body,
    parameterNames: [...template.body.matchAll(/{{\s*([\w.-]+)\s*}}/g)].map((match) => match[1]),
  }));
  return CommunicationInboxTemplateSchema.array().parse(templates);
}

export async function sendWhatsAppConversationTemplate(input: {
  organizationId: string;
  conversationId: string;
  templateId: string;
  templateParameters: Record<string, string>;
}) {
  const supabase = await createServerSupabaseClient();
  const conversation = await supabase
    .from('communication_conversations')
    .select('id, channel_id')
    .eq('id', input.conversationId)
    .eq('organization_id', input.organizationId)
    .maybeSingle();
  if (conversation.error || !conversation.data) {
    throw new Error('Communication conversation does not belong to the organization');
  }

  const [channel, template] = await Promise.all([
    supabase
      .from('communication_channels')
      .select('id, account_id, address, channel')
      .eq('id', conversation.data.channel_id)
      .eq('organization_id', input.organizationId)
      .maybeSingle(),
    supabase
      .from('communication_templates')
      .select('id, external_template_id, language, status, body')
      .eq('id', input.templateId)
      .eq('organization_id', input.organizationId)
      .maybeSingle(),
  ]);
  if (channel.error || !channel.data || channel.data.channel !== 'whatsapp') {
    throw new Error('WhatsApp channel not found');
  }
  if (template.error || !template.data || template.data.status !== 'approved') {
    throw new Error('Approved WhatsApp template not found');
  }

  const account = await supabase
    .from('communication_accounts')
    .select('id, external_account_id')
    .eq('id', channel.data.account_id)
    .eq('organization_id', input.organizationId)
    .maybeSingle();
  if (account.error || !account.data) throw new Error('WhatsApp account not found');
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!accessToken) throw new Error('META_ACCESS_TOKEN is not configured');

  const parameterNames = [...template.data.body.matchAll(/{{\s*([\w.-]+)\s*}}/g)].map(
    (match) => match[1],
  );
  const parameters = resolveWhatsAppTemplateParameters(
    parameterNames,
    input.templateParameters,
  );
  const renderedBody = renderWhatsAppTemplateBody(template.data.body, input.templateParameters);
  const queued = await supabase
    .from('communication_messages')
    .insert({
      organization_id: input.organizationId,
      conversation_id: input.conversationId,
      direction: 'outbound',
      status: 'queued',
      body: renderedBody,
      template_id: input.templateId,
    })
    .select()
    .single();
  if (queued.error) throw new Error('Unable to queue communication template');

  try {
    const sent = await sendWhatsAppTemplate({
      phoneNumberId: account.data.external_account_id,
      accessToken,
      to: channel.data.address,
      templateName: template.data.external_template_id,
      language: template.data.language,
      parameters,
      graphApiVersion: process.env.META_GRAPH_API_VERSION,
    });
    const updated = await supabase
      .from('communication_messages')
      .update({
        external_id: sent.providerMessageId,
        status: 'sent',
        updated_at: new Date().toISOString(),
      })
      .eq('id', queued.data.id)
      .eq('organization_id', input.organizationId)
      .select()
      .single();
    if (updated.error) throw new Error('Unable to finalize outbound communication template');
    return updated.data;
  } catch (error) {
    await supabase
      .from('communication_messages')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', queued.data.id)
      .eq('organization_id', input.organizationId);
    throw error;
  }
}

export async function createInternalNote(input: CreateCommunicationInternalNoteCommand & { authorId: string }) {
  const parsed = CreateCommunicationInternalNoteCommandSchema.parse(input);
  const authorId = input.authorId;
  const supabase = await createServerSupabaseClient();
  const conversation = await supabase.from('communication_conversations').select('id')
    .eq('id', parsed.conversationId).eq('organization_id', parsed.organizationId).maybeSingle();
  if (conversation.error || !conversation.data) {
    throw new Error('Communication conversation does not belong to the organization');
  }
  const { data, error } = await supabase.from('communication_internal_notes').insert({
    organization_id: parsed.organizationId,
    conversation_id: parsed.conversationId,
    author_id: authorId,
    body: parsed.body,
  }).select().single();
  if (error) throw new Error('Unable to create communication internal note');
  return data;
}

export async function assignConversationToSelf(input: {
  organizationId: string;
  conversationId: string;
  userId: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('communication_conversations').update({
    assigned_to_user_id: input.userId,
    updated_at: new Date().toISOString(),
  }).eq('id', input.conversationId).eq('organization_id', input.organizationId).select().single();
  if (error || !data) throw new Error('Unable to assign communication conversation');
  return data;
}

export async function changeConversationStatus(input: {
  organizationId: string;
  conversationId: string;
  status: 'open' | 'pending' | 'snoozed' | 'closed';
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('communication_conversations').update({
    status: input.status,
    updated_at: new Date().toISOString(),
  }).eq('id', input.conversationId).eq('organization_id', input.organizationId).select().single();
  if (error || !data) throw new Error('Unable to change communication conversation status');
  return data;
}

export async function registerWebhookEvent(input: {
  organizationId: string;
  accountId: string;
  externalEventId: string;
  externalMessageId?: string | null;
  payloadVersion: string;
}, client?: SupabaseClient<Database>) {
  const supabase = client ?? await createServerSupabaseClient();
  const { data, error } = await supabase.from('communication_webhook_events').insert({
    organization_id: input.organizationId,
    account_id: input.accountId,
    external_event_id: input.externalEventId,
    external_message_id: input.externalMessageId ?? null,
    payload_version: input.payloadVersion,
  }).select().single();
  if (error) {
    const existing = await supabase.from('communication_webhook_events').select().eq('organization_id', input.organizationId).eq('account_id', input.accountId).eq('external_event_id', input.externalEventId).maybeSingle();
    if (existing.error || !existing.data) throw new Error('Unable to register communication webhook event');
    return { event: existing.data, duplicate: true };
  }
  return { event: data, duplicate: false };
}

export async function recordMessageStatus(input: RecordCommunicationMessageStatusCommand, actorUserId?: string | null) {
  const parsed = RecordCommunicationMessageStatusCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const { data: status, error } = await supabase.from('communication_message_statuses').insert({
    organization_id: parsed.organizationId,
    message_id: parsed.messageId,
    status: parsed.status,
    provider_timestamp: parsed.providerTimestamp ?? null,
  }).select().single();
  if (error) throw new Error('Unable to record communication message status');
  const { error: auditError } = await supabase.from('crm_audit_events').insert({
    organization_id: parsed.organizationId,
    actor_user_id: actorUserId ?? null,
    entity_type: 'communication_message',
    entity_id: parsed.messageId,
    action: `status_${parsed.status}`,
    before_state: null,
    after_state: { status: parsed.status },
    metadata: { source: 'communications_core' },
  });
  if (auditError) throw new Error('Unable to audit communication message status');
  return status;
}

export async function scheduleMessageRetry(input: RetryCommunicationMessageCommand) {
  const parsed = RetryCommunicationMessageCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const { data: message, error: loadError } = await supabase.from('communication_messages')
    .select('id, status, retry_count, max_retries')
    .eq('organization_id', parsed.organizationId)
    .eq('id', parsed.messageId)
    .maybeSingle();
  if (loadError || !message) throw new Error('Unable to resolve communication message');
  if (message.status !== 'failed') throw new Error('Only failed communication messages can be retried');
  if (message.retry_count >= message.max_retries) throw new Error('Communication message retry limit reached');
  const retryCount = message.retry_count + 1;
  const delaySeconds = Math.min(300, 15 * (2 ** (retryCount - 1)));
  const nextRetryAt = new Date(Date.now() + delaySeconds * 1000).toISOString();
  const { data, error } = await supabase.from('communication_messages').update({
    status: 'queued', retry_count: retryCount, next_retry_at: nextRetryAt, last_error_code: parsed.errorCode ?? null,
  }).eq('organization_id', parsed.organizationId).eq('id', parsed.messageId).eq('status', 'failed').select().single();
  if (error) throw new Error('Unable to schedule communication message retry');
  return data;
}
