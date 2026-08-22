import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeedbackProvider } from '@loopdev/ui';
import { ContactFormDialog } from './ContactFormDialog';

const organizationId = '00000000-0000-4000-9000-000000000001';
const contact = {
  id: '00000000-0000-4000-9000-000000000101',
  organizationId,
  workspaceId: null,
  brandId: null,
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: null,
  companyName: 'Analytical Engines',
  source: 'manual',
  assignedUserId: null,
  possibleDuplicate: false,
  version: 1,
  createdAt: '2026-08-21T00:00:00.000Z',
  updatedAt: '2026-08-21T00:00:00.000Z',
};

function renderDialog(props: React.ComponentProps<typeof ContactFormDialog>) {
  return render(
    <FeedbackProvider>
      <ContactFormDialog {...props} />
    </FeedbackProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ContactFormDialog', () => {
  it('uses the shared CompactCreate recipe with English section and field copy', () => {
    renderDialog({
      open: true,
      organizationId,
      onClose: vi.fn(),
      onSuccess: vi.fn(),
    });

    expect(screen.getByRole('heading', { name: 'Create contact' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Identity' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Contact channels' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Organization' })).toBeInTheDocument();
    expect(screen.getByLabelText('First name *')).toHaveAttribute('autocomplete', 'given-name');
    expect(screen.getByLabelText('Email address')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText('Country code')).toBeInTheDocument();
    expect(document.querySelector('[data-form-recipe="CompactCreate"]')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveClass(
      'items-end',
      'md:items-center',
    );
  });

  it('shows English validation errors without calling the API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    renderDialog({
      open: true,
      organizationId,
      onClose: vi.fn(),
      onSuccess: vi.fn(),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create contact' }));

    expect(await screen.findByText('First name is required.')).toBeInTheDocument();
    expect(
      screen.getByText('Enter at least one email address or phone number.'),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits the CRM-owned payload and reports the created contact', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(contact), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    renderDialog({ open: true, organizationId, onClose, onSuccess });

    fireEvent.change(screen.getByLabelText('First name *'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { value: 'Analytical Engines' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create contact' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith('/api/crm/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationId,
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: null,
        companyName: 'Analytical Engines',
      }),
    });
    expect(onSuccess).toHaveBeenCalledWith(contact);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('focuses the invalid phone field through the shared control ref', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    renderDialog({
      open: true,
      organizationId,
      onClose: vi.fn(),
      onSuccess: vi.fn(),
    });

    fireEvent.change(screen.getByLabelText('First name *'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Phone number'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create contact' }));

    expect(await screen.findByText('Enter a complete, valid phone number.')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Phone number')).toHaveFocus());
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
