'use client';

import { useState } from 'react';
import type React from 'react';
import {
  Badge,
  Button,
  ResponsiveTable,
  Select,
  TechnicalDialog,
  TechnicalSurface,
  UserAvatar,
} from '@loopdev/ui';
import type { ResponsiveTableColumn } from '@loopdev/ui';
import type { EntityTableRow } from './EntityTable';

const rows: EntityTableRow[] = [
  {
    id: 'acme',
    name: 'Acme Industries',
    segment: 'Enterprise',
    status: 'Active',
    owner: 'Ana',
    email: 'ana@example.com',
    region: 'North',
    updated: 'Today',
  },
  {
    id: 'northstar',
    name: 'Northstar Health',
    segment: 'Mid-market',
    status: 'Active',
    owner: 'Luis',
    email: 'luis@example.com',
    region: 'West',
    updated: 'Yesterday',
  },
  {
    id: 'meridian',
    name: 'Studio Meridian',
    segment: 'SMB',
    status: 'Paused',
    owner: 'Marta',
    email: 'marta@example.com',
    region: 'East',
    updated: 'Aug 14',
  },
];

const owners = ['Ana', 'Luis', 'Marta', 'Sofia'];

export type SelectionTableProps = {
  contextPanelEnabled?: boolean;
  onRowClick?: (row: EntityTableRow, index: number) => void;
};

export function SelectionTable({
  contextPanelEnabled = false,
  onRowClick,
}: SelectionTableProps = {}) {
  const [tableRows, setTableRows] = useState(rows);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAssignOwnerOpen, setIsAssignOwnerOpen] = useState(false);
  const [nextOwner, setNextOwner] = useState('');

  const columns: ResponsiveTableColumn<EntityTableRow>[] = [
    { key: 'name', header: 'Customer', sortable: true, className: 'font-semibold text-text-main' },
    { key: 'segment', header: 'Segment', sortable: true },
    {
      key: 'owner',
      header: 'Owner',
      sortable: true,
      render: (row) => (
        <span className="flex items-center gap-2">
          <UserAvatar name={row.owner} size="sm" />
          <span>{row.owner}</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge status={row.status === 'Active' ? 'success' : 'energy'}>{row.status}</Badge>
      ),
    },
  ];

  const assignOwner = () => {
    if (!nextOwner) return;
    setTableRows((currentRows) =>
      currentRows.map((row) =>
        selectedRows.includes(row.id) ? { ...row, owner: nextOwner } : row,
      ),
    );
    setSelectedRows([]);
    setNextOwner('');
    setIsAssignOwnerOpen(false);
  };

  return (
    <TechnicalSurface variant="surface" radius="md" border="subtle" className="w-full min-w-0">
      <ResponsiveTable
        surface={false}
        className="[&_thead_tr]:bg-background-subtle [&_tbody_td]:py-3 [&_tbody_tr:hover]:bg-background-subtle [&_tbody_tr[aria-selected='true']]:border-l-2 [&_tbody_tr[aria-selected='true']]:border-primary [&_tbody_tr[aria-selected='true']]:bg-primary/5"
        caption="Selection workflows"
        rows={tableRows}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
        selectedRowKeys={selectedRows}
        onSelectedRowKeysChange={setSelectedRows}
        bulkActions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => setIsAssignOwnerOpen(true)}>
              Assign owner
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
              Change status
            </Button>
          </div>
        }
        clearSelectionLabel="Clear selection"
        renderMobileRow={(row) => (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border-subtle px-3 py-3 last:border-b-0">
            <div className="min-w-0 space-y-1">
              <strong className="block truncate text-sm text-text-main">{row.name}</strong>
              <span className="block text-xs text-text-muted">
                {row.segment} · {row.owner}
              </span>
            </div>
            <Badge status={row.status === 'Active' ? 'success' : 'energy'}>{row.status}</Badge>
          </div>
        )}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        pageSize={0}
        selectOnRowClick
        onRowClick={contextPanelEnabled ? onRowClick : undefined}
      />
      <footer className="border-t border-border-subtle bg-background-subtle px-4 py-3 text-xs text-text-muted">
        Showing 1-3 of 3 records
      </footer>
      <TechnicalDialog
        isOpen={isAssignOwnerOpen}
        onClose={() => setIsAssignOwnerOpen(false)}
        title="Assign owner"
        description={`You are assigning ${selectedRows.length} ${selectedRows.length === 1 ? 'record' : 'records'}`}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsAssignOwnerOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!nextOwner}
              className="disabled:bg-background-subtle disabled:text-text-muted disabled:opacity-100"
              onClick={assignOwner}
            >
              Assign owner
            </Button>
          </>
        }
      >
        <Select
          label="New owner"
          value={nextOwner}
          onChange={(event) => setNextOwner(event.target.value)}
        >
          <option value="">Select owner</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </Select>
      </TechnicalDialog>
    </TechnicalSurface>
  );
}
