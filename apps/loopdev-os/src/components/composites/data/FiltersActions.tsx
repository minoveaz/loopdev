'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  Button,
  FilterDropdown,
  Input,
  ResponsiveTable,
  SectionHeader,
  TechnicalSurface,
} from '@loopdev/ui';
import type { ResponsiveTableColumn } from '@loopdev/ui';

export type FiltersActionsState =
  'ready' | 'loading' | 'skeleton' | 'empty' | 'error' | 'forbidden' | 'read-only' | 'disabled';

export interface FiltersActionsFilter {
  id: string;
  label: string;
  options: string[];
  multiple?: boolean;
}

export interface FiltersActionsLabels {
  title: string;
  resultCount: (count: number) => string;
  searchLabel: string;
  searchPlaceholder: string;
  clearSearch: string;
  moreFilters: string;
  clearFilters: string;
  activeFilters: string;
  loading: string;
  skeleton: string;
  empty: string;
  filteredEmpty: string;
  error: string;
  forbidden: string;
}

export interface FiltersActionsProps<Row extends Record<string, unknown>> {
  rows: Row[];
  columns: ResponsiveTableColumn<Row>[];
  getRowKey: (row: Row, index: number) => string;
  labels: FiltersActionsLabels;
  search?: { value: string; onChange: (value: string) => void };
  filters?: FiltersActionsFilter[];
  /** Number of frequent filters kept in the primary toolbar. */
  visibleFilterCount?: number;
  filterValues?: Record<string, string[]>;
  onFilterValuesChange?: (id: string, values: string[]) => void;
  state?: FiltersActionsState;
  readOnly?: boolean;
  disabled?: boolean;
  pageSize?: number;
  paginationVariant?: 'default' | 'compact';
  hidePageSizeSelector?: boolean;
  pageAction?: React.ReactNode;
  bulkActions?: React.ReactNode;
  errorAction?: React.ReactNode;
  selectedRowKeys?: React.Key[];
  onSelectedRowKeysChange?: (keys: React.Key[]) => void;
  selectedRowKey?: React.Key;
  selectOnRowClick?: boolean;
  showAllColumnsOnMobile?: boolean;
  onRowClick?: (row: Row, index: number) => void;
  renderMobileRow?: (row: Row, index: number) => React.ReactNode;
  rowActions?: (row: Row, index: number) => React.ReactNode;
  activeRowKey?: React.Key;
  onClearFilters?: () => void;
  className?: string;
}

