import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  authorizeCommunications,
  assignConversationToSelf,
  changeConversationStatus,
  createInternalNote,
  sendWhatsAppConversationTemplate,
  sendWhatsAppConversationText,
} = vi.hoisted(() => ({
  authorizeCommunications: vi.fn(),
  assignConversationToSelf: vi.fn(),
  changeConversationStatus: vi.fn(),
  createInternalNote: vi.fn(),
  sendWhatsAppConversationTemplate: vi.fn(),
  sendWhatsAppConversationText: vi.fn(),
}));

vi.mock('../../_lib/access', () => ({ authorizeCommunications }));
vi.mock('@/services/communications/core', () => ({
  assignConversationToSelf,
  changeConversationStatus,
  createInternalNote,
  sendWhatsAppConversationTemplate,
  sendWhatsAppConversationText,
}));

import { POST } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const conversationId = '00000000-0000-4000-9000-000000000002';
const userId = '00000000-0000-4000-9000-000000000003';

function request(body: unknown) {
  return new Request('http://localhost/api/communications/inbox/actions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Communications inbox actions API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCommunications.mockResolvedValue({ allowed: true, userId });
  });

  it('rejects malformed actions before authorization', async () => {
    const response = await POST(request({ organizationId, conversationId, action: 'reply' }));
    expect(response.status).toBe(400);
    expect(authorizeCommunications).not.toHaveBeenCalled();
  });

  it('uses the reply permission and delegates reply execution to Core', async () => {
    sendWhatsAppConversationText.mockResolvedValue({ id: 'message-1' });
    const response = await POST(
      request({ organizationId, conversationId, action: 'reply', body: 'Hello' }),
    );
    expect(response.status).toBe(200);
    expect(authorizeCommunications).toHaveBeenCalledWith(organizationId, 'communications.reply');
    expect(sendWhatsAppConversationText).toHaveBeenCalledWith({
      organizationId,
      conversationId,
      body: 'Hello',
    });
  });

  it('uses the note permission and passes the authorized actor to Core', async () => {
    createInternalNote.mockResolvedValue({ id: 'note-1' });
    const response = await POST(
      request({ organizationId, conversationId, action: 'note', body: 'Follow up tomorrow' }),
    );
    expect(response.status).toBe(201);
    expect(authorizeCommunications).toHaveBeenCalledWith(organizationId, 'communications.note');
    expect(createInternalNote).toHaveBeenCalledWith({
      organizationId,
      conversationId,
      body: 'Follow up tomorrow',
      authorId: userId,
    });
  });

  it('routes assignment and lifecycle through their own permissions', async () => {
    assignConversationToSelf.mockResolvedValue({ id: conversationId });
    changeConversationStatus.mockResolvedValue({ id: conversationId, status: 'closed' });

    const assignResponse = await POST(
      request({ organizationId, conversationId, action: 'assign' }),
    );
    const statusResponse = await POST(
      request({ organizationId, conversationId, action: 'status', status: 'closed' }),
    );

    expect(assignResponse.status).toBe(200);
    expect(statusResponse.status).toBe(200);
    expect(authorizeCommunications).toHaveBeenNthCalledWith(
      1,
      organizationId,
      'communications.assign',
    );
    expect(authorizeCommunications).toHaveBeenNthCalledWith(
      2,
      organizationId,
      'communications.lifecycle',
    );
    expect(assignConversationToSelf).toHaveBeenCalledWith({
      organizationId,
      conversationId,
      userId,
    });
    expect(changeConversationStatus).toHaveBeenCalledWith({
      organizationId,
      conversationId,
      status: 'closed',
    });
  });

  it('uses the reply permission and dispatches an approved template', async () => {
    sendWhatsAppConversationTemplate.mockResolvedValue({ id: 'message-2' });
    const templateId = '00000000-0000-4000-9000-000000000004';
    const templateParameters = { firstName: 'Ada' };

    const response = await POST(
      request({
        organizationId,
        conversationId,
        action: 'template',
        templateId,
        templateParameters,
      }),
    );

    expect(response.status).toBe(200);
    expect(authorizeCommunications).toHaveBeenCalledWith(organizationId, 'communications.reply');
    expect(sendWhatsAppConversationTemplate).toHaveBeenCalledWith({
      organizationId,
      conversationId,
      templateId,
      templateParameters,
    });
  });
});
