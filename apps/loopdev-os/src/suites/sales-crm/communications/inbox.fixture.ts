import type {
  CommunicationInboxConversation as InboxConversation,
  CommunicationInboxMessage as InboxMessage,
  CommunicationInboxModel as InboxModel,
} from '@loopdev/contracts';

export type { InboxConversation, InboxMessage, InboxModel };
export type { CommunicationInboxTemplate as InboxTemplate } from '@loopdev/contracts';
export type {
  CommunicationInboxComposerMode as ComposerMode,
  CommunicationInboxFilter as InboxFilter,
  CommunicationInboxPresentation as InboxPresentationState,
} from '@loopdev/contracts';
type CommunicationMessageStatus = InboxMessage['status'];

const ORGANIZATION_ID = '00000000-0000-4000-9000-000000000010';
const ACCOUNT_ID = '11111111-1111-4111-8111-111111111111';
const CHANNEL_ID = '22222222-2222-4222-8222-222222222222';

export const COMMUNICATIONS_INBOX_TEMPLATES = [
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    organizationId: ORGANIZATION_ID,
    channel: 'whatsapp' as const,
    externalTemplateId: 'proposal_follow_up',
    language: 'es',
    name: 'Proposal follow-up',
    body: 'Hola {{firstName}}, te compartimos el seguimiento de tu propuesta.',
    parameterNames: ['firstName'],
  },
];

function message(
  id: string,
  conversationId: string,
  direction: InboxMessage['direction'],
  body: string,
  createdAt: string,
  status: CommunicationMessageStatus,
  authorName: string,
  kind: InboxMessage['kind'] = 'message',
): InboxMessage {
  return {
    id,
    organizationId: ORGANIZATION_ID,
    conversationId,
    externalId: null,
    direction,
    status,
    body,
    templateId: null,
    createdAt,
    updatedAt: createdAt,
    kind,
    authorName,
  };
}

const ANA_ID = '33333333-3333-4333-8333-333333333333';
const LUIS_ID = '44444444-4444-4444-8444-444444444444';
const MARTA_ID = '55555555-5555-4555-8555-555555555555';

export const COMMUNICATIONS_INBOX_FIXTURES: InboxConversation[] = [
  {
    id: '66666666-6666-4666-8666-666666666666',
    organizationId: ORGANIZATION_ID,
    brandId: null,
    workspaceId: null,
    accountId: ACCOUNT_ID,
    contactId: ANA_ID,
    channelId: CHANNEL_ID,
    channel: 'whatsapp',
    status: 'open',
    assignedToUserId: null,
    lastActivityAt: '2026-08-30T14:24:00.000Z',
    lastInboundAt: '2026-08-30T14:24:00.000Z',
    windowExpiresAt: '2026-08-31T14:24:00.000Z',
    createdAt: '2026-08-30T13:50:00.000Z',
    updatedAt: '2026-08-30T14:24:00.000Z',
    contactName: 'Ana Garcia',
    contactInitials: 'AG',
    contactCompany: 'Acme Industries',
    contactPhone: '+1 555 0100',
    unreadCount: 2,
    preview: 'Could you send me the updated proposal?',
    assignedToName: null,
    messages: [
      message(
        '77777777-7777-4777-8777-777777777777',
        '66666666-6666-4666-8666-666666666666',
        'inbound',
        'Hi, I reviewed the proposal and have one question.',
        '2026-08-30T14:18:00.000Z',
        'read',
        'Ana Garcia',
      ),
      message(
        '88888888-8888-4888-8888-888888888888',
        '66666666-6666-4666-8666-666666666666',
        'inbound',
        'Could you send me the updated proposal?',
        '2026-08-30T14:24:00.000Z',
        'read',
        'Ana Garcia',
      ),
    ],
  },
  {
    id: '99999999-9999-4999-8999-999999999999',
    organizationId: ORGANIZATION_ID,
    brandId: null,
    workspaceId: null,
    accountId: ACCOUNT_ID,
    contactId: LUIS_ID,
    channelId: CHANNEL_ID,
    channel: 'whatsapp',
    status: 'pending',
    assignedToUserId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    lastActivityAt: '2026-08-30T12:06:00.000Z',
    lastInboundAt: '2026-08-30T11:58:00.000Z',
    windowExpiresAt: '2026-08-31T11:58:00.000Z',
    createdAt: '2026-08-29T09:10:00.000Z',
    updatedAt: '2026-08-30T12:06:00.000Z',
    contactName: 'Luis Martinez',
    contactInitials: 'LM',
    contactCompany: 'Northstar Health',
    contactPhone: '+1 555 0101',
    unreadCount: 0,
    preview: 'Thanks, I will review this with the team.',
    assignedToName: 'Maya Chen',
    messages: [
      message(
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        '99999999-9999-4999-8999-999999999999',
        'inbound',
        'Thanks, I will review this with the team.',
        '2026-08-30T11:58:00.000Z',
        'read',
        'Luis Martinez',
      ),
      message(
        'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        '99999999-9999-4999-8999-999999999999',
        'outbound',
        'Perfect. I will check back tomorrow.',
        '2026-08-30T12:06:00.000Z',
        'delivered',
        'Maya Chen',
      ),
    ],
  },
  {
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    organizationId: ORGANIZATION_ID,
    brandId: null,
    workspaceId: null,
    accountId: ACCOUNT_ID,
    contactId: MARTA_ID,
    channelId: CHANNEL_ID,
    channel: 'whatsapp',
    status: 'closed',
    assignedToUserId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    lastActivityAt: '2026-08-28T16:42:00.000Z',
    lastInboundAt: '2026-08-28T16:38:00.000Z',
    windowExpiresAt: '2026-08-29T16:38:00.000Z',
    createdAt: '2026-08-28T16:00:00.000Z',
    updatedAt: '2026-08-28T16:42:00.000Z',
    contactName: 'Marta Ruiz',
    contactInitials: 'MR',
    contactCompany: 'Studio Meridian',
    contactPhone: '+1 555 0102',
    unreadCount: 0,
    preview: 'That works for me, thank you.',
    assignedToName: 'Maya Chen',
    messages: [
      message(
        'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        'outbound',
        'I have marked this request as complete.',
        '2026-08-28T16:42:00.000Z',
        'read',
        'Maya Chen',
      ),
      message(
        'ffffffff-ffff-4fff-8fff-ffffffffffff',
        'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        'inbound',
        'That works for me, thank you.',
        '2026-08-28T16:38:00.000Z',
        'read',
        'Marta Ruiz',
      ),
    ],
  },
];

export const COMMUNICATIONS_INBOX_MODEL: InboxModel = {
  organizationId: ORGANIZATION_ID,
  conversations: COMMUNICATIONS_INBOX_FIXTURES,
  capabilities: {
    canReply: true,
    canNote: true,
    canAssign: true,
    canChangeLifecycle: true,
  },
  presentation: 'ready',
};
