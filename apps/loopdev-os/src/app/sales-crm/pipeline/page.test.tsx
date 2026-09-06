import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PipelinePage from './page';

const organizationId = '00000000-0000-4000-9000-000000000001';
const permission = vi.hoisted(() => ({ allowed: true }));

vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: () => ({ activeOrganizationId: organizationId }),
}));
vi.mock('@/hooks/useOrganizationPermissions', () => ({
  useOrganizationPermissions: () => ({
    isLoading: false,
    hasPermission: () => permission.allowed,
  }),
}));

afterEach(() => {
  permission.allowed = true;
  vi.unstubAllGlobals();
});

describe('Pipeline page', () => {
  it('loads stages and opportunities into an accessible board', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: '00000000-0000-4000-9000-000000000010',
              organizationId,
              key: 'qualified',
              name: 'Qualified',
              active: true,
              terminalType: 'open',
              createdAt: '2026-09-01T00:00:00.000Z',
              updatedAt: '2026-09-01T00:00:00.000Z',
            },
          ]),
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [
              {
                id: '00000000-0000-4000-9000-000000000011',
                organizationId,
                contactId: '00000000-0000-4000-9000-000000000012',
                name: 'Family cover',
                productKey: 'health',
                stageKey: 'qualified',
                origin: 'manual',
                amount: 500,
                currency: 'EUR',
                version: 1,
                createdAt: '2026-09-01T00:00:00.000Z',
                updatedAt: '2026-09-01T00:00:00.000Z',
              },
            ],
            nextCursor: null,
            hasMore: false,
          }),
        ),
      );
    vi.stubGlobal('fetch', fetchMock);

    render(<PipelinePage />);

    expect(await screen.findByRole('heading', { name: 'Qualified' })).toBeInTheDocument();
    expect(screen.getByText('Family cover')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Customer 360' })).toHaveAttribute(
      'href',
      '/sales-crm/contacts/00000000-0000-4000-9000-000000000012',
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it('shows a forbidden state without requesting CRM data', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    permission.allowed = false;
    render(<PipelinePage />);
    expect(screen.getByText('You do not have permission to view Pipeline.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
