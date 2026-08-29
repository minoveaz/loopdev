import { describe, expect, it } from 'vitest';
import { CommunicationConversationSchema, CommunicationPermissionKeySchema, SendCommunicationCommandSchema } from '../communications';

const ids = { organizationId: '00000000-0000-4000-9000-000000000001', contactId: '00000000-0000-4000-9000-000000000002', conversationId: '00000000-0000-4000-9000-000000000003' };
const timestamp = '2026-08-09T00:00:00.000Z';

describe('Communications Core contracts', () => {
  it('models channel scope and WhatsApp response window metadata', () => {
    expect(CommunicationConversationSchema.safeParse({ id: ids.conversationId, organizationId: ids.organizationId, accountId: ids.organizationId, channelId: ids.contactId, contactId: ids.contactId, channel: 'whatsapp', status: 'open', lastActivityAt: timestamp, lastInboundAt: timestamp, windowExpiresAt: timestamp, createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });

  it('requires body or an approved template for outbound messages', () => {
    expect(SendCommunicationCommandSchema.safeParse({ organizationId: ids.organizationId, conversationId: ids.conversationId, channel: 'whatsapp' }).success).toBe(false);
    expect(SendCommunicationCommandSchema.safeParse({ organizationId: ids.organizationId, conversationId: ids.conversationId, channel: 'whatsapp', templateId: ids.contactId, idempotencyKey: 'message-1' }).success).toBe(true);
  });

  it('exposes only the approved granular communications permissions', () => {
    expect(CommunicationPermissionKeySchema.safeParse('communications.reply').success).toBe(true);
    expect(CommunicationPermissionKeySchema.safeParse('communications.send').success).toBe(false);
  });
});
