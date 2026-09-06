import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LeadRecordView } from '@/suites/sales-crm/leads/LeadRecordView';

const organizationId = '00000000-0000-4000-9000-000000000001';
const leadId = '00000000-0000-4000-9000-000000000002';
const timestamp = '2026-08-24T00:00:00.000Z';
const lead = {
  id: leadId,
  organizationId,
  contactId: '00000000-0000-4000-9000-000000000003',
  status: 'nuevo',
  interest: 'Seguro',
  assignedUserId: null,
  source: { kind: 'manual', provider: null, externalId: null, campaign: null, utm: {} },
  duplicateReviewId: null,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const { getLeadById, getLeadCustomer360, updateLead, MockLeadApiError } = vi.hoisted(() => {
  class MockLeadApiError extends Error {
    code = 'CONFLICT';
    status = 409;
  }
  return {
    getLeadById: vi.fn(),
    getLeadCustomer360: vi.fn(),
    updateLead: vi.fn(),
    MockLeadApiError,
  };
});
const permission = vi.hoisted(() => ({ canRead: true }));

vi.mock('@/suites/sales-crm/leads/api', () => ({
  getLeadById,
  getLeadCustomer360,
  updateLead,
  moveLeadStatus: vi.fn(),
  LeadApiError: MockLeadApiError,
}));
vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: () => ({ activeOrganizationId: organizationId }),
}));
vi.mock('@/hooks/useOrganizationPermissions', () => ({
  useOrganizationPermissions: () => ({
    isLoading: false,
    hasPermission: (name: string) => (name === 'crm.read' ? permission.canRead : true),
  }),
}));
vi.mock('next/navigation', () => ({
  useParams: () => ({ leadId }),
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => {
  permission.canRead = true;
  getLeadById.mockReset();
  getLeadCustomer360.mockReset();
  updateLead.mockReset();
});

describe('LeadRecordView', () => {
  it('gates detail loading by crm.read', () => {
    permission.canRead = false;
    render(<LeadRecordView />);
    expect(screen.getByText('No tienes permiso para ver Leads.')).toBeInTheDocument();
    expect(getLeadById).not.toHaveBeenCalled();
  });

  it('shows a stale refresh action after an optimistic update conflict', async () => {
    getLeadById.mockResolvedValue(lead);
    getLeadCustomer360.mockResolvedValue({
      view: 'record',
      contact: {
        id: lead.contactId,
        organizationId,
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana@example.test',
        phone: null,
        companyName: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      leads: [lead],
      opportunities: [],
      tasks: [],
      notes: [],
      timeline: [],
      cursors: { leads: null, opportunities: null, tasks: null, notes: null, timeline: null },
      sectionState: {
        profile: 'fresh',
        leads: 'fresh',
        opportunities: 'fresh',
        tasks: 'fresh',
        notes: 'fresh',
        timeline: 'fresh',
      },
      sectionPermissions: {
        profile: true,
        leads: true,
        opportunities: true,
        tasks: true,
        notes: true,
        timeline: true,
      },
    });
    updateLead.mockRejectedValue(new MockLeadApiError('Stale lead'));
    render(<LeadRecordView />);

    expect((await screen.findAllByRole('heading', { name: 'Ana García' })).length).toBeGreaterThan(
      0,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Editar y reasignar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText(/cambió mientras lo editabas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actualizar datos' })).toBeInTheDocument();
  });
});
