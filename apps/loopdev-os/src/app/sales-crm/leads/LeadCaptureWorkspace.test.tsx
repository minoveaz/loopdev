import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeedbackProvider } from '@loopdev/ui';
import { LeadCaptureWorkspace } from '@/suites/sales-crm/leads/LeadCaptureWorkspace';

const organizationId = '00000000-0000-4000-9000-000000000001';
const contactId = '00000000-0000-4000-9000-000000000002';
const leadId = '00000000-0000-4000-9000-000000000003';
const timestamp = '2026-08-24T00:00:00.000Z';

const contact = {
  id: contactId,
  organizationId,
  firstName: 'Ana',
  lastName: 'García',
  email: 'ana@example.test',
  phone: null,
  companyName: null,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const lead = {
  id: leadId,
  organizationId,
  contactId,
  status: 'nuevo',
  interest: 'Seguro de hogar',
  assignedUserId: null,
  source: { kind: 'manual', provider: null, externalId: null, campaign: null, utm: {} },
  duplicateReviewId: null,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const pushMock = vi.fn();
let organizationState: { activeOrganizationId: string | null } = {
  activeOrganizationId: organizationId,
};
let permissionsState: { isLoading: boolean; permissions: string[] } = {
  isLoading: false,
  permissions: ['crm.read', 'crm.manage'],
};

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
}));

vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: () => organizationState,
}));

vi.mock('@/hooks/useOrganizationPermissions', () => ({
  useOrganizationPermissions: (required: string[]) => ({
    isLoading: permissionsState.isLoading,
    hasPermission: (permission: string) =>
      required.includes(permission) && permissionsState.permissions.includes(permission),
  }),
}));

function renderWorkspace() {
  return render(
    <FeedbackProvider>
      <LeadCaptureWorkspace />
    </FeedbackProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  pushMock.mockClear();
  organizationState = { activeOrganizationId: organizationId };
  permissionsState = { isLoading: false, permissions: ['crm.read', 'crm.manage'] };
});

describe('LeadCaptureWorkspace', () => {
  it('shows a loading placeholder while permissions or organization resolve', () => {
    permissionsState = { isLoading: true, permissions: [] };
    renderWorkspace();
    expect(screen.getByText('Preparando captura de Lead...')).toBeInTheDocument();
  });

  it('shows a forbidden state without crm.manage', () => {
    permissionsState = { isLoading: false, permissions: ['crm.read'] };
    renderWorkspace();
    expect(screen.getByText('No tienes permiso para crear Leads.')).toBeInTheDocument();
  });

  it('renders the capture form and navigates back to the list on cancel', () => {
    renderWorkspace();
    expect(screen.getByRole('heading', { name: 'Nuevo lead' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Contacto' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(pushMock).toHaveBeenCalledWith('/sales-crm/leads');
  });

  it('shows the result panel after a successful capture with list/contact actions', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [contact], nextCursor: null, hasMore: false }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contact, lead, attribution: null, reused: false }), {
          status: 201,
        }),
      );
    vi.stubGlobal('fetch', fetchMock);
    renderWorkspace();

    fireEvent.change(screen.getByLabelText('Buscar contacto existente'), {
      target: { value: 'ana' },
    });
    fireEvent.click(await screen.findByText('Ana García'));
    fireEvent.change(screen.getByLabelText('Interés/producto *'), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    expect(await screen.findByText('Lead capturado correctamente')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ver en la lista' }));
    expect(pushMock).toHaveBeenCalledWith('/sales-crm/leads');

    fireEvent.click(screen.getByRole('button', { name: 'Abrir Contacto' }));
    expect(pushMock).toHaveBeenCalledWith(`/sales-crm/contacts?q=${contactId}`);
  });

  it('returns to a blank form when creating another lead', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [contact], nextCursor: null, hasMore: false }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contact, lead, attribution: null, reused: false }), {
          status: 201,
        }),
      );
    vi.stubGlobal('fetch', fetchMock);
    renderWorkspace();

    fireEvent.change(screen.getByLabelText('Buscar contacto existente'), {
      target: { value: 'ana' },
    });
    fireEvent.click(await screen.findByText('Ana García'));
    fireEvent.change(screen.getByLabelText('Interés/producto *'), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    await screen.findByText('Lead capturado correctamente');
    fireEvent.click(screen.getByRole('button', { name: 'Capturar otro Lead' }));

    await waitFor(() =>
      expect(screen.getByRole('group', { name: 'Contacto' })).toBeInTheDocument(),
    );
    expect(screen.queryByText('Lead capturado correctamente')).not.toBeInTheDocument();
  });

  it('shows an explicit reused result when the capture is retried with the same external id', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [contact], nextCursor: null, hasMore: false }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contact, lead, attribution: null, reused: true }), {
          status: 200,
        }),
      );
    vi.stubGlobal('fetch', fetchMock);
    renderWorkspace();

    fireEvent.change(screen.getByLabelText('Buscar contacto existente'), {
      target: { value: 'ana' },
    });
    fireEvent.click(await screen.findByText('Ana García'));
    fireEvent.change(screen.getByLabelText('Interés/producto *'), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.change(screen.getByLabelText('ID externo'), { target: { value: 'meta-lead-1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    expect(
      await screen.findByRole('heading', { name: 'Lead ya existente reutilizado' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'El origen y el ID externo ya estaban registrados; se devolvió el Lead existente en lugar de duplicarlo.',
      ),
    ).toBeInTheDocument();
  });
});
