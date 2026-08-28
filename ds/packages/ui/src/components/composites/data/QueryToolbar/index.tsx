'use client';

import type React from 'react';
import { Button } from '../../../atoms';
import { FilterBar } from '../FilterBar';
import { cn } from '../../../../helpers/cn';
import type { QueryToolbarProps } from './types';

export type { QueryToolbarOption, QueryToolbarProps } from './types';

export function QueryToolbar({
  search,
  filters,
  filterValues,
  onFilterValuesChange,
  onClear,
  resultCount,
  resultCountLabel = (count) => `${count} results`,
  sort,
  view,
  pagination,
  actions,
  loading = false,
  disabled = false,
  readOnly = false,
  showClear = true,
  colors,
  className,
}: QueryToolbarProps) {
  const isDisabled = disabled || loading;
  const selectClass =
    'h-8 min-w-28 rounded-md border border-border-technical bg-shell-surface px-2 text-xs text-text-main';

  return (
    <div
      className={cn('min-w-0 space-y-2', className)}
      aria-busy={loading || undefined}
      style={
        {
          ...(colors?.surface ? { '--query-toolbar-surface': colors.surface } : {}),
          ...(colors?.border ? { '--query-toolbar-border': colors.border } : {}),
          ...(colors?.text ? { '--query-toolbar-text': colors.text } : {}),
        } as React.CSSProperties
      }
    >
      <FilterBar
        search={search}
        filters={filters}
        filterValues={filterValues}
        onFilterValuesChange={onFilterValuesChange}
        onClear={onClear}
        loading={loading}
        disabled={disabled}
        readOnly={readOnly}
        showClear={showClear}
        colors={colors}
        actions={actions}
      />
      {resultCount !== undefined || sort || view || pagination ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-text-muted">
          {resultCount !== undefined ? (
            <span aria-live="polite">{resultCountLabel(resultCount)}</span>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            {sort ? (
              <label className="flex items-center gap-2">
                <span>{sort.label ?? 'Sort'}</span>
                {sort.control ?? (
                  <select
                    aria-label={sort.label ?? 'Sort'}
                    value={sort.value}
                    disabled={isDisabled || readOnly}
                    onChange={(event) => sort.onChange(event.target.value)}
                    className={selectClass}
                  >
                    {sort.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            ) : null}
            {view ? (
              <div
                className="flex items-center gap-1 rounded-md border border-border-subtle bg-surface-elevated/60 p-1"
                role="group"
                aria-label={view.label ?? 'View'}
              >
                <span className="px-2 text-text-muted">{view.label ?? 'View'}</span>
                {view.options.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={view.value === option.value ? 'primary' : 'ghost'}
                    className="min-h-8 px-3"
                    aria-pressed={view.value === option.value}
                    disabled={isDisabled || readOnly}
                    onClick={() => view.onChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            ) : null}
            {pagination ? (
              <div className="mt-1 w-full border-t border-border-subtle pt-3 lg:mt-0 lg:w-auto lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
                {pagination}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
