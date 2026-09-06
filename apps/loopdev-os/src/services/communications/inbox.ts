import {
  CommunicationConversationSchema,
  CommunicationMessageSchema,
  COMMUNICATION_INBOX_CAPABILITY_PERMISSIONS,
} from '@loopdev/contracts';
import type { Database } from '@/types/database.types';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type {
  InboxConversation,
  InboxMessage,
  InboxModel,
} from '@/suites/sales-crm/communications/types';

type ConversationRow = Database['public']['Tables']['communication_conversations']['Row'];
type ContactRow = Database['public']['Tables']['crm_contacts']['Row'];
type ChannelRow = Database['public']['Tables']['communication_channels']['Row'];
type MessageRow = Database['public']['Tables']['communication_messages']['Row'];

const conversationColumns =
  'id, organization_id, brand_id, workspace_id, contact_id, channel_id, channel, status, assigned_to_user_id, last_inbound_at, window_expires_at, created_at, updated_at';
const contactColumns = 'id, first_name, last_name, email, phone, company_name';
const channelColumns = 'id, account_id, contact_id, channel, address';
const messageColumns =
  'id, organization_id, conversation_id, external_id, direction, status, body, template_id, created_at, updated_at';

function timestamp(value: string) {
  return new Date(value).toISOString();
}

function contactName(contact: ContactRow) {
  return [contact.first_name, contact.last_name].filter(Boolean).join(' ').trim();
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function mapMessage(row: MessageRow, authorName: string | null): InboxMessage {
  const message = CommunicationMessageSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    conversationId: row.conversation_id,
    externalId: row.external_id,
    direction: row.direction,
    status: row.status,
    body: row.body,
    templateId: row.template_id,
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });

  return {
    ...message,
    kind: 'message',
    authorName,
  };
}

function mapConversation(
  row: ConversationRow,
  contact: ContactRow,
  channel: ChannelRow,
  messages: MessageRow[],
  actorUserId: string,
): InboxConversation {
  const name = contactName(contact) || channel.display_name || channel.address;
  const parsed = CommunicationConversationSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    brandId: row.brand_id,
    workspaceId: row.workspace_id,
    accountId: channel.account_id,
    contactId: row.contact_id,
    channelId: row.channel_id,
    channel: row.channel,
    status: row.status,
    assignedToUserId: row.assigned_to_user_id,
    lastActivityAt: timestamp(row.updated_at),
    lastInboundAt: row.last_inbound_at ? timestamp(row.last_inbound_at) : null,
    windowExpiresAt: row.window_expires_at ? timestamp(row.window_expires_at) : null,
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });
  const mappedMessages = messages.map((message) =>
    mapMessage(message, message.direction === 'inbound' ? name : null),
  );
  const latestMessage = mappedMessages.at(-1);

  return {
    ...parsed,
    contactName: name,
    contactInitials: initials(name),
    contactCompany: contact.company_name,
    contactPhone: contact.phone ?? channel.address,
    unreadCount: 0,
    preview: latestMessage?.body ?? null,
    assignedToName: row.assigned_to_user_id
      ? row.assigned_to_user_id === actorUserId
        ? 'You'
        : 'Assigned agent'
      : null,
    messages: mappedMessages,
  };
}

async function loadCapabilities(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  organizationId: string,
) {
  const entries = await Promise.all(
    Object.entries(COMMUNICATION_INBOX_CAPABILITY_PERMISSIONS).map(
      async ([capability, permission]) => {
        const { data, error } = await supabase.rpc('has_organization_permission', {
          target_organization_id: organizationId,
          required_permission: permission,
        });
        return [capability, !error && data === true] as const;
      },
    ),
  );
  return Object.fromEntries(entries) as InboxModel['capabilities'];
}

export async function listCommunicationInbox(
  organizationId: string,
  actorUserId: string,
): Promise<InboxModel> {
  const supabase = await createServerSupabaseClient();
  const capabilities = await loadCapabilities(supabase, organizationId);
  const { data, error } = await supabase
    .from('communication_conversations')
    .select(conversationColumns)
    .eq('organization_id', organizationId)
    .order('updated_at', { ascending: false })
    .limit(100);

  if (error) throw new Error('Unable to list communication conversations');

  const conversationRows = (data ?? []) as unknown as ConversationRow[];
  const contactIds = [...new Set(conversationRows.map((row) => row.contact_id))];
  const channelIds = [...new Set(conversationRows.map((row) => row.channel_id))];
  const conversationIds = conversationRows.map((row) => row.id);

  if (conversationRows.length === 0) {
    return {
      organizationId,
      conversations: [],
      capabilities,
      presentation: 'empty',
    };
  }

  const [contactsResult, channelsResult, messagesResult] = await Promise.all([
    supabase
      .from('crm_contacts')
      .select(contactColumns)
      .eq('organization_id', organizationId)
      .in('id', contactIds),
    supabase
      .from('communication_channels')
      .select(channelColumns)
      .eq('organization_id', organizationId)
      .in('id', channelIds),
    supabase
      .from('communication_messages')
      .select(messageColumns)
      .eq('organization_id', organizationId)
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: true }),
  ]);

  if (contactsResult.error || channelsResult.error || messagesResult.error) {
    throw new Error('Unable to load communication inbox details');
  }

  const contacts = new Map(
    ((contactsResult.data ?? []) as unknown as ContactRow[]).map((contact) => [
      contact.id,
      contact,
    ]),
  );
  const channels = new Map(
    ((channelsResult.data ?? []) as unknown as ChannelRow[]).map((channel) => [
      channel.id,
      channel,
    ]),
  );
  const messagesByConversation = new Map<string, MessageRow[]>();
  for (const message of (messagesResult.data ?? []) as unknown as MessageRow[]) {
    const current = messagesByConversation.get(message.conversation_id) ?? [];
    current.push(message);
    messagesByConversation.set(message.conversation_id, current);
  }

  const conversations = conversationRows.flatMap((row) => {
    const contact = contacts.get(row.contact_id);
    const channel = channels.get(row.channel_id);
    if (!contact || !channel) return [];
    return [
      mapConversation(row, contact, channel, messagesByConversation.get(row.id) ?? [], actorUserId),
    ];
  });

  return {
    organizationId,
    conversations,
    capabilities,
    presentation: conversations.length > 0 ? 'ready' : 'empty',
  };
}
