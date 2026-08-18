'use client';

import { EmptyState, LoadingState, ResponsiveTable, StatusBadge } from '@loopdev/ui';
import { useState } from 'react';

type ContactRow = { id: string; name: string; segment: string; status: 'Active' | 'Paused' };

const ROWS: ContactRow[] = [
  { id: 'acme', name: 'Acme Industries', segment: 'Enterprise', status: 'Active' },
  { id: 'northstar', name: 'Northstar Health', segment: 'Mid-market', status: 'Active' },
  { id: 'meridian', name: 'Studio Meridian', segment: 'SMB', status: 'Paused' },
];

export function ResponsiveTableCertification() {
  const [state, setState] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'dense'>('compact');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState(1);

  return (
    <section className="space-y-4" aria-labelledby="responsive-table-examples">
      <div>
        <h2 id="responsive-table-examples" className="text-lg font-semibold text-text-main">
          ResponsiveTable
        </h2>
        <p className="text-sm text-text-muted">
          Standard table contract for desktop, mobile, states, selection, density and pagination.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-y border-border-subtle py-3">
        {(['ready', 'loading', 'empty', 'error'] as const).map((value) => (
          <button
            key={value}
            type="button"
            className="border border-border-technical px-2 py-1 text-xs text-text-main"
            onClick={() => setState(value)}
            aria-pressed={state === value}
          >
            {value}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-xs text-text-muted">
          Density
          <select
            value={density}
            onChange={(event) => setDensity(event.target.value as typeof density)}
            className="border border-border-technical bg-shell-surface px-2 py-1 text-xs text-text-main"
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="dense">Dense</option>
          </select>
        </label>
      </div>
      <ResponsiveTable
        caption="CRM contacts"
        rows={state === 'empty' ? [] : ROWS}
        columns={[
          { key: 'name', header: 'Contact', sortable: true },
          { key: 'segment', header: 'Segment', sortable: true },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <StatusBadge
                label={row.status}
                severity={row.status === 'Active' ? 'success' : 'warning'}
              />
            ),
          },
        ]}
        renderMobileRow={(row) => (
          <article className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-border-subtle bg-surface-elevated px-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-main dark:text-white">
                {row.name}
              </p>
              <p className="mt-1 truncate text-xs text-text-muted">{row.segment}</p>
            </div>
            <StatusBadge
              label={row.status}
              severity={row.status === 'Active' ? 'success' : 'warning'}
            />
            <button
              type="button"
              className="min-h-9 rounded border border-border-subtle px-2 text-xs text-text-main dark:text-white"
              aria-label={`Open ${row.name}`}
            >
              Open
            </button>
          </article>
        )}
        getRowKey={(row) => row.id}
        selectable
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={setSelectedRowKeys}
        density={density}
        currentPage={page}
        onPageChange={setPage}
        pageSize={3}
        pageSizeOptions={[3, 6, 12]}
        loading={state === 'loading'}
        loadingState={<LoadingState label="Loading contacts" lines={3} />}
        emptyState={
          <EmptyState
            size="sm"
            title="No contacts"
            description="No contacts match the current query."
          />
        }
        errorState={
          state === 'error' ? (
            <EmptyState
              size="sm"
              status="error"
              title="Contacts unavailable"
              description="Try again to reload contacts."
            />
          ) : undefined
        }
        sortKey="name"
        sortDirection="asc"
        onSortChange={() => undefined}
        labels={{ showing: (from, to, total) => `Showing ${from}-${to} of ${total}` }}
      />
    </section>
  );
}
