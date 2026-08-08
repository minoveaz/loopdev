import React from 'react';
import { LpdText } from '../../../atoms';
import type { ResponsiveTableProps } from './types';

export function ResponsiveTable<Row extends Record<string, unknown>>({
  columns,
  rows,
  getRowKey = (_, index) => index,
  caption,
  emptyState,
  className = '',
  ...rest
}: ResponsiveTableProps<Row>) {
  return (
    <div className={`w-full overflow-x-auto ${className}`} {...rest}>
      <table className="min-w-full border-collapse text-left">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-border-subtle">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`whitespace-nowrap px-3 py-2 ${column.className ?? ''}`}
              >
                <LpdText
                  as="span"
                  size="xs"
                  variant="mono"
                  className="uppercase tracking-widest text-text-muted"
                >
                  {column.header}
                </LpdText>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className="border-b border-border-subtle last:border-b-0"
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-3 py-3 ${column.className ?? ''}`}>
                    {column.render ? column.render(row) : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center">
                {emptyState ?? (
                  <LpdText size="sm" className="text-text-muted">
                    No results
                  </LpdText>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export type { ResponsiveTableColumn, ResponsiveTableProps } from './types';
