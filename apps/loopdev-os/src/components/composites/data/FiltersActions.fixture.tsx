'use client';

import { useMemo, useState } from 'react';
import { Button } from '@loopdev/ui';
import {
  FiltersActions,
  type FiltersActionsFilter,
  type FiltersActionsLabels,
} from './FiltersActions';

type CustomerRecord = {
  id: string;
  name: string;
  segment: string;
  status: string;
  owner: string;
};

const RECORDS: CustomerRecord[] = [
  { id: 'acme', name: 'Acme Industries', segment: 'Enterprise', status: 'Active', owner: 'Ana' },
  {
    id: 'northstar',
    name: 'Northstar Health',
    segment: 'Mid-market',
    status: 'Active',
    owner: 'Luis',
  },
  { id: 'studio', name: 'Studio Meridian', segment: 'SMB', status: 'Paused', owner: 'Marta' },
];

const FILTERS: FiltersActionsFilter[] = [
  { id: 'status', label: 'Status', options: ['Active', 'Paused'] },
  {
    id: 'segment',
    label: 'Segments',
    options: ['Enterprise', 'Mid-market', 'SMB'],
    multiple: true,
  },
  { id: 'owner', label: 'Owner', options: ['Ana', 'Luis', 'Marta'] },
];

const LABELS: FiltersActionsLabels = {
  title: 'Customer records',
  resultCount: (count) => `${count} records`,
  searchLabel: 'Search contacts by name, email or company',
  searchPlaceholder: 'Search contacts',
  clearSearch: 'Clear search',
  moreFilters: 'More filters',
  clearFilters: 'Clear filters',
  activeFilters: 'Active filters',
  loading: 'Loading customer records',
  skeleton: 'Loading customer record placeholders',
  empty: 'No customer records',
  filteredEmpty: 'No customers match these filters. Clear filters to see all records.',
  error: 'Customer records could not be loaded.',
  forbidden: 'You do not have access to customer records.',
};

const COLUMNS = [
  { key: 'name', header: 'Customer', sortable: true },
  { key: 'segment', header: 'Segment', sortable: true },
  { key: 'owner', header: 'Owner', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
] as const;

export function FiltersActionsFixture() {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

  const rows = useMemo(
    () =>
      RECORDS.filter((record) => {
        const searchMatch = record.name.toLowerCase().includes(query.toLowerCase());
        const matches = Object.entries(filterValues).every(([id, values]) => {
          const active = values.filter((value) => value !== 'all');
          if (!active.length) return true;
          const recordValue = record[id as keyof CustomerRecord];
          return active.includes(recordValue);
        });
        return searchMatch && matches;
      }),
    [filterValues, query],
  );

  return (
    <FiltersActions
      rows={rows}
      columns={[...COLUMNS]}
      getRowKey={(row) => row.id}
      search={{ value: query, onChange: setQuery }}
      filters={FILTERS}
      visibleFilterCount={2}
      filterValues={filterValues}
      onFilterValuesChange={(id, values) =>
        setFilterValues((current) => ({ ...current, [id]: values }))
      }
      labels={LABELS}
      pageAction={
        <Button variant="primary" size="sm">
          Create contact
        </Button>
      }
      bulkActions={
        <Button variant="primary" size="sm">
          Assign owner
        </Button>
      }
      onClearFilters={() => setFilterValues({})}
    />
  );
}
