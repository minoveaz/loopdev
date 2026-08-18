'use client';

import type React from 'react';
import { Button, FilterDropdown, SearchInput } from '../../../atoms';
import { cn } from '../../../../helpers/cn';
import type { FilterBarProps } from './types';

export type { FilterBarFilter, FilterBarProps } from './types';

export function FilterBar({
  search,
  filters = [],
  filterValues = {},
  onFilterValuesChange,
  onClear,
  actions,
  loading = false,
  disabled = false,
  readOnly = false,
  colors,
  className,
}: FilterBarProps) {
  const hasActiveFilters = Boolean(search?.value) || Object.values(filterValues).some((values) => values.length > 0);
  const isDisabled = disabled || loading;
  const clearAll = () => {
    search?.onChange('');
    filters.forEach((filter) => onFilterValuesChange?.(filter.id, []));
    onClear?.();
  };

  return (
    <div
      role="toolbar"
      aria-label="Filters and actions"
      aria-busy={loading || undefined}
      className={cn('flex min-w-0 flex-wrap items-center gap-2', className)}
      style={{
        ...(colors?.surface ? { '--filterbar-surface': colors.surface } : {}),
        ...(colors?.border ? { '--filterbar-border': colors.border } : {}),
        ...(colors?.text ? { '--filterbar-text': colors.text } : {}),
      } as React.CSSProperties}
    >
      {search ? (
        <div className="min-w-full flex-1 lg:min-w-[14rem]">
          <SearchInput
            value={search.value}
            onValueChange={search.onChange}
            placeholder={search.placeholder ?? 'Search'}
            aria-label={search.ariaLabel ?? 'Search'}
            loading={loading}
            disabled={isDisabled}
            colors={colors}
          />
        </div>
      ) : null}
      {filters.map((filter) => {
        const selected = filterValues[filter.id] ?? [];
        return (
          <FilterDropdown
            key={filter.id}
            icon={filter.icon ?? 'filter_alt'}
            label={selected.length && !filter.multiple ? `${filter.label} · ${selected[0]}` : filter.label}
            options={filter.options}
            selected={selected}
            multiple={filter.multiple}
            disabled={isDisabled}
            readOnly={readOnly}
            className="lg:w-auto lg:min-w-[8rem] lg:max-w-[13rem]"
            onToggle={(value) => {
              const next = filter.multiple
                ? selected.includes(value)
                  ? selected.filter((item) => item !== value)
                  : [...selected, value]
                : [value];
              onFilterValuesChange?.(filter.id, next);
            }}
            onClear={() => onFilterValuesChange?.(filter.id, [])}
          />
        );
      })}
      {hasActiveFilters ? (
        <Button type="button" size="sm" variant="ghost" onClick={clearAll} disabled={isDisabled || readOnly}>
          Clear filters
        </Button>
      ) : null}
      {actions ? <div className="flex w-full items-center gap-2 lg:ml-auto lg:w-auto">{actions}</div> : null}
    </div>
  );
}
