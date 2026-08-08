import type React from 'react';

export interface ResponsiveTableColumn<Row> {
  key: string;
  header: React.ReactNode;
  render?: (row: Row) => React.ReactNode;
  className?: string;
}

export interface ResponsiveTableProps<Row> extends React.HTMLAttributes<HTMLDivElement> {
  columns: ResponsiveTableColumn<Row>[];
  rows: Row[];
  getRowKey?: (row: Row, index: number) => React.Key;
  caption?: string;
  emptyState?: React.ReactNode;
}
