import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TasksPage from './page';

const organizationId = '00000000-0000-4000-9000-000000000001';

vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: () => ({ activeOrganizationId: organizationId }),
}));
vi.mock('@/hooks/useOrganizationPermissions', () => ({
  useOrganizationPermissions: () => ({
    isLoading: false,
    hasPermission: (permission: string) => permission === 'crm.read' || permission === 'crm.manage',
  }),
}));

afterEach(() => vi.unstubAllGlobals());

describe('Tasks page', () => {
  it('renders task rows and supports the empty result state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [
              {
                id: '00000000-0000-4000-9000-000000000010',
                organizationId,
                title: 'Call customer',
                description: null,
                status: 'open',
                priority: 'high',
                type: 'call',
                assignedUserId: null,
                dueAt: '2026-09-08T10:00:00.000Z',
                relationType: 'contact',
                relationId: '00000000-0000-4000-9000-000000000011',
                createdBy: '00000000-0000-4000-9000-000000000012',
                completedAt: null,
                version: 1,
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

    render(<TasksPage />);

    expect((await screen.findAllByText('Call customer')).length).toBeGreaterThan(0);
    expect((await screen.findAllByRole('button', { name: 'Complete' })).length).toBeGreaterThan(0);
  });

  it('shows a retryable error state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })));

    render(<TasksPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Tasks could not be loaded.');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
