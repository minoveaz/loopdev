import React, { useEffect, useState } from 'react';
import { Button, Checkbox, LpdText, Select, Spacer } from '../../../atoms';
import type { ResponsiveTableLabels, ResponsiveTableProps } from './types';

export function ResponsiveTable<Row extends object>({
  columns,
  rows,
  getRowKey = (_, index) => index,
  caption,
  emptyState,
  loading = false,
  loadingState,
  errorState,
  offline = false,
  offlineState,
  forbidden = false,
  forbiddenState,
  disabledState,
  readOnly = false,
  disabled = false,
  selectable = false,
  selectionMode = 'page',
  selectedRowKeys = [],
  onSelectedRowKeysChange,
  bulkActions,
  onClearSelection,
  clearSelectionLabel = 'Clear selection',
  renderMobileRow,
  showAllColumnsOnMobile = false,
  mobileHeaders,
  labels,
  rowActions,
  onRowClick,
  selectOnRowClick = false,
  activeRowKey,
  selectedRowKey,
  density = 'comfortable',
  paginationVariant = 'default',
  hidePageSizeSelector = false,
  pageSize: pageSizeProp,
  pageSizeOptions = [5, 10, 20],
  currentPage: currentPageProp,
  onPageChange,
  resetPageKey,
  onPageSizeChange,
  sortKey: sortKeyProp,
  sortDirection: sortDirectionProp,
  onSortChange,
  className = '',
  ...rest
}: ResponsiveTableProps<Row>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeState, setPageSizeState] = useState(pageSizeProp ?? 5);
  const [sortKeyState, setSortKeyState] = useState(sortKeyProp ?? '');
  const [sortDirectionState, setSortDirectionState] = useState<'asc' | 'desc'>(sortDirectionProp ?? 'asc');
  const defaultLabels: ResponsiveTableLabels = {
    selectAll: 'Select all rows',
    selectRow: (key) => `Select row ${String(key)}`,
    selected: (count) => `${count} selected`,
    clearSelection: 'Clear selection',
    actions: 'Actions',
    mobileHeader: { record: 'Record', status: 'Status', actions: 'Actions' },
    previous: 'Previous',
    next: 'Next',
    goToPage: 'Go to page',
    rowsPerPage: 'Rows per page',
    showing: (from, to, total) => `Showing ${from}-${to} of ${total}`,
  };
  const resolvedLabels = {
    ...defaultLabels,
    ...labels,
    mobileHeader: { ...defaultLabels.mobileHeader, ...labels?.mobileHeader, ...mobileHeaders },
  };
  const stateContent = loading
    ? loadingState ?? 'Loading results'
    : errorState
      ? errorState
      : offline
        ? offlineState ?? 'These results are unavailable offline'
        : disabled
          ? disabledState ?? 'These results are unavailable'
      : forbidden
        ? forbiddenState ?? 'You do not have access to these results'
        : emptyState ?? 'No results';

  const isStateOnly = loading || Boolean(errorState) || offline || disabled || forbidden || rows.length === 0;
  const sortKey = sortKeyProp ?? sortKeyState;
  const sortDirection = sortDirectionProp ?? sortDirectionState;
  const sortedRows = sortKey
    ? [...rows].sort((left, right) => {
        const column = columns.find((candidate) => candidate.key === sortKey);
        const leftValue = column?.sortAccessor?.(left) ?? (left as Record<string, unknown>)[sortKey];
        const rightValue = column?.sortAccessor?.(right) ?? (right as Record<string, unknown>)[sortKey];
        const comparison = String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true });
        return sortDirection === 'asc' ? comparison : -comparison;
      })
    : rows;
  const pageSize = pageSizeProp ?? pageSizeState;
  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(sortedRows.length / pageSize)) : 1;
  const activePage = currentPageProp ?? currentPage;
  const setActivePage = (page: number) => {
    if (currentPageProp === undefined) setCurrentPage(page);
    onPageChange?.(page);
  };
  const visibleRows = pageSize > 0 ? sortedRows.slice((activePage - 1) * pageSize, activePage * pageSize) : sortedRows;
  const rowKeys = visibleRows.map((row, index) => getRowKey(row, index));
  const selectableRows = selectionMode === 'all' ? sortedRows : visibleRows;
  const selectableKeys = selectableRows.map((row, index) => getRowKey(row, index));
  const allRowsSelected = selectableKeys.length > 0 && selectableKeys.every((key) => selectedRowKeys.includes(key));
  const someRowsSelected = !allRowsSelected && rowKeys.some((key) => selectedRowKeys.includes(key));
  const canSelect = selectable && !readOnly && !disabled && !loading && !offline && !forbidden;
  const canInteract = !readOnly && !disabled && !loading && !offline && !forbidden;

  const toggleAll = () => {
    onSelectedRowKeysChange?.(allRowsSelected ? [] : selectableKeys);
  };

  const toggleRow = (key: React.Key) => {
    const nextKeys = selectedRowKeys.includes(key)
      ? selectedRowKeys.filter((selectedKey) => selectedKey !== key)
      : [...selectedRowKeys, key];
    onSelectedRowKeysChange?.(nextKeys);
  };

  const updateSort = (key: string) => {
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKeyState(key);
    setSortDirectionState(direction);
    setActivePage(1);
    onSortChange?.(key, direction);
  };

  useEffect(() => {
    if (resetPageKey !== undefined) setActivePage(1);
  }, [resetPageKey]);

  useEffect(() => {
    if (activePage > pageCount) setActivePage(pageCount);
  }, [activePage, pageCount]);

  return (
    <div
      className={`responsive-table-scroll w-full min-w-0 max-w-full overflow-visible ${className}`}
      tabIndex={0}
      role="region"
      aria-label="Scrollable data table"
      aria-busy={loading}
      aria-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-disabled={disabled || undefined}
      data-table-density={density}
      data-table-pagination={paginationVariant}
      data-table-overflow="horizontal-zone"
      {...rest}
    >
      {bulkActions && selectedRowKeys.length > 0 && (
        <div role="toolbar" aria-label="Bulk actions" className="mb-3 flex min-h-12 items-center justify-between gap-3 border border-primary/30 bg-primary/5 px-3 py-2 shadow-sm">
          <LpdText as="span" size="xs" variant="mono" className="uppercase tracking-widest text-primary">
            {resolvedLabels.selected(selectedRowKeys.length)}
          </LpdText>
          <div className="flex items-center gap-2">
            {bulkActions}
            <Button type="button" variant="ghost" size="sm" onClick={() => {
              if (onClearSelection) onClearSelection();
              else onSelectedRowKeysChange?.([]);
            }}>
              {clearSelectionLabel ?? resolvedLabels.clearSelection}
            </Button>
          </div>
        </div>
      )}
      <div className="min-w-0 max-w-full overflow-x-auto" tabIndex={0} data-table-scroll="horizontal">
      <table className={`${showAllColumnsOnMobile ? 'table' : 'hidden md:table'} w-full min-w-[980px] border-collapse text-left`}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b-2 border-border-technical bg-shell-canvas shadow-[inset_0_-1px_0_var(--border-border-technical)]">
            {selectable && (
              <th scope="col" className="w-10 px-3 py-2">
                <Checkbox
                  aria-label={resolvedLabels.selectAll}
                  aria-checked={someRowsSelected ? 'mixed' : allRowsSelected ? 'true' : 'false'}
                  checked={allRowsSelected}
                  indeterminate={someRowsSelected}
                  disabled={!canSelect}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={column.sortable && sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                className={`whitespace-nowrap px-3 ${density === 'dense' ? 'py-2' : 'py-3'} ${column.className ?? ''}`}
              >
                {column.sortable ? (
                  <button type="button" disabled={!canInteract} onClick={() => updateSort(column.key)} className="inline-flex items-center gap-1 hover:text-text-main disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Sort by ${String(column.header)}`}>
                    <LpdText as="span" size="xs" variant="mono" className="uppercase tracking-widest text-text-muted">{column.header}</LpdText>
                    <span aria-hidden="true" className={sortKey === column.key ? 'font-semibold text-text-main' : 'text-text-muted/60'}>{sortKey === column.key ? (sortDirection === 'desc' ? '↓' : '↑') : '↕'}</span>
                  </button>
                ) : <LpdText as="span" size="xs" variant="mono" className="uppercase tracking-widest text-text-muted">{column.header}</LpdText>}
              </th>
            ))}
            {rowActions ? <th scope="col" aria-label={resolvedLabels.actions} className="w-24 px-3 py-3 text-right"><LpdText as="span" size="xs" variant="mono" className="uppercase tracking-widest text-text-muted">{resolvedLabels.actions}</LpdText></th> : null}
          </tr>
        </thead>
        <tbody>
          {!isStateOnly ? (
            visibleRows.map((row, index) => (
              (() => {
                const rowKey = getRowKey(row, index);
                const isSelected = selectedRowKeys.includes(rowKey);
                const isActive = activeRowKey !== undefined && activeRowKey === rowKey;

                return <tr
                key={rowKey}
                tabIndex={onRowClick || selectOnRowClick ? 0 : undefined}
                aria-selected={isSelected || undefined}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => {
                  if (selectOnRowClick && canSelect) toggleRow(rowKey);
                  else onRowClick?.(row, index);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (selectOnRowClick && canSelect) toggleRow(rowKey);
                    else onRowClick?.(row, index);
                  }
                }}
                className={`responsive-table-row group border-b border-border-subtle last:border-b-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${isSelected ? 'responsive-table-row-selected' : ''} ${isActive ? 'responsive-table-row-active' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {selectable && (
                  <td className="w-10 px-3 py-3">
                    <Checkbox
                      aria-label={resolvedLabels.selectRow(getRowKey(row, index))}
                      checked={selectedRowKeys.includes(getRowKey(row, index))}
                      disabled={!canSelect}
                      onChange={(event) => {
                        event.stopPropagation();
                        toggleRow(rowKey);
                      }}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={`px-3 ${density === 'dense' ? 'py-2' : 'py-3'} ${column.className ?? ''}`}>
                    {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '—')}
                  </td>
                ))}
                {rowActions ? <td className={`w-10 px-3 ${density === 'dense' ? 'py-2' : 'py-3'} text-right`} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>{rowActions(row, index)}</td> : null}
              </tr>;
              })()
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="px-3 py-6 text-center">
                <LpdText size="sm" className="text-text-muted" role={loading ? 'status' : undefined}>
                  {stateContent}
                </LpdText>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {renderMobileRow && !showAllColumnsOnMobile && !isStateOnly && (
        <div className="space-y-2 md:hidden" aria-label={caption ? `${caption} mobile list` : 'Mobile list'}>
          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b-2 border-border-technical bg-shell-canvas px-3 py-2 text-xs text-text-muted">
            <span className="font-mono uppercase tracking-widest">{resolvedLabels.mobileHeader.record}</span>
            <span className="font-mono uppercase tracking-widest">{resolvedLabels.mobileHeader.status}</span>
            <span className="font-mono uppercase tracking-widest">{resolvedLabels.mobileHeader.actions}</span>
          </div>
          {visibleRows.map((row, index) => (
            <div key={getRowKey(row, index)}>{renderMobileRow(row, index)}</div>
          ))}
        </div>
      )}
      </div>
      {!isStateOnly && pageSize > 0 ? (
        <>
          <Spacer size="md" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-technical bg-background-subtle px-3 py-3 text-xs text-text-muted">
          <span>{resolvedLabels.showing(sortedRows.length === 0 ? 0 : (activePage - 1) * pageSize + 1, Math.min(activePage * pageSize, sortedRows.length), sortedRows.length)}</span>
          <div className={paginationVariant === 'compact' ? 'grid w-full grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-1 sm:w-auto' : 'flex flex-wrap items-center gap-1 rounded-sm border border-border-technical bg-background px-1 py-1'}>
            <button className={paginationVariant === 'compact' ? 'min-h-8 min-w-0 rounded-sm px-1 py-1 text-xs text-text-main hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-50' : 'min-h-9 rounded-sm border border-border-subtle bg-background px-3 py-1 text-text-main hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-50'} type="button" disabled={activePage === 1 || !canInteract} onClick={() => setActivePage(Math.max(1, activePage - 1))}>{resolvedLabels.previous}</button>
            <Select aria-label={resolvedLabels.goToPage} size="sm" fullWidth={false} disabled={!canInteract} className={paginationVariant === 'compact' ? 'min-w-0 [&_button]:min-h-8 [&_button]:w-full [&_button]:min-w-0 [&_button]:rounded-sm [&_button]:px-1 [&_button]:py-1 [&_button]:pr-4 [&_button]:text-xs [&_button_span]:truncate [&_button_span]:text-xs [&_button_svg]:h-3 [&_button_svg]:w-3' : undefined} value={String(activePage)} onChange={(event) => setActivePage(Number(event.target.value))}>
              {Array.from({ length: pageCount }, (_, index) => <option key={index + 1} value={index + 1}>Page {index + 1}</option>)}
            </Select>
            {!hidePageSizeSelector && (
              <Select aria-label={resolvedLabels.rowsPerPage} size="sm" fullWidth={false} disabled={!canInteract} className={paginationVariant === 'compact' ? 'min-w-0 [&_button]:min-h-8 [&_button]:w-full [&_button]:min-w-0 [&_button]:rounded-sm [&_button]:px-1 [&_button]:py-1 [&_button]:pr-4 [&_button]:text-xs [&_button_span]:truncate [&_button_span]:text-xs [&_button_svg]:h-3 [&_button_svg]:w-3' : undefined} value={String(pageSize)} onChange={(event) => { const nextSize = Number(event.target.value); setPageSizeState(nextSize); setActivePage(1); onPageSizeChange?.(nextSize); }}>
                {pageSizeOptions.map((size) => <option key={size} value={size}>{size} rows</option>)}
              </Select>
            )}
            <button className={paginationVariant === 'compact' ? 'min-h-8 min-w-0 rounded-sm px-1 py-1 text-xs text-text-main hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-50' : 'min-h-9 rounded-sm border border-border-subtle bg-background px-3 py-1 text-text-main hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-50'} type="button" disabled={activePage === pageCount || !canInteract} onClick={() => setActivePage(Math.min(pageCount, activePage + 1))}>{resolvedLabels.next}</button>
          </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export type { ResponsiveTableColumn, ResponsiveTableProps } from './types';
