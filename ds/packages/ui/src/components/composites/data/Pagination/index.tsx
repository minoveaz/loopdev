'use client';

import type React from 'react';
import { Button } from '../../../atoms';
import { cn } from '../../../../helpers/cn';
import type { PaginationProps } from './types';

export type { PaginationProps } from './types';

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  labels,
  loading = false,
  disabled = false,
  colors,
  className,
}: PaginationProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;
  const isDisabled = disabled || loading;
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Pagination"
      aria-busy={loading || undefined}
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
      style={{ ...(colors?.text ? { '--pagination-text': colors.text } : {}), ...(colors?.border ? { '--pagination-border': colors.border } : {}) } as React.CSSProperties}
    >
      <span className="text-xs text-text-muted">
        {labels?.page?.(currentPage, totalPages) ?? `Page ${currentPage} of ${totalPages}`}
        {totalItems !== undefined ? ` (${totalItems} total)` : ''}
      </span>
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={isFirst || isDisabled}>
          {labels?.previous ?? 'Previous'}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => onPageChange(currentPage + 1)} disabled={isLast || isDisabled}>
          {labels?.next ?? 'Next'}
        </Button>
      </div>
    </nav>
  );
}
