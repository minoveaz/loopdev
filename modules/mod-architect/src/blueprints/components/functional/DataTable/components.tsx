
import React, { useState, useRef, useEffect, memo } from 'react';
import type { SortConfig, ColumnDef } from '@blueprints/components/functional/DataTable/utils';
import { EditAction, DeleteAction } from '@blueprints/components/ui/Actions';
import { ActionMenu } from '@blueprints/components/functional/ActionMenu';

// --- Generic Types ---

interface ToolbarProps<T> {
  searchQuery: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  filters: Record<string, Set<string>>;
  availableFilters: Record<string, Set<string>>;
  onToggleFilter: (category: string, value: string) => void;
  activeFilterCount: number;
  visibleColumns: Set<string>;
  allColumns: ColumnDef<T>[];
  onToggleColumn: (key: string) => void;
  onExport: () => void;
}

interface TableHeadProps<T> {
  columns: ColumnDef<T>[];
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  isAllSelected: boolean;
  onToggleAll: () => void;
  visibleColumns: Set<string>;
}

interface TableRowProps<T> {
  item: T;
  columns: ColumnDef<T>[];
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onExpand: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  visibleColumns: Set<string>;
  renderExpanded?: (item: T) => React.ReactNode;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

// --- Layout Components ---

export const TableContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col ${className}`}>
    {children}
  </div>
);

export const DataTableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark z-20 relative rounded-t-xl">
    {children}
  </div>
);

export const DataTableContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex-1 overflow-x-auto bg-white dark:bg-surface-dark relative min-h-[300px]">
    {children}
  </div>
);

export const DataTableFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
    {children}
  </div>
);

// --- Feature Components ---

export const BulkActionsBar: React.FC<{ 
  selectedCount: number; 
  onClear: () => void; 
  onDelete: () => void; 
  onExport: () => void;
}> = ({ selectedCount, onClear, onDelete, onExport }) => (
  <div className="p-4 bg-primary/5 dark:bg-primary/10 flex items-center justify-between animate-in fade-in duration-200">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-md min-w-[24px] text-center">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">selected</span>
      </div>
      <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
      <button onClick={onClear} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
        Cancel
      </button>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onExport} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium shadow-sm">
        <span className="material-symbols-outlined text-[18px]">download</span>
        <span className="hidden sm:inline">Export</span>
      </button>
      <button onClick={onDelete} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium shadow-sm">
        <span className="material-symbols-outlined text-[18px]">delete</span>
        <span className="hidden sm:inline">Delete</span>
      </button>
    </div>
  </div>
);

const FilterDropdown: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  filters: Record<string, Set<string>>;
  availableFilters: Record<string, Set<string>>;
  onToggle: (category: string, value: string) => void;
}> = ({ isOpen, onClose, filters, availableFilters, onToggle }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filterKeys = ['status', 'role']; 

  return (
    <div ref={ref} className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[400px] overflow-y-auto">
      {filterKeys.map(key => {
        const options = Array.from(availableFilters[key] || []).sort();
        if (options.length === 0) return null;

        return (
          <div key={key}>
            <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 sticky top-0 z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">{key}</span>
            </div>
            <div className="p-1">
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => onToggle(key, option)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters[key]?.has(option) ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                    {filters[key]?.has(option) && <span className="material-symbols-outlined text-[10px]">check</span>}
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 truncate">{option}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ColumnsDropdown = <T,>({ isOpen, onClose, visibleColumns, allColumns, onToggle }: { 
  isOpen: boolean; 
  onClose: () => void; 
  visibleColumns: Set<string>; 
  allColumns: ColumnDef<T>[];
  onToggle: (key: string) => void; 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const click = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    if (isOpen) document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95">
      <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50"><span className="text-[10px] font-bold text-slate-400 uppercase px-2">Columns</span></div>
      <div className="p-1">
        {allColumns.map(col => (
          <button key={col.key} onClick={() => onToggle(col.key)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-left">
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${visibleColumns.has(col.key) ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
              {visibleColumns.has(col.key) && <span className="material-symbols-outlined text-[10px]">check</span>}
            </div>
            <span className="text-slate-700 dark:text-slate-200">{col.header}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const Toolbar = <T,>({ searchQuery, onSearch, onAdd, filters, availableFilters, onToggleFilter, activeFilterCount, visibleColumns, allColumns, onToggleColumn, onExport }: ToolbarProps<T>) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);

  return (
    <div className="p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between relative">
      <div className="flex flex-col md:flex-row gap-4 md:items-center flex-1">
        <div className="relative w-full md:w-64 flex-shrink-0">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-sm">search</span>
          <input className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-slate-400 text-[#0d121b] dark:text-white" placeholder="Search..." type="text" value={searchQuery} onChange={onSearch} />
        </div>
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isFilterOpen || activeFilterCount > 0 ? 'bg-primary/10 border-primary/20 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>Filters</span>
              {activeFilterCount > 0 && <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">{activeFilterCount}</span>}
            </button>
            <FilterDropdown isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} availableFilters={availableFilters} onToggle={onToggleFilter} />
          </div>
          <div className="relative">
            <button onClick={() => setIsColumnsOpen(!isColumnsOpen)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isColumnsOpen ? 'bg-slate-100 dark:bg-slate-800 border-transparent' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
              <span className="material-symbols-outlined text-[18px]">view_column</span>
              <span>Columns</span>
            </button>
            <ColumnsDropdown isOpen={isColumnsOpen} onClose={() => setIsColumnsOpen(false)} visibleColumns={visibleColumns} allColumns={allColumns} onToggle={onToggleColumn} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-3 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
        <button onClick={onExport} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium">
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span className="hidden sm:inline">Export</span>
        </button>
        <button onClick={onAdd} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark text-sm font-medium shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New</span>
        </button>
      </div>
    </div>
  );
};

export const ActiveFilters: React.FC<{ onClear: () => void; filters: Record<string, Set<string>>; onRemoveStatus: (cat: string, val: string) => void; }> = ({ onClear, filters, onRemoveStatus }) => {
  const hasFilters = Object.values(filters).some(s => s.size > 0);
  if (!hasFilters) return null;
  return (
    <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 overflow-x-auto no-scrollbar">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-2 flex-shrink-0">Active:</span>
      {Object.entries(filters).map(([category, values]) => Array.from(values).map(value => (
        <div key={`${category}-${value}`} className="flex items-center gap-1 pl-2 pr-1 py-0.5 rounded border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 whitespace-nowrap animate-in fade-in zoom-in-95">
          <span className="opacity-70 capitalize">{category}:</span>
          <span className="font-medium">{value}</span>
          <button onClick={() => onRemoveStatus(category, value)} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 flex ml-1"><span className="material-symbols-outlined text-[14px]">close</span></button>
        </div>
      )))}
      <button onClick={onClear} className="text-xs text-slate-500 hover:text-primary ml-auto whitespace-nowrap flex-shrink-0 pl-4">Clear all</button>
    </div>
  );
};

const SortIcon: React.FC<{ active: boolean; direction?: 'asc' | 'desc' }> = ({ active, direction }) => {
  if (!active) return <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 text-slate-400">arrow_downward</span>;
  return <span className={`material-symbols-outlined text-[14px] text-primary ${direction === 'asc' ? 'rotate-180' : ''}`}>arrow_downward</span>;
};

export const TableHead = <T,>({ columns, sortConfig, onSort, isAllSelected, onToggleAll, visibleColumns }: TableHeadProps<T>) => (
  <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 dark:border-slate-700">
    <tr>
      <th className="p-4 w-12 border-b border-slate-200 dark:border-slate-700">
        <input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white dark:bg-slate-900 dark:border-slate-600" type="checkbox" checked={isAllSelected} onChange={onToggleAll} />
      </th>
      {columns.map(col => {
        if (!visibleColumns.has(col.key)) return null;
        return (
          <th key={col.key} className={`p-4 border-b border-slate-200 dark:border-slate-700 group ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800' : ''} transition-colors ${col.width || ''}`} onClick={() => col.sortable !== false && onSort(col.key)}>
            <div className="flex items-center gap-2">
              {col.header}
              {col.sortable !== false && <SortIcon active={sortConfig?.key === col.key} direction={sortConfig?.direction} />}
            </div>
          </th>
        );
      })}
      <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right w-24">Actions</th>
    </tr>
  </thead>
);

