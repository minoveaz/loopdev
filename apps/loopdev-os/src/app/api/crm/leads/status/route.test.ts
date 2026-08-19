import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, moveLeadStatus } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  moveLeadStatus: vi.fn(),
}));

vi.mock('../../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/leads', () => ({ moveLeadStatus }));

import { POST } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const leadId = '00000000-0000-4000-9000-000000000002';
const timestamp = '2026-08-18T00:00:00.000Z';

describe('CRM lead status API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
  });

  it('rejects an unknown target status before calling the service', async () => {
    const response = await POST(
      new Request('http://localhost/api/crm/leads/status', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          leadId,
          status: 'unknown',
          expectedUpdatedAt: timestamp,
        }),
      }),
    );
    expect(response.status).toBe(400);
    expect(moveLeadStatus).not.toHaveBeenCalled();
  });

  it('forwards an authorized status move', async () => {
    moveLeadStatus.mockResolvedValue({ id: leadId, status: 'cualificado' });
    const response = await POST(
      new Request('http://localhost/api/crm/leads/status', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          leadId,
          status: 'cualificado',
          expectedUpdatedAt: timestamp,
        }),
      }),
    );
    expect(response.status).toBe(200);
    expect(moveLeadStatus).toHaveBeenCalledWith(
      { organizationId, leadId, status: 'cualificado', expectedUpdatedAt: timestamp },
      'user-1',
    );
  });

  it('rejects moving a lead into convertido directly', async () => {
    moveLeadStatus.mockRejectedValue(new Error('CRM lead status transition is not allowed'));
    const response = await POST(
      new Request('http://localhost/api/crm/leads/status', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          leadId,
          status: 'convertido',
          expectedUpdatedAt: timestamp,
        }),
      }),
    );
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: {
        code: 'INVALID_STATUS_TRANSITION',
        message: 'CRM lead status transition is not allowed',
        traceId: expect.any(String),
      },
    });
  });
});
