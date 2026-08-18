'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button, Input, Select, Spacer, TechnicalSurface } from '../../../atoms';
import { ResponsiveTable } from '../ResponsiveTable';
import type { DataTableProps } from './types';

export function DataTable<Row extends Record<string, unknown>>({
  search,
  filters = [],
  rows,
  columns,
  className = '',
  ...tableProps
}: DataTableProps<Row>) {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const hasToolbar = Boolean(search || filters.length);
  const hasActiveFilters = Boolean(query) || Object.values(filterValues).some((value) => value && value !== 'all');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredRows = rows.filter((row) => {
    const searchValue = search?.getValue
      ? search.getValue(row)
      : search?.fields
        ? search.fields.map((field) => String(row[field] ?? '')).join(' ')
        : Object.values(row).map(String).join(' ');
    const matchesSearch = !normalizedQuery || searchValue.toLowerCase().includes(normalizedQuery);
    const matchesFilters = filters.every((filter) => {
      const value = filterValues[filter.key];
      return !value || value === 'all' || (filter.getValue ? filter.getValue(row) : String(row[filter.key] ?? '')) === value;
    });
    return matchesSearch && matchesFilters;
  });

  return (
    <div className={`flex w-full min-w-0 flex-col bg-transparent ${className}`}>
      {hasToolbar ? (
        <TechnicalSurface variant="surface" depth="flat" radius="sm" border="none" className="overflow-hidden">
          <div role="toolbar" aria-label="Data table controls" className="flex min-h-14 flex-wrap items-end gap-2 p-3">
          {search ? (
            <Input
              aria-label={search.placeholder ?? 'Search'}
              placeholder={search.placeholder ?? 'Search'}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              startIcon={<Search size={14} aria-hidden="true" />}
              size="sm"
              fullWidth={false}
              className="min-w-[16rem] flex-[1_1_20rem]"
            />
          ) : null}
          {filters.map((filter) => (
            <Select
              key={filter.key}
              label={typeof filter.label === 'string' ? filter.label : undefined}
              size="sm"
              fullWidth={false}
              className="min-w-[7rem]"
              value={filterValues[filter.key] ?? 'all'}
              onChange={(event) => setFilterValues((current) => ({ ...current, [filter.key]: event.target.value }))}
            >
              <option value="all">All</option>
              {filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
          ))}
          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setFilterValues({}); }}>
              Reset
            </Button>
          ) : null}
            <span className="pb-2 pl-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">{filteredRows.length} results</span>
          </div>
        </TechnicalSurface>
      ) : null}
      {hasToolbar ? <Spacer size="md" /> : null}
      <TechnicalSurface variant="canvas" depth="flat" radius="sm" border="technical" className="overflow-hidden">
        <ResponsiveTable {...tableProps} columns={columns} rows={filteredRows} className="w-full" />
      </TechnicalSurface>
    </div>
  );
}

export type { DataTableFilter, DataTableProps, DataTableSearch } from './types';
