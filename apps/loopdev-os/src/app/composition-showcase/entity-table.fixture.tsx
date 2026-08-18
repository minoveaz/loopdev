'use client';

import { Badge } from '@loopdev/ui';
import type { ResponsiveTableColumn } from '@loopdev/ui';
import type {
  EntityTableRow,
  EntityTableFixtureLabels,
} from '@/components/composites/data-tables/EntityTable';
import type { FiltersActionsFilter } from '@/components/composites/data/FiltersActions';

export const entityTableRows: EntityTableRow[] = [
  { id: 'acme', name: 'Acme Industries', segment: 'Enterprise', status: 'Active', owner: 'Ana', email: 'ops@acme.example', region: 'North America', updated: 'Today, 09:42' },
  { id: 'northstar', name: 'Northstar Health', segment: 'Mid-market', status: 'Active', owner: 'Luis', email: 'team@northstar.example', region: 'Europe', updated: 'Yesterday, 16:18' },
  { id: 'meridian', name: 'Studio Meridian', segment: 'SMB', status: 'Paused', owner: 'Marta', email: 'hello@meridian.example', region: 'Latin America', updated: 'Aug 14, 11:06' },
];

export const entityTableFilters: FiltersActionsFilter[] = [
  { id: 'status', label: 'Status: All', options: ['Active', 'Paused'] },
  { id: 'segment', label: 'Segment: All', options: ['Enterprise', 'Mid-market', 'SMB'], multiple: true },
  { id: 'owner', label: 'Owner: Any', options: ['Ana', 'Luis', 'Marta'] },
];

export const entityTableLabels: EntityTableFixtureLabels = {
  title: 'Customer records',
  resultCount: (count) => `${count} records`,
  searchLabel: 'Search customers',
  searchPlaceholder: 'Search customers',
  clearSearch: 'Clear search',
  moreFilters: 'More filters',
  clearFilters: 'Clear filters',
  activeFilters: 'Active filters',
  loading: 'Loading customer records',
  skeleton: 'Loading customer record placeholders',
  empty: 'No customer records',
  filteredEmpty: 'No customers match these filters.',
  error: 'Customer records could not be loaded.',
  forbidden: 'You do not have access to customer records.',
};

export const entityTableColumns: ResponsiveTableColumn<EntityTableRow>[] = [
  { key: 'name', header: 'Customer', sortable: true, className: 'font-medium text-text-main' },
  { key: 'segment', header: 'Segment', sortable: true },
  { key: 'owner', header: 'Owner', sortable: true },
  { key: 'status', header: 'Status', sortable: true, className: 'font-medium', render: (row) => <Badge status={row.status === 'Active' ? 'success' : 'energy'}>{row.status}</Badge> },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'region', header: 'Region', sortable: true },
  { key: 'updated', header: 'Last updated', sortable: true, className: 'whitespace-nowrap' },
];
