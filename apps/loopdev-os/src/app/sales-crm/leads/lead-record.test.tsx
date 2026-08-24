import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LeadDetailViewModel, LeadRowViewModel } from '@/suites/sales-crm/leads/types';
import { LeadRecordPreview } from '@/suites/sales-crm/leads/LeadRecordPreview';
import {
  createOpportunityFromLead,
  getLeadById,
  moveLeadStatus,
  updateLead,
} from '@/suites/sales-crm/leads/api';

const organizationId = '00000000-0000-4000-9000-000000000001';
const leadId = '00000000-0000-4000-9000-000000000002';
const contactId = '00000000-0000-4000-9000-000000000003';
const timestamp = '2026-08-24T00:00:00.000Z';

const lead = {
  id: leadId,
  organizationId,
  contactId,
  status: 'cualificado',
  interest: 'Seguro de hogar',
  assignedUserId: null,
  source: {
    kind: 'campaign',
    provider: 'crm',
    externalId: 'campaign-1',
    campaign: 'abril',
    utm: {},
  },
  duplicateReviewId: null,
  createdAt: timestamp,
  updatedAt: timestamp,
} as const;

const row: LeadRowViewModel = {
  ...lead,
  statusLabel: 'Cualificado',
  sourceKind: 'campaign',
  sourceLabel: 'Campaña',
  interest: lead.interest,
  assignedUserId: null,
  brandId: null,
  workspaceId: null,
  duplicateReviewId: null,
  campaign: 'abril',
};

const detail = {
  lead,
  contact: {
    id: contactId,
    organizationId,
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana@example.test',
    phone: null,
    companyName: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  opportunities: [{ id: 'opportunity-1', leadId, name: 'Seguro hogar' }],
  activity: [
    {
      kind: 'event',
      source: { sourceType: 'timeline_event', sourceId: 'event-1' },
      event: { summary: 'Llamada registrada' },
    },
  ],
  state: 'ready',
} as unknown as LeadDetailViewModel;

afterEach(() => vi.unstubAllGlobals());

describe('LeadRecordPreview', () => {
  it('renders state, attribution, contact, opportunity and activity', () => {
    render(
      <LeadRecordPreview
        lead={row}
        initialDetail={detail}
        onClose={vi.fn()}
        onOpenRecord={vi.fn()}
        onOpenContact={vi.fn()}
      />,
    );

    expect(screen.getByTestId('lead-record-preview')).toBeInTheDocument();
    expect(screen.getByText('Cualificado')).toBeInTheDocument();
    expect(screen.getAllByText('Campaña').length).toBeGreaterThan(0);
    expect(screen.getByText('ana@example.test')).toBeInTheDocument();
    expect(screen.getByText('Seguro hogar')).toBeInTheDocument();
    expect(screen.getByText('Llamada registrada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Contacto' })).toBeInTheDocument();
  });

  it('keeps the close and record actions available to keyboard users', () => {
    const onClose = vi.fn();
    const onOpenRecord = vi.fn();
    render(
      <LeadRecordPreview
        lead={row}
        initialDetail={detail}
        onClose={onClose}
        onOpenRecord={onOpenRecord}
        onOpenContact={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver ficha' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onOpenRecord).toHaveBeenCalledOnce();
  });
});

describe('Lead detail API adapter', () => {
  it('loads a scoped Lead by id', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(lead), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await getLeadById(organizationId, leadId);

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/crm/leads/${leadId}?organizationId=${organizationId}`,
      { signal: undefined },
    );
  });

  it('preserves stale conflicts from update and status mutations', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: { code: 'CONFLICT', message: 'Stale lead' } }), {
          status: 409,
        }),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      updateLead({ organizationId, leadId, interest: 'Nuevo', expectedUpdatedAt: timestamp }),
    ).rejects.toMatchObject({ code: 'CONFLICT', status: 409 });
    await expect(
      moveLeadStatus({
        organizationId,
        leadId,
        status: 'contactado',
        expectedUpdatedAt: timestamp,
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT', status: 409 });
  });

  it('maps conversion HTTP status to created or existing without sending contactId', async () => {
    const opportunity = {
      id: '00000000-0000-4000-9000-000000000004',
      organizationId,
      contactId,
      leadId,
      productKey: 'health',
      stageKey: 'qualified',
      name: 'Health opportunity',
      origin: 'lead_conversion',
      amount: null,
      currency: 'EUR',
      probability: null,
      expectedCloseAt: null,
      assignedUserId: null,
      activityHealth: 'unknown',
      lastActivity: null,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(opportunity), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await createOpportunityFromLead({
      organizationId,
      leadId,
      productKey: 'Health',
      name: 'Health opportunity',
    });

    expect(result.outcome).toBe('existing');
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain('contactId');
  });
});
