import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, createCrmActivity, listCrmActivities } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  createCrmActivity: vi.fn(),
  listCrmActivities: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/operations', () => ({ createCrmActivity, listCrmActivities }));

import { GET } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';

describe('CRM activities API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
    listCrmActivities.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
  });

  it('rejects invalid queries before authorization', async () => {
    const response = await GET(
      new Request('http://localhost/api/crm/activities?organizationId=bad'),
    );
    expect(response.status).toBe(400);
    expect(authorizeCrm).not.toHaveBeenCalled();
  });

  it('authorizes and forwards bounded cursor queries', async () => {
    const response = await GET(
      new Request(
        `http://localhost/api/crm/activities?organizationId=${organizationId}&limit=10&cursor=abc`,
      ),
    );
    expect(response.status).toBe(200);
    expect(authorizeCrm).toHaveBeenCalledWith(organizationId, 'crm.read');
    expect(listCrmActivities).toHaveBeenCalledWith({ organizationId, limit: 10, cursor: 'abc' });
  });

  it('forwards idempotency attribution on activity creation', async () => {
    const { POST } = await import('./route');
    createCrmActivity.mockResolvedValue({ id: 'activity-1' });
    const response = await POST(
      new Request('http://localhost/api/crm/activities', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          leadId: '00000000-0000-4000-9000-000000000002',
          sourceType: 'task',
          sourceId: '00000000-0000-4000-9000-000000000003',
          type: 'task_completed',
          summary: 'Completed task',
        }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    expect(response.status).toBe(201);
    expect(createCrmActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceType: 'task',
        sourceId: '00000000-0000-4000-9000-000000000003',
        actorUserId: 'user-1',
      }),
    );
  });
});
