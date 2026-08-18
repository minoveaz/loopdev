'use client';

import { useState } from 'react';
import type React from 'react';
import { Badge, Button, ResponsiveTable, TechnicalSurface } from '@loopdev/ui';
import type { ResponsiveTableColumn, ResponsiveTableProps } from '@loopdev/ui';

export type DenseOperationalRow = {
  id: string;
  name: string;
  segment: string;
  status: string;
  owner: string;
  email?: string;
  region?: string;
  updated?: string;
};

const defaultRows: DenseOperationalRow[] = [
  { id: 'acme', name: 'Acme Industries', segment: 'Enterprise', status: 'Active', owner: 'Ana', email: 'ops@acme.example', region: 'North America', updated: 'Today, 09:42' },
  { id: 'northstar', name: 'Northstar Health', segment: 'Mid-market', status: 'Active', owner: 'Luis', email: 'team@northstar.example', region: 'Europe', updated: 'Yesterday, 16:18' },
  { id: 'meridian', name: 'Studio Meridian', segment: 'SMB', status: 'Paused', owner: 'Marta', email: 'hello@meridian.example', region: 'Latin America', updated: 'Aug 14, 11:06' },
  { id: 'orbit', name: 'Orbit Systems', segment: 'Enterprise', status: 'Active', owner: 'Nora', email: 'ops@orbit.example', region: 'North America', updated: 'Aug 13, 14:22' },
  { id: 'pine', name: 'Pine & Co', segment: 'SMB', status: 'Paused', owner: 'Diego', email: 'team@pine.example', region: 'Europe', updated: 'Aug 12, 10:04' },
  { id: 'summit', name: 'Summit Works', segment: 'Mid-market', status: 'Active', owner: 'Elena', email: 'hello@summit.example', region: 'Asia Pacific', updated: 'Aug 11, 08:51' },
];

const defaultColumns: ResponsiveTableColumn<DenseOperationalRow>[] = [
  { key: 'name', header: 'Customer', sortable: true, className: 'text-sm font-semibold text-text-main' },
  { key: 'segment', header: 'Segment', sortable: true, className: 'text-sm text-text-main' },
  { key: 'owner', header: 'Owner', sortable: true, className: 'text-sm text-text-main' },
  { key: 'status', header: 'Status', sortable: true, className: 'font-medium', render: (row) => <Badge status={row.status === 'Active' ? 'success' : 'energy'}>{row.status}</Badge> },
  { key: 'email', header: 'Email', sortable: true, className: 'max-w-56 text-sm text-text-muted', render: (row) => <span className="block max-w-56 truncate" title={row.email}>{row.email ?? '—'}</span> },
  { key: 'region', header: 'Region', sortable: true, className: 'text-sm text-text-muted', render: (row) => row.region ?? '—' },
  { key: 'updated', header: 'Last updated', sortable: true, className: 'whitespace-nowrap font-mono text-xs tabular-nums text-text-muted', render: (row) => row.updated ?? '—' },
];

const defaultMobileRow: NonNullable<ResponsiveTableProps<DenseOperationalRow>['renderMobileRow']> = (row) => (
  <div className="flex w-full items-start justify-between gap-3 border-b border-border-subtle px-3 py-3">
    <div className="min-w-0">
      <span className="block truncate font-medium text-text-main">{row.name}</span>
      <span className="mt-1 block text-xs text-text-muted">{row.segment} · {row.owner}</span>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      <Badge status={row.status === 'Active' ? 'success' : 'energy'}>{row.status}</Badge>
      <Button variant="ghost" size="sm" className="min-h-8 rounded border border-border-subtle bg-background px-2 py-1 text-text-main" aria-label={`Open ${row.name}`}>
        Open
      </Button>
    </div>
  </div>
);

export type DenseOperationalTableProps = Omit<ResponsiveTableProps<DenseOperationalRow>, 'rows' | 'columns' | 'getRowKey' | 'caption'> & {
  contextPanelEnabled?: boolean;
  rows?: DenseOperationalRow[];
  columns?: ResponsiveTableColumn<DenseOperationalRow>[];
  renderMobileRow?: (row: DenseOperationalRow, index: number) => React.ReactNode;
};

export function DenseOperationalTable({
  rows = defaultRows,
  columns = defaultColumns,
  pageSize = 5,
  renderMobileRow = defaultMobileRow,
  contextPanelEnabled = false,
  sortKey: requestedSortKey,
  sortDirection: requestedSortDirection,
  onSortChange,
  ...tableProps
}: DenseOperationalTableProps) {
  const [sortKey, setSortKey] = useState(requestedSortKey ?? 'name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(requestedSortDirection ?? 'asc');

  return (
    <TechnicalSurface
      variant="surface"
      radius="md"
      border="subtle"
      className="w-full min-w-0 p-4"
    >
      <ResponsiveTable
        {...tableProps}
        className={`[&_thead_tr]:bg-background-subtle [&_thead_tr]:border-b [&_thead_tr]:border-border-subtle [&_tbody_tr:hover]:bg-background-subtle [&_button]:min-h-8 [&_button]:px-2 ${tableProps.className ?? ''}`}
        caption="Operational records"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable={false}
        selectedRowKeys={[]}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onRowClick={contextPanelEnabled ? tableProps.onRowClick : undefined}
        activeRowKey={contextPanelEnabled ? tableProps.activeRowKey : undefined}
        onSortChange={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
          onSortChange?.(key, direction);
        }}
        density="dense"
        pageSize={pageSize}
        paginationVariant="compact"
        hidePageSizeSelector
        showAllColumnsOnMobile
        renderMobileRow={renderMobileRow}
        rowActions={(row) => (
          <Button variant="ghost" size="sm" className="min-h-8 rounded border border-border-subtle bg-background px-2 py-1 text-text-main hover:bg-background-subtle" aria-label={`Open ${row.name}`}>
            Open
          </Button>
        )}
      />
    </TechnicalSurface>
  );
}