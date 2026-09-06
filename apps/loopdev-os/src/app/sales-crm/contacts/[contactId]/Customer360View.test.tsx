import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Customer360View } from './Customer360View';

const organizationId = '00000000-0000-4000-9000-000000000001';

vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: () => ({ activeOrganizationId: organizationId }),
}));

afterEach(() => vi.unstubAllGlobals());

describe('Customer 360 view', () => {
  it('loads the tenant-scoped read model and renders empty relationships', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            view: 'record',
            contact: {
              id: '00000000-0000-4000-9000-000000000002',
              organizationId,
              firstName: 'Ana',
              lastName: 'Garcia',
              email: 'ana@example.test',
              phone: null,
              companyName: null,
              createdAt: '2026-09-01T00:00:00.000Z',
              updatedAt: '2026-09-01T00:00:00.000Z',
            },
            leads: [],
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
          }),
        ),
      ),
    );

    render(<Customer360View contactId="00000000-0000-4000-9000-000000000002" />);

    expect((await screen.findAllByRole('heading', { name: 'Ana Garcia' })).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText('No related leads.')).toBeInTheDocument();
    expect(screen.getByText('No activity yet.')).toBeInTheDocument();
  });
});
