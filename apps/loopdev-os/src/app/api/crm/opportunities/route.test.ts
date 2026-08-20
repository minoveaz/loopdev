import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, createManualOpportunity, listOpportunities } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  createManualOpportunity: vi.fn(),
  listOpportunities: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/pipeline', () => ({ createManualOpportunity, listOpportunities }));
vi.mock('@/services/crm/leads', () => ({ createOpportunityFromLead: vi.fn() }));

import { GET, POST } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const workspaceId = '00000000-0000-4000-9000-000000000002';
const contactId = '00000000-0000-4000-9000-000000000003';

describe('CRM opportunities API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: true, status: 200, userId: 'user-1' });
    listOpportunities.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    createManualOpportunity.mockResolvedValue({
      opportunity: { id: 'opportunity-1' },
      created: true,
    });
  });

  it('lists opportunities through the bounded CRM query', async () => {
    const response = await GET(
      new Request(
        `http://localhost/api/crm/opportunities?organizationId=${organizationId}&workspaceId=${workspaceId}&limit=20`,
      ),
    );
    expect(response.status).toBe(200);
    expect(authorizeCrm).toHaveBeenCalledWith(organizationId, 'crm.read');
    expect(listOpportunities).toHaveBeenCalledWith({
      organizationId,
      workspaceId,
      limit: 20,
    });
  });

  it('rejects malformed commands before authorization or persistence', async () => {
    const response = await POST(
      new Request('http://localhost/api/crm/opportunities', {
        method: 'POST',
        body: JSON.stringify({ organizationId, name: 'Incomplete' }),
      }),
    );
    expect(response.status).toBe(400);
    expect(authorizeCrm).not.toHaveBeenCalled();
    expect(createManualOpportunity).not.toHaveBeenCalled();
  });

  it('creates a manual opportunity and preserves idempotent status', async () => {
    const response = await POST(
      new Request('http://localhost/api/crm/opportunities', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          workspaceId,
          contactId,
          productKey: 'health',
          name: 'Health opportunity',
          currency: 'EUR',
          idempotencyKey: 'opportunity-test-1',
        }),
      }),
    );
    expect(response.status).toBe(201);
    expect(createManualOpportunity).toHaveBeenCalledWith(
      {
        organizationId,
        workspaceId,
        contactId,
        productKey: 'health',
        name: 'Health opportunity',
        currency: 'EUR',
        idempotencyKey: 'opportunity-test-1',
      },
      'user-1',
    );
  });

  it('returns authorization failures without touching the service', async () => {
    authorizeCrm.mockResolvedValue({ allowed: false, status: 403 });
    const response = await GET(
      new Request(`http://localhost/api/crm/opportunities?organizationId=${organizationId}`),
    );
    expect(response.status).toBe(403);
    expect(listOpportunities).not.toHaveBeenCalled();
  });
});
