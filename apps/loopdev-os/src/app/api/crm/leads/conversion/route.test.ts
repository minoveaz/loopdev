import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, createOpportunityFromLead } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  createOpportunityFromLead: vi.fn(),
}));

vi.mock('../../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/leads', () => ({ createOpportunityFromLead }));

import { POST } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const leadId = '00000000-0000-4000-9000-000000000002';
const opportunityId = '00000000-0000-4000-9000-000000000003';

describe('CRM lead conversion API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
  });

  it('rejects a conversion payload without a product key', async () => {
    const response = await POST(
      new Request('http://localhost/api/crm/leads/conversion', {
        method: 'POST',
        body: JSON.stringify({ organizationId, leadId, name: 'Proteccion salud' }),
      }),
    );
    expect(response.status).toBe(400);
    expect(createOpportunityFromLead).not.toHaveBeenCalled();
  });

  it('returns 201 when a new conversion opportunity is created', async () => {
    createOpportunityFromLead.mockResolvedValue({
      opportunity: { id: opportunityId },
      created: true,
    });
    const response = await POST(
      new Request('http://localhost/api/crm/leads/conversion', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          leadId,
          productKey: 'health',
          name: 'Proteccion salud',
        }),
      }),
    );
    expect(response.status).toBe(201);
  });

  it('returns 200 and the existing opportunity for a repeated conversion', async () => {
    createOpportunityFromLead.mockResolvedValue({
      opportunity: { id: opportunityId },
      created: false,
    });
    const response = await POST(
      new Request('http://localhost/api/crm/leads/conversion', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          leadId,
          productKey: 'health',
          name: 'Proteccion salud',
        }),
      }),
    );
    expect(response.status).toBe(200);
  });

  it('returns a conflict when the lead is not qualified for conversion', async () => {
    createOpportunityFromLead.mockRejectedValue(
      new Error('CRM lead is not qualified for conversion'),
    );
    const response = await POST(
      new Request('http://localhost/api/crm/leads/conversion', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          leadId,
          productKey: 'health',
          name: 'Proteccion salud',
        }),
      }),
    );
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: {
        code: 'INVALID_STATUS_TRANSITION',
        message: 'CRM lead is not qualified for conversion',
        traceId: expect.any(String),
      },
    });
  });
});
