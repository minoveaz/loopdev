
import React from 'react';
import { ErrorBoundary } from '../components/functional/ErrorBoundary';
import { useDataTable } from './useDataTable';
import { 
  TableContainer, 
  DataTableHeader,
  DataTableContent,
  DataTableFooter,
  Toolbar, 
  BulkActionsBar,
  ActiveFilters, 
  TableHead, 
  TableRow, 
  Pagination 
} from './components';
import type { ColumnDef } from './utils';

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  onAddRecord?: () => void;
  onEditRecord?: (item: T) => void;
  onDeleteRecord?: (id: string) => void;
  renderExpandedRow?: (item: T) => React.ReactNode;
}

const DataTableContentWrapper = <T extends { id: string }>({ 
  data, 
  columns, 
  className, 
  onAddRecord, 
  onEditRecord,
  onDeleteRecord,
  renderExpandedRow 
}: DataTableProps<T>) => {
  
  const {
    visibleData,
    totalItems,
    searchQuery,
    filters,
    activeFilterCount,
    selectedIds,
    expandedId,
    sortConfig,
    currentPage,
    totalPages,
    pageSize,
    visibleColumns,
    availableFilters,
    handleSearch,
    toggleFilter,
    clearFilters,
    removeFilter,
    handleSort,
    toggleSelection,
    clearSelection,
    toggleAll,
    toggleExpand,
    setCurrentPage,
    deleteItem,
    deleteMultipleItems,
    toggleColumn,
    handleExport
  } = useDataTable(data, columns);

  // Handlers bridging hook logic with props
  const handleEdit = (item: T) => {
    if (onEditRecord) onEditRecord(item);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    if (onDeleteRecord) onDeleteRecord(id);
  };

  return (
    <TableContainer className={className}>
      <DataTableHeader>
        {selectedIds.size > 0 ? (
          <BulkActionsBar 
            selectedCount={selectedIds.size}
            onClear={clearSelection}
            onDelete={() => deleteMultipleItems(selectedIds)}
            onExport={() => handleExport(selectedIds)}
          />
        ) : (
          <Toolbar 
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onAdd={onAddRecord || (() => {})}
            filters={filters}
            availableFilters={availableFilters}
            onToggleFilter={toggleFilter}
            activeFilterCount={activeFilterCount}
            visibleColumns={visibleColumns}
            allColumns={columns}
            onToggleColumn={toggleColumn}
            onExport={() => handleExport()}
          />
        )}
        <ActiveFilters 
          onClear={clearFilters} 
          filters={filters} 
          onRemoveStatus={removeFilter} 
        />
      </DataTableHeader>

      <DataTableContent>
        <table className="w-full text-left border-collapse">
          <TableHead 
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
            isAllSelected={selectedIds.size === visibleData.length && visibleData.length > 0}
            onToggleAll={toggleAll}
            visibleColumns={visibleColumns}
          />
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
            {visibleData.map(item => (
              <TableRow 
                key={item.id}
                item={item}
                columns={columns}
                isSelected={selectedIds.has(item.id)}
                isExpanded={expandedId === item.id}
                onSelect={() => toggleSelection(item.id)}
                onExpand={() => toggleExpand(item.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                visibleColumns={visibleColumns}
                renderExpanded={renderExpandedRow}
              />
            ))}
            {visibleData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="p-8 text-center text-slate-500">
                  No records found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DataTableContent>

      <DataTableFooter>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </DataTableFooter>
    </TableContainer>
  );
};

// Generic Wrapper
export const DataTable = <T extends { id: string }>(props: DataTableProps<T>) => (
  <ErrorBoundary>
    <DataTableContentWrapper {...props} />
  </ErrorBoundary>
);
