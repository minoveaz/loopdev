import {
  CreateCommunicationConversationCommandSchema,
  CreateCommunicationInternalNoteCommandSchema,
  CreateCommunicationMessageCommandSchema,
} from '@loopdev/contracts';
import type {
  CreateCommunicationConversationCommand,
  CreateCommunicationInternalNoteCommand,
  CreateCommunicationMessageCommand,
} from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function createConversation(input: CreateCommunicationConversationCommand) {
  const parsed = CreateCommunicationConversationCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
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

export async function createInternalNote(input: CreateCommunicationInternalNoteCommand) {
  const parsed = CreateCommunicationInternalNoteCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('communication_internal_notes').insert({
    organization_id: parsed.organizationId,
    conversation_id: parsed.conversationId,
    author_id: parsed.authorId,
    body: parsed.body,
  }).select().single();
  if (error) throw new Error('Unable to create communication internal note');
  return data;
}

export async function registerWebhookEvent(input: {
  organizationId: string;
  accountId: string;
  externalEventId: string;
  externalMessageId?: string | null;
  payloadVersion: string;
}) {
  const supabase = await createServerSupabaseClient();
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
