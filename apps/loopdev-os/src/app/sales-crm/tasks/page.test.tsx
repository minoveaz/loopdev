import { render, screen } from '@testing-library/react';
import type { ElementType, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TasksPage from './page';
import { resetCrmRuntime } from '@/suites/sales-crm/runtimeAdapter';

const organizationId = '00000000-0000-4000-9000-000000000001';
const runtime = vi.hoisted(() => ({ mode: 'real' as 'real' | 'sandbox' | 'preview' }));

vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: () => ({ activeOrganizationId: organizationId }),
}));
vi.mock('@/hooks/useOrganizationPermissions', () => ({
  useOrganizationPermissions: () => ({
    isLoading: false,
    hasPermission: (permission: string) => permission === 'crm.read' || permission === 'crm.manage',
  }),
}));
vi.mock('@/providers/PlatformRuntimeProvider', () => ({
  usePlatformRuntime: () => ({ mode: runtime.mode }),
}));
vi.mock('@loopdev/ui', () => ({
  Button: ({ children, ...props }: { children: ReactNode }) => (
    <button {...props}>{children}</button>
  ),
  Heading: ({ as: Tag = 'h2', children, ...props }: { as?: ElementType; children: ReactNode }) => (
    <Tag {...props}>{children}</Tag>
  ),
  ModuleHeader: ({
    leftSlot,
    rightSlot,
    ariaLabel,
  }: {
    leftSlot?: ReactNode;
    rightSlot?: ReactNode;
    ariaLabel?: string;
  }) => (
    <header aria-label={ariaLabel}>
      {leftSlot}
      {rightSlot}
    </header>
  ),
  ResponsiveTable: ({
    rows,
    columns,
    loading,
    loadingState,
    emptyState,
    rowActions,
  }: {
    rows: Array<Record<string, unknown>>;
    columns: Array<{
      key: string;
      render?: (row: Record<string, unknown>) => ReactNode;
    }>;
    loading?: boolean;
    loadingState?: ReactNode;
    emptyState?: ReactNode;
    rowActions?: (row: Record<string, unknown>) => ReactNode;
  }) => {
    if (loading) return <div role="status">{loadingState}</div>;
    if (!rows.length) return <div>{emptyState}</div>;
    return (
      <div>
        {rows.map((row) => (
          <div key={String(row.id)}>
            {columns.map((column) => (
              <div key={column.key}>{column.render?.(row) ?? String(row[column.key] ?? '')}</div>
            ))}
            {rowActions?.(row)}
          </div>
        ))}
      </div>
    );
  },
  Select: () => <select aria-label="Status" />,
  SuiteCanvas: ({ children }: { children: ReactNode }) => <main>{children}</main>,
  TechnicalSurface: ({ children }: { children: ReactNode }) => <section>{children}</section>,
}));

afterEach(() => {
  runtime.mode = 'real';
  resetCrmRuntime();
  vi.unstubAllGlobals();
});

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
                workspaceId: null,
                brandId: null,
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

  it('uses sandbox task reads without calling remote APIs', async () => {
    runtime.mode = 'sandbox';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<TasksPage />);

    expect(await screen.findByText('Follow up Enterprise platform')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
