import { afterEach, describe, expect, it, vi } from 'vitest';
import { CrmLeadSchema } from '@loopdev/contracts';
import { getLeads, LeadApiError } from '@/suites/sales-crm/leads/api';
import {
  getLeadSourceLabel,
  getLeadStatusLabel,
  mapLeadToRowViewModel,
} from '@/suites/sales-crm/leads/mapper';

const organizationId = '00000000-0000-4000-9000-000000000001';
const leadId = '00000000-0000-4000-9000-000000000002';
const contactId = '00000000-0000-4000-9000-000000000003';
const timestamp = '2026-08-18T00:00:00.000Z';

const lead = CrmLeadSchema.parse({
  id: leadId,
  organizationId,
  contactId,
  status: 'cualificado',
  interest: 'Seguro de hogar',
  assignedUserId: null,
  source: { kind: 'whatsapp_simulated', provider: null, externalId: null, campaign: null, utm: {} },
  duplicateReviewId: null,
  createdAt: timestamp,
  updatedAt: timestamp,
});

afterEach(() => vi.unstubAllGlobals());

describe('Leads UI boundary', () => {
  it('maps a domain lead into a presentation row without changing identifiers', () => {
    expect(mapLeadToRowViewModel(lead)).toMatchObject({
      id: leadId,
      contactId,
      statusLabel: 'Cualificado',
      sourceLabel: 'WhatsApp simulado',
      interest: 'Seguro de hogar',
    });
  });

  it('exposes stable status/source label helpers beyond the sample lead', () => {
    expect(getLeadStatusLabel('convertido')).toBe('Convertido');
    expect(getLeadSourceLabel('partner')).toBe('Partner');
  });

  it('builds a bounded typed GET request and validates the page response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [lead], nextCursor: null, hasMore: false }), {
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const page = await getLeads({ organizationId, status: 'cualificado', limit: 25 });

    expect(page.items[0]?.id).toBe(leadId);
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/crm/leads?organizationId=${organizationId}&limit=25&status=cualificado`,
      { signal: undefined },
    );
  });

  it('serializes tenant-aware filters including source', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [], nextCursor: null, hasMore: false }), {
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await getLeads({ organizationId, status: 'cualificado', source: 'campaign', limit: 25 });

    const url = new URL(fetchMock.mock.calls[0]?.[0] as string, 'http://localhost');
    expect(url.searchParams.get('organizationId')).toBe(organizationId);
    expect(url.searchParams.get('status')).toBe('cualificado');
    expect(url.searchParams.get('source')).toBe('campaign');
  });

  it('maps forbidden responses to a safe typed error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'Unauthorized', code: 'FORBIDDEN' }), {
          status: 403,
        }),
      ),
    );

    await expect(getLeads({ organizationId, limit: 25 })).rejects.toEqual(
      expect.objectContaining<Partial<LeadApiError>>({ code: 'FORBIDDEN', status: 403 }),
    );
  });

  it('maps an invalid/unparseable response to a safe UNKNOWN error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));

    await expect(getLeads({ organizationId, limit: 25 })).rejects.toEqual(
      expect.objectContaining<Partial<LeadApiError>>({ code: 'UNKNOWN', status: 502 }),
    );
  });
});