// We wrap the TableRow in memo to prevent re-renders of all rows when only one changes selection state
const TableRowComponent = <T extends { id: string }>({ item, columns, isSelected, isExpanded, onSelect, onExpand, onEdit, onDelete, visibleColumns, renderExpanded }: TableRowProps<T>) => {
  const colSpan = 2 + visibleColumns.size;
  return (
    <>
      <tr className={`transition-colors group relative ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'} ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/30' : ''}`}>
        <td className="p-4 relative">
          {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
          <input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white dark:bg-slate-900 dark:border-slate-600" type="checkbox" checked={isSelected} onChange={onSelect} />
        </td>
        {columns.map((col, index) => {
          if (!visibleColumns.has(col.key)) return null;
          return (
            <td key={col.key} className="p-4">
              <div className="flex items-center gap-3">
                {/* Show Expand button only on the first visible column */}
                {index === 0 && renderExpanded && (
                  <button onClick={onExpand} className={`text-slate-400 hover:text-primary transition-colors ${isExpanded ? 'rotate-180' : ''}`}>
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </button>
                )}
                {/* Render Custom Cell or Default */}
                {col.cell ? col.cell(item) : (item as any)[col.key]}
              </div>
            </td>
          );
        })}
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <EditAction onClick={() => onEdit(item)} />
            <DeleteAction onClick={() => onDelete(item.id)} />
            <ActionMenu>
                <ActionMenu.Item label="View Details" icon="visibility" onClick={() => onEdit(item)} />
                <ActionMenu.Divider />
                <ActionMenu.Item label="Delete" icon="delete" variant="danger" onClick={() => onDelete(item.id)} />
            </ActionMenu>
          </div>
        </td>
      </tr>
      {isExpanded && renderExpanded && (
        <tr className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-700 animate-in fade-in duration-200">
          <td className="p-0" colSpan={colSpan}>
            {renderExpanded(item)}
          </td>
        </tr>
      )}
    </>
  );
};

// Export the memoized component
export const TableRow = memo(TableRowComponent) as typeof TableRowComponent;

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => (
  <div className="p-4 flex items-center justify-between">
    <div className="text-sm text-slate-500">
      Showing <span className="font-bold text-[#0d121b] dark:text-white">{((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-bold text-[#0d121b] dark:text-white">{totalItems}</span> results
    </div>
    <div className="flex items-center gap-2">
      <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1.5 border-r border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <span className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400">Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
);
