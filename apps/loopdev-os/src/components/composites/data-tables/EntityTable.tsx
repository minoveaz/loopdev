'use client';

import { useState } from 'react';
import type React from 'react';
import { Badge, Button, Checkbox } from '@loopdev/ui';
import type { ResponsiveTableColumn } from '@loopdev/ui';
import {
  FiltersActions,
  type FiltersActionsFilter,
  type FiltersActionsLabels,
  type FiltersActionsState,
} from '@/components/composites/data/FiltersActions';

export type EntityTableRow = {
  id: string;
  name: string;
  segment: string;
  status: 'Active' | 'Paused';
  owner: string;
  email: string;
  region: string;
  updated: string;
};

export interface EntityTableProps {
  contextPanelEnabled?: boolean;
  rows: EntityTableRow[];
  columns: ResponsiveTableColumn<EntityTableRow>[];
  filters: FiltersActionsFilter[];
  labels: EntityTableFixtureLabels;
  state?: FiltersActionsState;
  readOnly?: boolean;
  disabled?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectedRowKeysChange?: (keys: React.Key[]) => void;
  selectedRowKey?: React.Key;
  onRowClick?: (row: EntityTableRow, index: number) => void;
  onCreateCustomer?: () => void;
  onAssignOwner?: () => void;
  onExport?: () => void;
  onRetry?: () => void;
}

export type EntityTableFixtureLabels = FiltersActionsLabels;

export function EntityTable({
  rows: suppliedRows,
  columns,
  filters,
  labels,
  state = 'ready',
  readOnly = false,
  disabled = false,
  selectedRowKeys = [],
  onSelectedRowKeysChange,
  selectedRowKey,
  onRowClick,
  onCreateCustomer,
  onAssignOwner,
  onExport,
  onRetry,
  contextPanelEnabled = false,
}: EntityTableProps) {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const canMutate = !readOnly && !disabled && state !== 'read-only' && state !== 'disabled';
  const visibleRows = suppliedRows.filter((row) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      [row.name, row.segment, row.owner, row.status].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    const selectedStatuses = filterValues.status ?? [];
    const selectedSegments = filterValues.segment ?? [];
    const selectedOwners = filterValues.owner ?? [];
    return (
      matchesQuery &&
      (!selectedStatuses.length || selectedStatuses.includes(row.status)) &&
      (!selectedSegments.length || selectedSegments.includes(row.segment)) &&
      (!selectedOwners.length || selectedOwners.includes(row.owner))
    );
  });

  return (
    <FiltersActions
      rows={visibleRows}
      columns={columns}
      getRowKey={(row) => row.id}
      search={{ value: query, onChange: setQuery }}
      filters={filters}
      visibleFilterCount={3}
      filterValues={filterValues}
      onFilterValuesChange={(id, values) =>
        setFilterValues((current) => ({ ...current, [id]: values }))
      }
      state={state}
      readOnly={readOnly}
      disabled={disabled}
      selectedRowKeys={selectedRowKeys}
      onSelectedRowKeysChange={onSelectedRowKeysChange}
      onRowClick={contextPanelEnabled ? onRowClick : undefined}
      selectedRowKey={selectedRowKey}
      selectOnRowClick
      showAllColumnsOnMobile
      rowActions={(row, index) => (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Open ${row.name}`}
          onClick={(event) => {
            event.stopPropagation();
            if (contextPanelEnabled) onRowClick?.(row, index);
          }}
        >
          Open
        </Button>
      )}
      renderMobileRow={(row, index) => (
        <div
          className={`flex w-full items-start gap-3 border-b border-border-subtle px-3 py-3 hover:bg-primary/5 ${selectedRowKeys?.includes(row.id) ? 'bg-primary/10' : ''}`}
        >
          {!readOnly && (
            <Checkbox
              aria-label={`Select row ${row.id}`}
              checked={selectedRowKeys?.includes(row.id) ?? false}
              disabled={disabled || state !== 'ready'}
              onChange={() =>
                onSelectedRowKeysChange?.(
                  (selectedRowKeys ?? []).includes(row.id)
                    ? (selectedRowKeys ?? []).filter((key) => key !== row.id)
                    : [...(selectedRowKeys ?? []), row.id],
                )
              }
            />
          )}
          <Button
            type="button"
            variant="ghost"
            className="h-auto min-w-0 flex-1 justify-start text-left"
            onClick={() => {
              if (contextPanelEnabled) onRowClick?.(row, index);
            }}
          >
            <span className="block truncate font-medium text-text-main">{row.name}</span>
            <span className="mt-1 block text-xs text-text-muted">
              {row.segment} · {row.owner}
            </span>
          </Button>
          <Badge status={row.status === 'Active' ? 'success' : 'energy'}>{row.status}</Badge>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Open ${row.name}`}
            onClick={() => {
              if (contextPanelEnabled) onRowClick?.(row, index);
            }}
          >
            Open
          </Button>
        </div>
      )}
      labels={labels}
      paginationVariant="compact"
      pageAction={
        <Button variant="primary" size="sm" disabled={!canMutate} onClick={onCreateCustomer}>
          Create customer
        </Button>
      }
      bulkActions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" disabled={!canMutate} onClick={onAssignOwner}>
            Assign owner
          </Button>
          <Button variant="ghost" size="sm" disabled={!canMutate} onClick={onExport}>
            Export
          </Button>
        </div>
      }
      errorAction={
        <Button variant="outline" size="sm" onClick={onRetry} disabled={disabled}>
          Retry
        </Button>
      }
    />
  );
}