export function FiltersActions<Row extends Record<string, unknown>>({
  rows,
  columns,
  getRowKey,
  search,
  filters = [],
  visibleFilterCount = 2,
  filterValues = {},
  onFilterValuesChange,
  state = 'ready',
  readOnly = false,
  disabled = false,
  pageSize,
  paginationVariant = 'default',
  hidePageSizeSelector = false,
  labels,
  pageAction,
  bulkActions,
  errorAction,
  selectedRowKeys: controlledSelectedRows,
  onSelectedRowKeysChange,
  selectedRowKey,
  selectOnRowClick = false,
  showAllColumnsOnMobile = false,
  onRowClick,
  renderMobileRow,
  rowActions,
  activeRowKey,
  onClearFilters,
  className = '',
}: FiltersActionsProps<Row>) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [uncontrolledSelectedRows, setUncontrolledSelectedRows] = useState<React.Key[]>([]);
  const selectedRows = controlledSelectedRows ?? uncontrolledSelectedRows;
  const effectiveReadOnly = readOnly || state === 'read-only';
  const effectiveDisabled = disabled || state === 'disabled';
  const primaryFilters = filters.slice(0, visibleFilterCount);
  const advancedFilters = filters.slice(visibleFilterCount);
  const filtersById = new Map(filters.map((filter) => [filter.id, filter]));
  const hasActiveFilters =
    Boolean(search?.value) ||
    Object.values(filterValues).some((values) => values.some((value) => value !== 'all'));
  const stateMessage =
    state === 'loading'
      ? labels.loading
      : state === 'skeleton'
        ? labels.skeleton
        : state === 'error'
          ? labels.error
          : state === 'forbidden'
            ? labels.forbidden
            : state === 'empty'
              ? labels.empty
              : hasActiveFilters
                ? labels.filteredEmpty
                : undefined;

  useEffect(() => {
    if (!showAdvancedFilters) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowAdvancedFilters(false);
        document.getElementById('filters-actions-trigger')?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAdvancedFilters]);

  const clearAll = () => {
    search?.onChange('');
    filters.forEach((filter) => onFilterValuesChange?.(filter.id, []));
    clearSelection();
    onClearFilters?.();
  };

  const clearSelection = () => {
    onSelectedRowKeysChange?.([]);
    if (controlledSelectedRows === undefined) setUncontrolledSelectedRows([]);
  };

  return (
    <div className={`min-w-0 max-w-full space-y-4 ${className}`}>
      <TechnicalSurface
        variant="surface"
        radius="md"
        border="technical"
        className="w-full min-w-0 p-4"
      >
        <SectionHeader
          title={labels.title}
          action={
            <div className="flex items-center gap-3">
              <span
                className="text-xs text-text-muted"
                aria-label={labels.resultCount(rows.length)}
              >
                {labels.resultCount(rows.length)}
              </span>
              {pageAction}
            </div>
          }
        />
        <div
          role="toolbar"
          aria-label={labels.title}
          className="mt-4 grid grid-cols-1 items-end gap-2 lg:grid-cols-[minmax(16rem,1fr)_repeat(3,minmax(9rem,auto))_auto_auto]"
        >
          {search ? (
            <div className="min-w-0 w-full">
              <Input
                aria-label={labels.searchLabel}
                placeholder={labels.searchPlaceholder}
                value={search.value}
                onChange={(event) => search.onChange(event.target.value)}
                startIcon={<Search size={14} aria-hidden="true" />}
                endIcon={
                  search.value ? (
                    <button
                      type="button"
                      aria-label={labels.clearSearch}
                      onClick={() => search.onChange('')}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  ) : undefined
                }
                size="sm"
                fullWidth
                disabled={effectiveDisabled}
                className="min-w-0"
              />
            </div>
          ) : null}
          {primaryFilters.map((filter) => {
            const selected = filterValues[filter.id] ?? [];
            return (
              <div className="min-w-0 w-full" key={filter.id}>
                <FilterDropdown
                  icon="filter_alt"
                  label={
                    selected.length
                      ? filter.multiple
                        ? filter.label
                        : `${filter.label} · ${selected[0]}`
                      : filter.label
                  }
                  options={filter.options}
                  selected={selected}
                  multiple={filter.multiple}
                  onClear={() => onFilterValuesChange?.(filter.id, [])}
                  onToggle={(value) =>
                    onFilterValuesChange?.(
                      filter.id,
                      filter.multiple
                        ? selected.includes(value)
                          ? selected.filter((item) => item !== value)
                          : [...selected, value]
                        : selected.includes(value)
                          ? []
                          : [value],
                    )
                  }
                  disabled={effectiveDisabled}
                  readOnly={effectiveReadOnly}
                />
              </div>
            );
          })}
          {advancedFilters.length > 0 ? (
            <Button
              id="filters-actions-trigger"
              variant="outline"
              className="w-full sm:w-auto"
              size="sm"
              disabled={effectiveDisabled}
              aria-expanded={showAdvancedFilters}
              aria-controls="filters-actions-advanced"
              onClick={() => setShowAdvancedFilters((open) => !open)}
            >
              {labels.moreFilters}
            </Button>
          ) : null}
          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" disabled={effectiveDisabled} onClick={clearAll}>
              {labels.clearFilters}
            </Button>
          ) : null}
        </div>
        {showAdvancedFilters ? (
          <div
            id="filters-actions-advanced"
            className="mt-3 flex flex-wrap items-end gap-2 border border-border-subtle bg-background-subtle p-3"
            aria-label={labels.moreFilters}
          >
            {advancedFilters.map((filter) => {
              const selected = filterValues[filter.id] ?? [];
              return (
                <div className="min-w-40" key={filter.id}>
                  <FilterDropdown
                    icon="filter_alt"
                    label={
                      selected.length
                        ? filter.multiple
                          ? filter.label
                          : `${filter.label} · ${selected[0]}`
                        : filter.label
                    }
                    options={filter.options}
                    selected={selected}
                    multiple={filter.multiple}
                    onClear={() => onFilterValuesChange?.(filter.id, [])}
                    onToggle={(value) =>
                      onFilterValuesChange?.(
                        filter.id,
                        filter.multiple
                          ? selected.includes(value)
                            ? selected.filter((item) => item !== value)
                            : [...selected, value]
                          : selected.includes(value)
                            ? []
                            : [value],
                      )
                    }
                    disabled={effectiveDisabled}
                    readOnly={effectiveReadOnly}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
        {hasActiveFilters ? (
          <div
            className="mt-3 flex flex-wrap items-center gap-2"
            role="group"
            aria-label={labels.activeFilters}
          >
            <span className="text-xs font-medium text-text-muted">{labels.activeFilters}:</span>
            {Object.entries(filterValues).flatMap(([id, values]) =>
              values
                .filter((value) => value !== 'all')
                .map((value) => (
                  <FilterChip
                    key={`${id}-${value}`}
                    label={`${(filtersById.get(id)?.label ?? id).replace(/\s*(All|Any)\s*$/, '')}: ${value}`}
                    onRemove={() =>
                      onFilterValuesChange?.(
                        id,
                        values.filter((item) => item !== value),
                      )
                    }
                    disabled={effectiveDisabled || effectiveReadOnly}
                  />
                )),
            )}
          </div>
        ) : null}
      </TechnicalSurface>
      <TechnicalSurface
        variant="surface"
        radius="md"
        border="technical"
        overflow="visible"
        className="w-full min-w-0 max-w-full p-4"
      >
        <div className="w-full min-w-0 max-w-full">
          <ResponsiveTable
            surface={false}
            caption={labels.title}
            columns={columns}
            rows={rows}
            getRowKey={getRowKey}
            selectable={!effectiveReadOnly}
            readOnly={effectiveReadOnly}
            loading={state === 'loading' || state === 'skeleton'}
            loadingState={state === 'skeleton' ? labels.skeleton : labels.loading}
            disabled={effectiveDisabled}
            pageSize={pageSize}
            paginationVariant={paginationVariant}
            hidePageSizeSelector={hidePageSizeSelector}
            disabledState={labels.error}
            forbidden={state === 'forbidden'}
            forbiddenState={labels.forbidden}
            errorState={
              state === 'error' ? (
                <>
                  {labels.error} {errorAction}
                </>
              ) : undefined
            }
            emptyState={stateMessage}
            selectedRowKeys={selectedRows}
            onSelectedRowKeysChange={(keys) => {
              onSelectedRowKeysChange?.(keys);
              if (controlledSelectedRows === undefined) setUncontrolledSelectedRows(keys);
            }}
            bulkActions={bulkActions}
            onClearSelection={clearSelection}
            clearSelectionLabel="Clear selection"
            resetPageKey={`${search?.value ?? ''}|${JSON.stringify(filterValues)}`}
            selectedRowKey={selectedRowKey}
            selectOnRowClick={selectOnRowClick}
            showAllColumnsOnMobile={showAllColumnsOnMobile}
            activeRowKey={activeRowKey}
            onRowClick={onRowClick}
            renderMobileRow={renderMobileRow}
            rowActions={rowActions}
            className="min-w-0 max-w-full"
          />
        </div>
      </TechnicalSurface>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
  disabled = false,
}: {
  label: string;
  onRemove: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onRemove}
      className="border border-primary/30 bg-primary/5 px-2 py-1 text-xs text-text-main disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label} <X className="ml-1 inline" size={12} aria-hidden="true" />
    </button>
  );
}
