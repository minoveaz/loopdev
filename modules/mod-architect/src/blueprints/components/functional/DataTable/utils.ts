
import React from 'react';

// --- Generic Types ---

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  /** Custom render function for the cell content */
  cell?: (item: T) => React.ReactNode;
  /** If strictly text filtering is needed on a different value than what is rendered */
  filterValue?: (item: T) => string; 
  /** Optional width class */
  width?: string;
  /** Is this column visible by default? */
  defaultVisible?: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// --- Helpers ---

export const getRelativeTimeValue = (timeStr: string): number => {
  if (!timeStr) return 9999999;
  const str = timeStr.toLowerCase();
  if (str.includes('just now')) return 0;
  const value = parseInt(str.match(/\d+/)?.[0] || '0', 10);
  if (str.includes('min')) return value;
  if (str.includes('hour')) return value * 60;
  if (str.includes('day')) return value * 60 * 24;
  if (str.includes('week')) return value * 60 * 24 * 7;
  if (str.includes('month')) return value * 60 * 24 * 30;
  return 9999999;
};

// Generic CSV Export
export const downloadAsCSV = <T extends Record<string, any>>(data: T[], filename = 'export') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map(item => 
    headers.map(fieldName => {
      const val = item[fieldName];
      // Escape quotes and wrap in quotes to handle commas in data
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
