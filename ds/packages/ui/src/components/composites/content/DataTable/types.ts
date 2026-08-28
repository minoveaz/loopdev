import type React from 'react';
import type { ResponsiveTableColumn, ResponsiveTableProps } from '../ResponsiveTable';

export interface DataTableFilter<Row> {
  key: string;
  label: React.ReactNode;
  options: Array<{ value: string; label: React.ReactNode }>;
  getValue?: (row: Row) => string;
}

export interface DataTableSearch<Row> {
  placeholder?: string;
  fields?: Array<keyof Row & string>;
  getValue?: (row: Row) => string;
}

export interface DataTableProps<Row extends Record<string, unknown>>
  extends Omit<ResponsiveTableProps<Row>, 'columns' | 'rows' | 'className'> {
  columns: ResponsiveTableColumn<Row>[];
  rows: Row[];
  search?: DataTableSearch<Row>;
  filters?: DataTableFilter<Row>[];
  className?: string;
}
