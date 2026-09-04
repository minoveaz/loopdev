import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeedbackProvider } from '@loopdev/ui';
import { QuickLeadCapture } from '@/suites/sales-crm/leads/QuickLeadCapture';

const organizationId = '00000000-0000-4000-9000-000000000001';
const contactId = '00000000-0000-4000-9000-000000000002';
const leadId = '00000000-0000-4000-9000-000000000003';
const timestamp = '2026-08-24T00:00:00.000Z';
const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
}));

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

function renderDialog(props: Partial<React.ComponentProps<typeof QuickLeadCapture>> = {}) {
  const onClose = props.onClose ?? vi.fn();
  const onSuccess = props.onSuccess ?? vi.fn();
  render(
    <FeedbackProvider>
      <QuickLeadCapture
        open={props.open ?? true}
        organizationId={props.organizationId ?? organizationId}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </FeedbackProvider>,
  );
  return { onClose, onSuccess };
}

afterEach(() => {
  vi.unstubAllGlobals();
  pushMock.mockClear();
});

describe('QuickLeadCapture', () => {
  it('renders the contact, lead detail and attribution sections', () => {
    renderDialog();
    expect(screen.getByRole('heading', { name: 'Captura rápida de Lead' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Contacto' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Detalle del Lead' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Atribución (opcional)' })).toBeInTheDocument();
  });

  it('requires a selected contact and an interest before submitting', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    expect(
      await screen.findByText('Select an existing contact or create a new one.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Interest is required.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('searches and selects an existing contact through ContactLookupField', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [contact], nextCursor: null, hasMore: false }), {
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    renderDialog();

    fireEvent.change(screen.getByLabelText('Buscar contacto existente'), {
      target: { value: 'ana' },
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled(), { timeout: 1000 });
    expect(await screen.findByText('Ana García')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ana García'));

    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cambiar' })).toBeInTheDocument();
  });

  it('switches to a new contact and requires a first name and a contact channel', async () => {
    renderDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Crear contacto nuevo' }));
    expect(screen.getByRole('group', { name: 'Contacto nuevo' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));
    expect(
      await screen.findByText('First name is required for a new contact.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Enter at least one email address or phone number.'),
    ).toBeInTheDocument();
  });

  it('captures a lead for an existing contact and reports success', async () => {
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
    const { onClose, onSuccess } = renderDialog();

    fireEvent.change(screen.getByLabelText('Buscar contacto existente'), {
      target: { value: 'ana' },
    });
    fireEvent.click(await screen.findByText('Ana García'));
    fireEvent.change(screen.getByLabelText('Interés/producto *'), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ reused: false }));
    expect(onClose).toHaveBeenCalledTimes(1);

    const captureCall = fetchMock.mock.calls.find(([url]) => url === '/api/crm/capture');
    expect(captureCall).toBeTruthy();
    const body = JSON.parse((captureCall?.[1] as RequestInit).body as string);
    expect(body).toMatchObject({ organizationId, contactId, interest: 'Seguro de hogar' });
  });

  it('submits attribution fields and persists the optional note through the notes API', async () => {
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
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: '00000000-0000-4000-9000-000000000004',
            organizationId,
            tenantId: organizationId,
            workspaceId: null,
            brandId: null,
            relationType: 'lead',
            relationId: leadId,
            authorId: '00000000-0000-4000-9000-000000000005',
            body: 'Llamar después de las 18:00.',
            permissions: { canEdit: true, canModerate: false },
            version: 1,
            createdAt: timestamp,
            updatedAt: timestamp,
          }),
          { status: 201 },
        ),
      );
    vi.stubGlobal('fetch', fetchMock);
    const { onSuccess } = renderDialog();

    fireEvent.change(screen.getByLabelText('Buscar contacto existente'), {
      target: { value: 'ana' },
    });

    fireEvent.click(await screen.findByText('Ana García'));
    fireEvent.change(screen.getByLabelText('Interés/producto *'), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.change(screen.getByLabelText('Proveedor'), { target: { value: 'meta' } });
    fireEvent.change(screen.getByLabelText('ID externo'), { target: { value: 'meta-lead-1' } });
    fireEvent.change(screen.getByLabelText('Campaña'), { target: { value: 'salud-abril' } });
    fireEvent.change(screen.getByLabelText('UTM medium'), { target: { value: 'social' } });
    fireEvent.change(screen.getByLabelText('Nota inicial'), {
      target: { value: 'Llamar después de las 18:00.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    const noteCall = fetchMock.mock.calls.find(([url]) => url === '/api/crm/notes');
    expect(noteCall).toBeTruthy();
    expect(JSON.parse((noteCall?.[1] as RequestInit).body as string)).toMatchObject({
      organizationId,
      relationType: 'lead',
      relationId: leadId,
      body: 'Llamar después de las 18:00.',
      idempotencyKey: `lead-capture-note-${leadId}`,
    });
    const captureCall = fetchMock.mock.calls.find(([url]) => url === '/api/crm/capture');
    expect(JSON.parse((captureCall?.[1] as RequestInit).body as string)).toMatchObject({
      source: {
        provider: 'meta',
        externalId: 'meta-lead-1',
        campaign: 'salud-abril',
        utm: { medium: 'social' },
      },
    });
  });

  it('reports partial success and retries only the note when note creation fails', async () => {
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
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { code: 'CONFLICT', message: 'Note failed' } }), {
          status: 409,
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: '00000000-0000-4000-9000-000000000004',
            organizationId,
            tenantId: organizationId,
            workspaceId: null,
            brandId: null,
            relationType: 'lead',
            relationId: leadId,
            authorId: '00000000-0000-4000-9000-000000000005',
            body: 'Llamar mañana.',
            permissions: { canEdit: true, canModerate: false },
            version: 1,
            createdAt: timestamp,
            updatedAt: timestamp,
          }),
          { status: 201 },
        ),
      );
    vi.stubGlobal('fetch', fetchMock);
    const { onSuccess, onClose } = renderDialog();

    fireEvent.change(screen.getByLabelText('Buscar contacto existente'), {
      target: { value: 'ana' },
    });
    fireEvent.click(await screen.findByText('Ana García'));
    fireEvent.change(screen.getByLabelText('Interés/producto *'), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.change(screen.getByLabelText('Nota inicial'), {
      target: { value: 'Llamar mañana.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    const partialHeading = await screen.findByText('Lead creado; nota inicial pendiente');
    expect(partialHeading.closest('[role="alert"]')).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ initialNote: expect.objectContaining({ status: 'failed' }) }),
    );
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar nota' }));
    expect(await screen.findByText('La nota inicial quedó guardada.')).toBeInTheDocument();
    expect(fetchMock.mock.calls.filter(([url]) => url === '/api/crm/capture')).toHaveLength(1);
    expect(fetchMock.mock.calls.filter(([url]) => url === '/api/crm/notes')).toHaveLength(2);
  });

  it('shows a permission error and allows a safe retry without losing form state', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [contact], nextCursor: null, hasMore: false }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Unauthorized', code: 'FORBIDDEN' }), { status: 403 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contact, lead, attribution: null, reused: false }), {
          status: 201,
        }),
      );
    vi.stubGlobal('fetch', fetchMock);
    const { onSuccess } = renderDialog();

    fireEvent.change(screen.getByLabelText('Buscar contacto existente'), {
      target: { value: 'ana' },
    });
    fireEvent.click(await screen.findByText('Ana García'));
    fireEvent.change(screen.getByLabelText('Interés/producto *'), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.change(screen.getByLabelText('ID externo'), { target: { value: 'meta-lead-1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    expect(await screen.findByText('No tienes permiso para capturar Leads.')).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();

    // Retrying resubmits the same, still-populated form.
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  it('reflects idempotent reuse when the same external id is captured again', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ contact, lead, attribution: null, reused: true }), {
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { onSuccess } = renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Crear contacto nuevo' }));
    const contactSection = screen.getByRole('group', { name: 'Contacto nuevo' });
    fireEvent.change(within(contactSection).getByLabelText('Nombre *'), {
      target: { value: 'Ana' },
    });
    fireEvent.change(within(contactSection).getByLabelText('Email'), {
      target: { value: 'ana@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Interés/producto *'), {
      target: { value: 'Seguro de hogar' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Capturar lead' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ reused: true }));
  });
});
