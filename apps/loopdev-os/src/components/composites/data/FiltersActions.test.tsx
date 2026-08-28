import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { FiltersActions, type FiltersActionsLabels } from './FiltersActions';

type Row = { id: string; name: string; status: string };

const rows: Row[] = [
  { id: 'one', name: 'Acme', status: 'Active' },
  { id: 'two', name: 'Northstar', status: 'Paused' },
];

const labels: FiltersActionsLabels = {
  title: 'Customer records',
  resultCount: (count) => `${count} records`,
  searchLabel: 'Search customers',
  searchPlaceholder: 'Search customers',
  clearSearch: 'Clear search',
  moreFilters: 'More filters',
  clearFilters: 'Clear filters',
  activeFilters: 'Active filters',
  loading: 'Loading records',
  skeleton: 'Loading record placeholders',
  empty: 'No records',
  filteredEmpty: 'No matching records',
  error: 'Could not load records',
  forbidden: 'You cannot access these records',
};

function renderComponent(
  overrides: Partial<React.ComponentProps<typeof FiltersActions<Row>>> = {},
) {
  let query = '';
  const onQueryChange = (value: string) => {
    query = value;
    void query;
  };
  return render(
    <FiltersActions
      rows={rows}
      columns={[
        { key: 'name', header: 'Name', sortable: true },
        { key: 'status', header: 'Status' },
      ]}
      getRowKey={(row) => row.id}
      search={{ value: query, onChange: onQueryChange }}
      filters={[{ id: 'status', label: 'Status', options: ['Active', 'Paused'] }]}
      labels={labels}
      {...overrides}
    />,
  );
}

describe('FiltersActions', () => {
  it('renders the public composition and supports clear search', () => {
    renderComponent({ search: { value: 'Acme', onChange: vi.fn() } });
    expect(screen.getByRole('toolbar', { name: labels.title })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: labels.clearSearch }));
  });

  it.each(['loading', 'skeleton', 'empty', 'error', 'forbidden'] as const)(
    'renders %s state',
    (state) => {
      renderComponent({ state, rows: state === 'empty' ? [] : rows });
      expect(screen.getByText(labels[state])).toBeInTheDocument();
    },
  );

  it('disables selection in read-only mode', () => {
    renderComponent({ readOnly: true });
    expect(screen.queryByRole('checkbox', { name: 'Select all rows' })).not.toBeInTheDocument();
  });

  it('clears uncontrolled selection from the bulk action bar', () => {
    renderComponent({ bulkActions: <button type="button">Assign owner</button> });

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(screen.getByRole('toolbar', { name: 'Bulk actions' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.queryByRole('toolbar', { name: 'Bulk actions' })).not.toBeInTheDocument();
  });

  it('passes axe in the ready state', async () => {
    const { container } = renderComponent();
    expect(await axe(container)).toHaveNoViolations();
  });
});
