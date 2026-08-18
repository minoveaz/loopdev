import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, listLeads, updateLead } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  listLeads: vi.fn(),
  updateLead: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/leads', () => ({ listLeads, updateLead }));

import { GET, PATCH } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const leadId = '00000000-0000-4000-9000-000000000002';
const timestamp = '2026-08-18T00:00:00.000Z';

describe('CRM leads API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
    listLeads.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    updateLead.mockResolvedValue({ id: leadId });
  });

  it('lists leads with an authorized bounded query', async () => {
    const response = await GET(
      new Request(`http://localhost/api/crm/leads?organizationId=${organizationId}&status=nuevo&limit=20`),
    );
    expect(response.status).toBe(200);
    expect(authorizeCrm).toHaveBeenCalledWith(organizationId, 'crm.read');
    expect(listLeads).toHaveBeenCalledWith({ organizationId, status: 'nuevo', limit: 20 });
  });

  it('rejects an invalid query before calling the service', async () => {
    const response = await GET(new Request('http://localhost/api/crm/leads?organizationId=not-a-uuid'));
    expect(response.status).toBe(400);
    expect(listLeads).not.toHaveBeenCalled();
  });

  it('returns the authorization status without calling the service', async () => {
    authorizeCrm.mockResolvedValue({ allowed: false, status: 403 });
    const response = await GET(new Request(`http://localhost/api/crm/leads?organizationId=${organizationId}`));
    expect(response.status).toBe(403);
    expect(listLeads).not.toHaveBeenCalled();
  });

  it('requires the expected version for updates', async () => {
    const response = await PATCH(
      new Request('http://localhost/api/crm/leads', {
        method: 'PATCH',
        body: JSON.stringify({ organizationId, leadId, interest: 'seguro de hogar' }),
      }),
    );
    expect(response.status).toBe(400);
    expect(updateLead).not.toHaveBeenCalled();
  });

  it('forwards an authorized optimistic update', async () => {
    const response = await PATCH(
      new Request('http://localhost/api/crm/leads', {
        method: 'PATCH',
        body: JSON.stringify({ organizationId, leadId, interest: 'seguro de hogar', expectedUpdatedAt: timestamp }),
      }),
    );
    expect(response.status).toBe(200);
    expect(updateLead).toHaveBeenCalledWith({
      organizationId,
      leadId,
      interest: 'seguro de hogar',
      expectedUpdatedAt: timestamp,
    });
  });

  it('returns a conflict when the lead changed or no longer exists', async () => {
    updateLead.mockRejectedValue(new Error('CRM lead update conflict or not found'));
    const response = await PATCH(
      new Request('http://localhost/api/crm/leads', {
        method: 'PATCH',
        body: JSON.stringify({ organizationId, leadId, interest: 'seguro de hogar', expectedUpdatedAt: timestamp }),
      }),
    );
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: 'CRM lead update conflict or not found', code: 'CONFLICT' });
  });
});
