import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeedbackProvider } from '@loopdev/ui';
import NewContactPage from './page';

const organizationId = '00000000-0000-4000-9000-000000000001';
const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: () => ({ activeOrganizationId: organizationId }),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('NewContactPage (/sales-crm/contacts/new Full-Canvas)', () => {
  it('renders all form sections and inputs properly', () => {
    render(
      <FeedbackProvider>
        <NewContactPage />
      </FeedbackProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Crear Nuevo Contacto' })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellidos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico directo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de la empresa/i)).toBeInTheDocument();
  });

  it('submits contact creation and redirects to Customer 360 view', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'contact-created-123',
          organizationId,
          firstName: 'Elena',
          lastName: 'Márquez',
          email: 'elena@empresa.com',
          phone: null,
          companyName: 'Acme Iberia',
          identityStatus: 'pending_review',
        }),
        { status: 201 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <FeedbackProvider>
        <NewContactPage />
      </FeedbackProvider>,
    );

    fireEvent.change(screen.getByLabelText(/nombre \*/i), { target: { value: 'Elena' } });
    fireEvent.change(screen.getByLabelText(/apellidos/i), { target: { value: 'Márquez' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico directo/i), {
      target: { value: 'elena@empresa.com' },
    });
    fireEvent.change(screen.getByLabelText(/nombre de la empresa/i), {
      target: { value: 'Acme Iberia' },
    });

    const submitButtons = screen.getAllByRole('button', { name: /crear contacto/i });
    fireEvent.click(submitButtons[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/crm/contacts',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            organizationId,
            firstName: 'Elena',
            lastName: 'Márquez',
            email: 'elena@empresa.com',
            phone: null,
            companyName: 'Acme Iberia',
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/sales-crm/contacts/contact-created-123');
    });
  });
});
