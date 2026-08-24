import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, captureLead } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  captureLead: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/leads', () => ({ captureLead }));

import { POST } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const contactId = '00000000-0000-4000-9000-000000000002';
const leadId = '00000000-0000-4000-9000-000000000003';

describe('CRM lead capture API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
  });

  it('rejects a capture payload without a contact channel or existing contact', async () => {
    const response = await POST(
      new Request('http://localhost/api/crm/capture', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          firstName: 'Ana',
          interest: 'seguro de salud',
          source: { kind: 'manual' },
        }),
      }),
    );
    expect(response.status).toBe(400);
    expect(captureLead).not.toHaveBeenCalled();
  });

  it('creates a new lead and returns 201 for a first capture', async () => {
    captureLead.mockResolvedValue({
      contact: { id: contactId },
      lead: { id: leadId },
      attribution: null,
      reused: false,
    });
    const response = await POST(
      new Request('http://localhost/api/crm/capture', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          firstName: 'Ana',
          email: 'ana@example.test',
          interest: 'seguro de salud',
          source: {
            kind: 'campaign',
            provider: 'meta',
            externalId: 'meta-lead-1',
            campaign: 'salud-abril',
          },
        }),
      }),
    );
    expect(response.status).toBe(201);
    expect(captureLead).toHaveBeenCalledWith(
      expect.objectContaining({ organizationId, firstName: 'Ana', email: 'ana@example.test' }),
      'user-1',
    );
  });

  it('returns 200 without duplicating when the external id was already captured', async () => {
    captureLead.mockResolvedValue({
      contact: { id: contactId },
      lead: { id: leadId },
      attribution: null,
      reused: true,
    });
    const response = await POST(
      new Request('http://localhost/api/crm/capture', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          firstName: 'Ana',
          email: 'ana@example.test',
          interest: 'seguro de salud',
          source: {
            kind: 'campaign',
            provider: 'meta',
            externalId: 'meta-lead-1',
            campaign: 'salud-abril',
          },
        }),
      }),
    );
    expect(response.status).toBe(200);
  });

  it('returns the authorization status without calling the service', async () => {
    authorizeCrm.mockResolvedValue({ allowed: false, status: 401 });
    const response = await POST(
      new Request('http://localhost/api/crm/capture', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          firstName: 'Ana',
          email: 'ana@example.test',
          interest: 'seguro de salud',
          source: { kind: 'manual' },
        }),
      }),
    );
    expect(response.status).toBe(401);
    expect(captureLead).not.toHaveBeenCalled();
  });

  it('redacts assignment failures as a forbidden CRM operation', async () => {
    captureLead.mockRejectedValue(new Error('CRM lead assignee is not allowed'));
    const response = await POST(
      new Request('http://localhost/api/crm/capture', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          contactId,
          interest: 'seguro de salud',
          source: { kind: 'manual' },
        }),
      }),
    );
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: {
        code: 'FORBIDDEN',
        message: 'CRM lead assignee is not allowed',
        traceId: expect.any(String),
      },
    });
  });
});
