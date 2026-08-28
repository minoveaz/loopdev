import { useState } from 'react';
import { Badge, Button, UserAvatar, ResponsiveTable, TechnicalSurface } from '@loopdev/ui';
import type { ResponsiveTableColumn, ResponsiveTableProps } from '@loopdev/ui';

type ActivityStatus = 'Open' | 'Done' | 'Review';

export type ActivityRow = {
  id: string;
  event: string;
  actor: string;
  date: string;
  status: ActivityStatus;
  occurredAt: number;
};

export type ActivityTableProps = {
  contextPanelEnabled?: boolean;
  onRowClick?: (row: ActivityRow, index: number) => void;
  activeRowKey?: string;
};

const rows: ActivityRow[] = [
  {
    id: 'a1',
    event: 'Follow-up scheduled',
    actor: 'Ana Morgan',
    date: 'Today, 09:30',
    status: 'Open',
    occurredAt: 3,
  },
  {
    id: 'a2',
    event: 'Contact updated',
    actor: 'Luis Perez',
    date: 'Yesterday, 16:10',
    status: 'Done',
    occurredAt: 2,
  },
  {
    id: 'a3',
    event: 'Opportunity moved',
    actor: 'Marta Silva',
    date: 'Aug 14, 11:45',
    status: 'Review',
    occurredAt: 1,
  },
];

const statusConfig: Record<ActivityStatus, { status: 'primary' | 'success' | 'energy' }> = {
  Open: { status: 'primary' },
  Done: { status: 'success' },
  Review: { status: 'energy' },
};

const columns: ResponsiveTableColumn<ActivityRow>[] = [
  { key: 'event', header: 'Activity', sortable: true, className: 'font-semibold text-text-main' },
  {
    key: 'actor',
    header: 'Actor',
    sortable: true,
    className: 'text-text-main',
    render: (row) => (
      <span className="flex items-center gap-2">
        <UserAvatar name={row.actor} size="sm" />
        <span>{row.actor}</span>
      </span>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    sortable: true,
    sortAccessor: (row) => row.occurredAt,
    className: 'whitespace-nowrap font-mono text-xs tabular-nums text-text-muted',
  },
  {
    key: 'status',
    header: 'Status',
    className: 'text-right font-medium',
    render: (row) => <Badge status={statusConfig[row.status].status}>{row.status}</Badge>,
  },
];

const renderMobileRow = (
  onRowClick?: ActivityTableProps['onRowClick'],
): NonNullable<ResponsiveTableProps<ActivityRow>['renderMobileRow']> => {
  function ActivityTableMobileRow(row: ActivityRow, index: number) {
    return (
      <Button
        type="button"
        variant="ghost"
        className="h-auto w-full justify-between border-b px-4 py-3 text-left"
        onClick={() => onRowClick?.(row, index)}
      >
        <div className="min-w-0">
          <span className="block truncate font-semibold text-text-main">{row.event}</span>
          <span className="mt-1 flex items-center gap-2 text-xs text-text-muted">
            <UserAvatar name={row.actor} size="xs" />
            <span className="truncate">
              {row.actor} · {row.date}
            </span>
          </span>
        </div>
        <Badge status={statusConfig[row.status].status}>{row.status}</Badge>
      </Button>
    );
  }

  return ActivityTableMobileRow;
};

export function ActivityTable({
  contextPanelEnabled = true,
  onRowClick,
  activeRowKey,
}: ActivityTableProps = {}) {
  const handleRowClick = contextPanelEnabled ? onRowClick : undefined;
  const [sortKey, setSortKey] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  return (
    <TechnicalSurface variant="surface" radius="md" border="subtle" className="w-full min-w-0">
      <ResponsiveTable
        surface={false}
        className="[&_thead_tr]:bg-background-subtle [&_tbody_td]:py-3 [&_tbody_tr:hover]:bg-background-subtle"
        caption="Activity events"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        pageSize={0}
        activeRowKey={activeRowKey}
        onRowClick={handleRowClick}
        renderMobileRow={renderMobileRow(handleRowClick)}
      />
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle bg-background-subtle px-4 py-3 text-xs text-text-muted">
        <span>Showing recent 3 events</span>
        <a
          className="font-medium text-text-main underline-offset-2 hover:underline"
          href="#audit-trail"
        >
          View full audit trail ↗
        </a>
      </footer>
    </TechnicalSurface>
  );
}
