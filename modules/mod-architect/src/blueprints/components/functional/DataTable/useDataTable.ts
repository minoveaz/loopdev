
import React, { useState, useMemo, useCallback } from 'react';
import { SortConfig, getRelativeTimeValue, downloadAsCSV, ColumnDef } from './utils';

// We make the hook generic <T>
export const useDataTable = <T extends Record<string, any>>(
  data: T[], 
  columns: ColumnDef<T>[]
) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter State: category (column key) -> Set of values
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter(c => c.defaultVisible !== false).map(c => c.key))
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let result = data;

    // 1. Category Filters
    Object.entries(filters).forEach(([key, activeValues]) => {
      if (activeValues.size > 0) {
        result = result.filter(item => {
          const itemValue = String(item[key]);
          return activeValues.has(itemValue);
        });
      }
    });

    // 2. Text Search (Global)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(lowerQuery)
        )
      );
    }

    return result;
  }, [data, searchQuery, filters]);

  // --- Sorting Logic ---
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const { key, direction } = sortConfig;
      
      // Special handling for time strings if detected (could be moved to column config in future)
      if (key === 'lastActive') {
        const valA = getRelativeTimeValue(a[key]);
        const valB = getRelativeTimeValue(b[key]);
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      const valA = a[key];
      const valB = b[key];

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // --- Pagination ---
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // --- Handlers (Wrapped in useCallback for Performance) ---

  const toggleColumn = useCallback((key: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleExport = useCallback((idsToExport?: Set<string>) => {
    const dataToExport = (idsToExport && idsToExport.size > 0)
      ? data.filter(d => idsToExport.has(d.id))
      : sortedData;
    
    downloadAsCSV(dataToExport);
  }, [data, sortedData]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  }, []);

  const toggleFilter = useCallback((category: string, value: string) => {
    setFilters(prev => {
      const categorySet = new Set(prev[category] || []);
      if (categorySet.has(value)) {
        categorySet.delete(value);
      } else {
        categorySet.add(value);
      }
      return { ...prev, [category]: categorySet };
    });
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({});
    setCurrentPage(1);
  }, []);

  const removeFilter = useCallback((category: string, value: string) => {
    setFilters(prev => {
      const categorySet = new Set(prev[category]);
      categorySet.delete(value);
      return { ...prev, [category]: categorySet };
    });
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' } 
          : null;
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const toggleAll = useCallback(() => {
    // Note: We use paginatedData here, so this dependency is tricky. 
    // Usually toggleAll changes often anyway, so useCallback might trigger often, which is fine.
    // To strictly optimize, we'd need functional updates or refs, but this is sufficient for now.
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(d => d.id)));
    }
  }, [selectedIds.size, paginatedData]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const deleteItem = useCallback((id: string) => {
    console.log("Delete request for:", id);
  }, []);

  const deleteMultipleItems = useCallback((ids: Set<string>) => {
    console.log("Bulk delete request for:", ids);
    setSelectedIds(new Set());
  }, []);

  // Extract unique values for filters automatically from data
  const availableFilters = useMemo(() => {
    const options: Record<string, Set<string>> = {};
    columns.forEach(col => {
        options[col.key] = new Set(data.map(item => String(item[col.key])));
    });
    return options;
  }, [data, columns]);

  const activeFilterCount = Object.values(filters).reduce((acc, set) => acc + set.size, 0);

  return {
    visibleData: paginatedData,
    totalItems: sortedData.length,
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
    setPageSize,
    deleteItem,
    deleteMultipleItems,
    toggleColumn,
    handleExport
  };
};
