import type React from 'react';
import type { TableDensityPreset } from './density.contract';

export interface ResponsiveTableColumn<Row> {
  key: string;
  header: React.ReactNode;
  render?: (row: Row) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortAccessor?: (row: Row) => string | number;
}

export type ResponsiveTableSelectionMode = 'page' | 'all';
export type ResponsiveTableDensity = Exclude<TableDensityPreset, 'compact'> | 'compact';
export type ResponsiveTablePaginationVariant = 'default' | 'compact';

export interface ResponsiveTableLabels {
  selectAll: string;
  selectRow: (key: React.Key) => string;
  selected: (count: number) => string;
  clearSelection: string;
  actions: string;
  mobileHeader: {
    record: string;
    status: string;
    actions: string;
  };
  previous: string;
  next: string;
  goToPage: string;
  rowsPerPage: string;
  showing: (from: number, to: number, total: number) => string;
}

export interface ResponsiveTableProps<Row> extends React.HTMLAttributes<HTMLDivElement> {
  columns: ResponsiveTableColumn<Row>[];
  rows: Row[];
  getRowKey?: (row: Row, index: number) => React.Key;
  caption?: string;
  emptyState?: React.ReactNode;
  loading?: boolean;
  loadingState?: React.ReactNode;
  errorState?: React.ReactNode;
  offline?: boolean;
  offlineState?: React.ReactNode;
  forbidden?: boolean;
  forbiddenState?: React.ReactNode;
  disabledState?: React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  selectionMode?: ResponsiveTableSelectionMode;
  selectedRowKeys?: React.Key[];
  onSelectedRowKeysChange?: (keys: React.Key[]) => void;
  bulkActions?: React.ReactNode;
  onClearSelection?: () => void;
  clearSelectionLabel?: string;
  renderMobileRow?: (row: Row, index: number) => React.ReactNode;
  showAllColumnsOnMobile?: boolean;
  mobileHeaders?: Partial<ResponsiveTableLabels['mobileHeader']>;
  labels?: Partial<ResponsiveTableLabels> & { mobileHeader?: Partial<ResponsiveTableLabels['mobileHeader']> };
  rowActions?: (row: Row, index: number) => React.ReactNode;
  onRowClick?: (row: Row, index: number) => void;
  selectOnRowClick?: boolean;
  activeRowKey?: React.Key;
  selectedRowKey?: React.Key;
  density?: ResponsiveTableDensity;
  paginationVariant?: ResponsiveTablePaginationVariant;
  hidePageSizeSelector?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  resetPageKey?: string | number;
  onPageSizeChange?: (pageSize: number) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
}
