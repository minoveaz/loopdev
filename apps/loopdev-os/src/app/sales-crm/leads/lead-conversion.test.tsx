import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CrmLead } from '@loopdev/contracts';
import { CreateOpportunityFromLead } from '@/suites/sales-crm/leads/CreateOpportunityFromLead';
import {
  canConvertQualifiedLead,
  QualifiedLeadGuard,
} from '@/suites/sales-crm/leads/QualifiedLeadGuard';

const { createOpportunityFromLead } = vi.hoisted(() => ({
  createOpportunityFromLead: vi.fn(),
}));
vi.mock('@/suites/sales-crm/leads/api', () => ({
  createOpportunityFromLead,
  LeadApiError: class LeadApiError extends Error {
    constructor(
      message: string,
      public readonly code: string,
      public readonly status: number,
    ) {
      super(message);
    }
  },
}));

const lead = {
  id: '00000000-0000-4000-9000-000000000002',
  organizationId: '00000000-0000-4000-9000-000000000001',
  contactId: '00000000-0000-4000-9000-000000000003',
  status: 'cualificado',
  interest: 'Seguro de hogar',
} as CrmLead;

describe('Lead conversion UI', () => {
  it('enables conversion for managed qualified or converted Leads', () => {
    const onConvert = vi.fn();
    const { rerender } = render(<QualifiedLeadGuard lead={lead} canManage onConvert={onConvert} />);
    fireEvent.click(screen.getByRole('button', { name: 'Crear Opportunity' }));
    expect(onConvert).toHaveBeenCalledOnce();
    rerender(
      <QualifiedLeadGuard lead={{ status: 'convertido' }} canManage onConvert={onConvert} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Crear Opportunity' }));
    expect(onConvert).toHaveBeenCalledTimes(2);
    rerender(<QualifiedLeadGuard lead={{ status: 'nuevo' }} canManage onConvert={onConvert} />);
    expect(screen.queryByRole('button', { name: 'Crear Opportunity' })).not.toBeInTheDocument();
    expect(canConvertQualifiedLead({ status: 'cualificado' }, false)).toBe(false);
  });

  it('allows a converted Lead to submit another product', async () => {
    createOpportunityFromLead.mockResolvedValue({
      outcome: 'created',
      opportunity: {
        id: '00000000-0000-4000-9000-000000000005',
        name: 'Seguro de salud',
        stageKey: 'qualified',
      },
    });
    render(
      <CreateOpportunityFromLead
        open
        organizationId={lead.organizationId}
        lead={{ ...lead, status: 'convertido' }}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Producto o interés' }), {
      target: { value: 'Seguro de salud' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Crear Opportunity' }));

    expect(await screen.findByText('Opportunity creada')).toBeInTheDocument();
    expect(createOpportunityFromLead).toHaveBeenCalledWith(
      expect.objectContaining({ productKey: 'Seguro de salud' }),
    );
  });

  it('requires product/interés and does not expose an editable contact', async () => {
    render(
      <CreateOpportunityFromLead
        open
        organizationId={lead.organizationId}
        lead={lead}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    expect(screen.getByText('Contacto heredado del Lead')).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /contact/i })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Producto o interés' }), {
      target: { value: '' },
    });
    fireEvent.submit(document.getElementById('lead-conversion-form') as HTMLFormElement);
    expect(
      await screen.findByText('Indica un producto o interés para crear la Opportunity.'),
    ).toBeInTheDocument();
  });

  it('renders an idempotent result after converting without a contactId command field', async () => {
    createOpportunityFromLead.mockResolvedValue({
      outcome: 'existing',
      opportunity: {
        id: '00000000-0000-4000-9000-000000000004',
        name: 'Seguro de hogar',
        stageKey: 'qualified',
      },
    });
    render(
      <CreateOpportunityFromLead
        open
        organizationId={lead.organizationId}
        lead={lead}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Producto o interés' }), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Crear Opportunity' }));
    expect(await screen.findByText('Opportunity existente reutilizada')).toBeInTheDocument();
    expect(createOpportunityFromLead).toHaveBeenCalledWith({
      organizationId: lead.organizationId,
      leadId: lead.id,
      productKey: 'Seguro de hogar',
      name: 'Seguro de hogar',
    });
    expect(createOpportunityFromLead.mock.calls[0]?.[0]).not.toHaveProperty('contactId');
  });
});
