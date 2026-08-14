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
    const response = await GET(new Request('http://localhost/api/crm/activities?organizationId=bad'));
    expect(response.status).toBe(400);
    expect(authorizeCrm).not.toHaveBeenCalled();
  });

  it('authorizes and forwards bounded cursor queries', async () => {
    const response = await GET(new Request(`http://localhost/api/crm/activities?organizationId=${organizationId}&limit=10&cursor=abc`));
    expect(response.status).toBe(200);
    expect(authorizeCrm).toHaveBeenCalledWith(organizationId, 'crm.read');
    expect(listCrmActivities).toHaveBeenCalledWith({ organizationId, limit: 10, cursor: 'abc' });
  });
});
