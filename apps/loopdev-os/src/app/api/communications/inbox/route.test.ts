import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createServerSupabaseClient, listCommunicationInbox } = vi.hoisted(() => ({
  createServerSupabaseClient: vi.fn(),
  listCommunicationInbox: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({ createServerSupabaseClient }));
vi.mock('@/services/communications/inbox', () => ({ listCommunicationInbox }));

import { GET } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const userId = '00000000-0000-4000-9000-000000000002';

function mockAuth({
  user = { id: userId },
  permission = true,
}: { user?: { id: string } | null; permission?: boolean } = {}) {
  createServerSupabaseClient.mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    rpc: vi.fn().mockResolvedValue({ data: permission, error: null }),
  });
}

describe('Communications inbox API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listCommunicationInbox.mockResolvedValue({
      organizationId,
      conversations: [],
      capabilities: {
        canReply: true,
        canNote: true,
        canAssign: true,
        canChangeLifecycle: true,
      },
      presentation: 'empty',
    });
  });

  it('rejects an invalid organization before authorization', async () => {
    const response = await GET(
      new Request('http://localhost/api/communications/inbox?organizationId=bad'),
    );
    expect(response.status).toBe(400);
    expect(createServerSupabaseClient).not.toHaveBeenCalled();
  });

  it('requires an authenticated user', async () => {
    mockAuth({ user: null });
    const response = await GET(
      new Request(`http://localhost/api/communications/inbox?organizationId=${organizationId}`),
    );
    expect(response.status).toBe(401);
    expect(listCommunicationInbox).not.toHaveBeenCalled();
  });

  it('requires communications.read for the requested organization', async () => {
    mockAuth({ permission: false });
    const response = await GET(
      new Request(`http://localhost/api/communications/inbox?organizationId=${organizationId}`),
    );
    expect(response.status).toBe(403);
    expect(listCommunicationInbox).not.toHaveBeenCalled();
  });

  it('returns the authorized inbox model for the requested organization', async () => {
    mockAuth();
    const response = await GET(
      new Request(`http://localhost/api/communications/inbox?organizationId=${organizationId}`),
    );
    expect(response.status).toBe(200);
    expect(listCommunicationInbox).toHaveBeenCalledWith(organizationId, userId);
    expect(await response.json()).toEqual({
      model: expect.objectContaining({ organizationId, presentation: 'empty' }),
    });
  });
});
