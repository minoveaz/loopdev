import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, getLead } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  getLead: vi.fn(),
}));

vi.mock('../../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/leads', () => ({ getLead }));

import { GET } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const leadId = '00000000-0000-4000-9000-000000000002';

describe('CRM lead detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
  });

  it('requires a valid tenant before loading a lead', async () => {
    const response = await GET(
      new Request('http://localhost/api/crm/leads/not-a-lead?organizationId=bad'),
      { params: Promise.resolve({ leadId }) },
    );
    expect(response.status).toBe(400);
    expect(getLead).not.toHaveBeenCalled();
  });

  it('returns the scoped lead for an authorized reader', async () => {
    getLead.mockResolvedValue({ id: leadId, organizationId });
    const response = await GET(
      new Request(`http://localhost/api/crm/leads/${leadId}?organizationId=${organizationId}`),
      { params: Promise.resolve({ leadId }) },
    );
    expect(response.status).toBe(200);
    expect(getLead).toHaveBeenCalledWith(organizationId, leadId);
  });

  it('rejects an invalid lead id before authorization or service access', async () => {
    const response = await GET(
      new Request(`http://localhost/api/crm/leads/not-a-lead?organizationId=${organizationId}`),
      { params: Promise.resolve({ leadId: 'not-a-lead' }) },
    );
    expect(response.status).toBe(400);
    expect(authorizeCrm).not.toHaveBeenCalled();
    expect(getLead).not.toHaveBeenCalled();
  });

  it('returns not found without leaking service details', async () => {
    getLead.mockResolvedValue(null);
    const response = await GET(
      new Request(`http://localhost/api/crm/leads/${leadId}?organizationId=${organizationId}`),
      { params: Promise.resolve({ leadId }) },
    );
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Lead not found', code: 'NOT_FOUND' });
  });
});
