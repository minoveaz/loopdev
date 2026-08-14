import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, lookupCrmEntities } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  lookupCrmEntities: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/operations', () => ({ lookupCrmEntities }));

import { GET } from './route';

describe('CRM lookup API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
    lookupCrmEntities.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
  });

  it('requires a non-empty bounded query', async () => {
    const response = await GET(new Request('http://localhost/api/crm/lookup?organizationId=00000000-0000-4000-9000-000000000001&query='));
    expect(response.status).toBe(400);
    expect(lookupCrmEntities).not.toHaveBeenCalled();
  });

  it('forwards an authorized lookup query', async () => {
    const organizationId = '00000000-0000-4000-9000-000000000001';
    const response = await GET(new Request(`http://localhost/api/crm/lookup?organizationId=${organizationId}&query=Ana`));
    expect(response.status).toBe(200);
    expect(lookupCrmEntities).toHaveBeenCalledWith({ organizationId, query: 'Ana', limit: 20 });
  });
});
