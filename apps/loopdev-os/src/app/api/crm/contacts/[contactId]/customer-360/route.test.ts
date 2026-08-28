import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, getCustomer360Read } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  getCustomer360Read: vi.fn(),
}));

vi.mock('../../../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/customer360', () => ({ getCustomer360Read }));

import { GET } from './route';

const tenantId = '00000000-0000-4200-9000-000000000001';
const contactId = '00000000-0000-4200-9000-000000000002';

describe('Customer 360 API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
    getCustomer360Read.mockResolvedValue({ view: 'record', sectionState: { profile: 'fresh' } });
  });

  it('rejects invalid scope before authorization', async () => {
    const response = await GET(
      new Request(`http://localhost/api/crm/contacts/${contactId}/customer-360?organizationId=bad`),
      { params: Promise.resolve({ contactId }) },
    );
    expect(response.status).toBe(400);
    expect(authorizeCrm).not.toHaveBeenCalled();
  });

  it('authorizes the tenant and forwards the selected view', async () => {
    const response = await GET(
      new Request(
        `http://localhost/api/crm/contacts/${contactId}/customer-360?organizationId=${tenantId}&view=overview&workspaceId=${contactId}`,
      ),
      { params: Promise.resolve({ contactId }) },
    );
    expect(response.status).toBe(200);
    expect(authorizeCrm).toHaveBeenCalledWith(tenantId, 'crm.read');
    expect(getCustomer360Read).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId,
        contactId,
        view: 'overview',
      }),
      'user-1',
    );
  });

  it('does not read the projection without CRM permission', async () => {
    authorizeCrm.mockResolvedValue({ allowed: false, status: 403 });
    const response = await GET(
      new Request(
        `http://localhost/api/crm/contacts/${contactId}/customer-360?organizationId=${tenantId}`,
      ),
      { params: Promise.resolve({ contactId }) },
    );
    expect(response.status).toBe(403);
    expect(getCustomer360Read).not.toHaveBeenCalled();
  });
});
