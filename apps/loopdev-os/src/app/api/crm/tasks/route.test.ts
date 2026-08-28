import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, createTask, listTasks } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  createTask: vi.fn(),
  listTasks: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/tasks', () => ({ createTask, listTasks }));

import { GET, POST } from './route';

const organizationId = '00000000-0000-4200-9000-000000000001';
const relationId = '00000000-0000-4200-9000-000000000002';

describe('CRM Tasks API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
    listTasks.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    createTask.mockResolvedValue({ created: true, task: { id: 'task-1' } });
  });

  it('rejects invalid queries before authorization', async () => {
    const response = await GET(
      new Request('http://localhost/api/crm/tasks?organizationId=bad'),
    );
    expect(response.status).toBe(400);
    expect(authorizeCrm).not.toHaveBeenCalled();
  });

  it('authorizes bounded task listing', async () => {
    const response = await GET(
      new Request(
        `http://localhost/api/crm/tasks?organizationId=${organizationId}&limit=10&status=open`,
      ),
    );
    expect(response.status).toBe(200);
    expect(authorizeCrm).toHaveBeenCalledWith(organizationId, 'crm.read');
    expect(listTasks).toHaveBeenCalledWith({
      organizationId,
      limit: 10,
      status: 'open',
    });
  });

  it('uses the authenticated actor and idempotency header for creation', async () => {
    const response = await POST(
      new Request('http://localhost/api/crm/tasks', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'idempotency-key': 'tasks-create-001' },
        body: JSON.stringify({
          organizationId,
          title: 'Call customer',
          relationType: 'lead',
          relationId,
        }),
      }),
    );
    expect(response.status).toBe(201);
    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId,
        relationType: 'lead',
        idempotencyKey: 'tasks-create-001',
        actorUserId: 'user-1',
      }),
    );
  });
});
