import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeedbackProvider } from '@loopdev/ui';
import ContactsPage from './page';

const organizationId = '00000000-0000-4000-9000-000000000001';

afterEach(() => {
  vi.unstubAllGlobals();
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/sales-crm/contacts',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: () => ({ activeOrganizationId: organizationId }),
}));

vi.mock('@/hooks/useOrganizationPermissions', () => ({
  useOrganizationPermissions: () => ({
    isLoading: false,
    hasPermission: (perm: string) => perm === 'crm.read' || perm === 'crm.manage',
  }),
}));

describe('ContactsPage (Pantalla 2: Contactos & Cuentas)', () => {
  it('renders contacts table and header properly', async () => {
    process.env.NEXT_PUBLIC_CRM_CONTACTS_FIXTURE = 'false';
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            items: [
              {
                id: 'contact-test-1',
                organizationId,
                firstName: 'Carlos',
                lastName: 'Santana',
                email: 'carlos@example.com',
                phone: '+34 600 000 001',
                companyName: 'Santana Logistics',
                identityStatus: 'verified',
                createdAt: '2026-09-01T00:00:00.000Z',
                updatedAt: '2026-09-01T00:00:00.000Z',
              },
            ],
            nextCursor: null,
            hasMore: false,
          }),
        ),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <FeedbackProvider>
        <ContactsPage />
      </FeedbackProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Contacts' })).toBeInTheDocument();
    expect((await screen.findAllByText('Carlos Santana')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('Santana Logistics')).length).toBeGreaterThan(0);
  });
});
