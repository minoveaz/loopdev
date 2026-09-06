import { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { LeadContextPanel } from '@/suites/sales-crm/leads/LeadContextPanel';
import { LeadFilters } from '@/suites/sales-crm/leads/LeadFilters';
import { LeadTable } from '@/suites/sales-crm/leads/LeadTable';
import { LeadsRuntimeProvider, useLeadsRuntime } from '@/suites/sales-crm/leads/runtime';
import type { LeadRowViewModel } from '@/suites/sales-crm/leads/types';

const pushMock = vi.fn();

vi.mock('@/hooks/useOrganizationPermissions', () => ({
  useOrganizationPermissions: () => ({
    isLoading: false,
    hasPermission: () => true,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  usePathname: () => '/sales-crm/leads',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

function SelectedLeadHarness({ lead }: { lead: LeadRowViewModel | null }) {
  const { selectLead, clearSelectedLead } = useLeadsRuntime();
  useEffect(() => {
    if (lead) selectLead(lead);
    else clearSelectedLead();
  }, [lead, selectLead, clearSelectedLead]);
  return <LeadContextPanel />;
}

const row: LeadRowViewModel = {
  id: 'lead-1',
  contactId: 'contact-1',
  status: 'nuevo',
  statusLabel: 'Nuevo',
  sourceKind: 'manual',
  sourceLabel: 'Manual',
  interest: 'Seguro',
  assignedUserId: null,
  brandId: null,
  workspaceId: null,
  duplicateReviewId: null,
  campaign: null,
  createdAt: '2026-08-18T00:00:00.000Z',
  updatedAt: '2026-08-18T00:00:00.000Z',
};

describe('Leads list components', () => {
  it('renders semantic mobile cards and selects a desktop row', () => {
    const onSelect = vi.fn();
    const onMobileSelect = vi.fn();
    render(
      <LeadTable rows={[row]} state="ready" onSelect={onSelect} onMobileSelect={onMobileSelect} />,
    );

    expect(screen.getAllByText('contact-1').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir Lead contact-1' }));
    expect(onMobileSelect).toHaveBeenCalledWith(row);
  });

  it.each(['loading', 'empty', 'filtered-empty', 'error', 'forbidden'] as const)(
    'renders the %s state',
    (state) => {
      render(<LeadTable rows={[]} state={state} onSelect={vi.fn()} onMobileSelect={vi.fn()} />);
      expect(screen.getByRole('region', { name: 'Scrollable data table' })).toBeInTheDocument();
    },
  );

  it('keeps filter state controlled and exposes a search label', () => {
    const onQueryChange = vi.fn();
    const onFilterChange = vi.fn();
    render(
      <LeadFilters
        query=""
        onQueryChange={onQueryChange}
        filters={{}}
        onFilterChange={onFilterChange}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar leads' }), {
      target: { value: 'contact-1' },
    });
    expect(onQueryChange).toHaveBeenCalledWith('contact-1');
    expect(screen.getByRole('button', { name: 'Estado' })).toBeInTheDocument();
  });

  it('allows clearing a debounced search', () => {
    const onQueryChange = vi.fn();
    render(
      <LeadFilters
        query="contact-1"
        onQueryChange={onQueryChange}
        filters={{}}
        onFilterChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
    expect(onQueryChange).toHaveBeenCalledWith('');
  });

  it('passes axe in the ready state', async () => {
    const { container } = render(
      <LeadTable rows={[row]} state="ready" onSelect={vi.fn()} onMobileSelect={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LeadContextPanel', () => {
  it('renders nothing when there is no selected lead', () => {
    const { container } = render(
      <LeadsRuntimeProvider>
        <SelectedLeadHarness lead={null} />
      </LeadsRuntimeProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the selected lead summary and clears selection on close', () => {
    render(
      <LeadsRuntimeProvider>
        <SelectedLeadHarness lead={row} />
      </LeadsRuntimeProvider>,
    );

    expect(screen.getByText('contact-1')).toBeInTheDocument();
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.getByText('Seguro')).toBeInTheDocument();
    expect(screen.getByText('Sin asignar')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByText('contact-1')).not.toBeInTheDocument();
  });

  it('navigates to the lead record and to the related contact', () => {
    pushMock.mockClear();
    render(
      <LeadsRuntimeProvider>
        <SelectedLeadHarness lead={row} />
      </LeadsRuntimeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ver ficha' }));
    expect(pushMock).toHaveBeenCalledWith('/sales-crm/leads/lead-1');

    fireEvent.click(screen.getByRole('button', { name: 'Abrir Contacto' }));
    expect(pushMock).toHaveBeenCalledWith('/sales-crm/contacts?q=contact-1');
  });

  it('offers the Opportunity action only for qualified leads with manage permission', () => {
    render(
      <LeadsRuntimeProvider>
        <SelectedLeadHarness lead={{ ...row, status: 'cualificado', statusLabel: 'Cualificado' }} />
      </LeadsRuntimeProvider>,
    );

    const createOpportunity = screen.getByRole('button', { name: 'Crear Opportunity' });
    expect(createOpportunity).toBeEnabled();
  });

  it('passes axe with a selected lead', async () => {
    const { container } = render(
      <LeadsRuntimeProvider>
        <SelectedLeadHarness lead={row} />
      </LeadsRuntimeProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
