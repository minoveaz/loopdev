import { useState } from 'react';
import type React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { EntityTable } from './EntityTable';
import {
  entityTableColumns,
  entityTableFilters,
  entityTableLabels,
} from '@/app/composition-showcase/entity-table.fixture';

const rows = [
  { id: 'one', name: 'Acme Industries', segment: 'Enterprise', status: 'Active' as const, owner: 'Ana', email: 'one@example.test', region: 'North America', updated: 'Today' },
  { id: 'two', name: 'Northstar Health', segment: 'Mid-market', status: 'Paused' as const, owner: 'Luis', email: 'two@example.test', region: 'Europe', updated: 'Yesterday' },
];

const renderEntityTable = (props: Partial<React.ComponentProps<typeof EntityTable>> = {}) =>
  render(
    <EntityTable
      rows={rows}
      columns={entityTableColumns}
      filters={entityTableFilters}
      labels={entityTableLabels}
      {...props}
    />,
  );

describe('EntityTable', () => {
  it('renders the neutral CRM table with search, filters and page action', () => {
    renderEntityTable();

    expect(screen.getByRole('toolbar', { name: 'Customer records' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create customer' })).toBeEnabled();
    expect(screen.getAllByText('Acme Industries')).not.toHaveLength(0);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).not.toBeChecked();
    expect(screen.getAllByRole('checkbox', { name: 'Select row one' }).every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true);
    expect(screen.getAllByRole('checkbox', { name: 'Select row two' }).every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true);
  });

  it('keeps pagination and selection usable with a dense dataset', () => {
    const denseRows = Array.from({ length: 100 }, (_, index) => ({
      ...rows[index % rows.length],
      id: `dense-${index + 1}`,
      name: `Customer ${String(index + 1).padStart(3, '0')}`,
      email: `customer-${index + 1}@example.test`,
    }));

    renderEntityTable({ rows: denseRows });

    expect(screen.getByText('Showing 1-5 of 100')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Rows per page' })).toHaveTextContent('5 rows');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Showing 6-10 of 100')).toBeInTheDocument();
    expect(screen.getByText('Customer 006')).toBeInTheDocument();
    expect(screen.queryByText('Customer 001')).not.toBeInTheDocument();
  });

  it('keeps filter context and exposes recovery for filtered empty results', () => {
    renderEntityTable({ rows: [] });

    fireEvent.change(screen.getByRole('textbox', { name: 'Search customers' }), {
      target: { value: 'missing' },
    });

    expect(screen.getByText('No customers match these filters.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('keeps selection independent from the page action', () => {
    const onSelectedRowKeysChange = vi.fn();
    const onCreateCustomer = vi.fn();

    renderEntityTable({ onSelectedRowKeysChange, onCreateCustomer });

    fireEvent.click(screen.getByRole('button', { name: 'Create customer' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));

    expect(onCreateCustomer).toHaveBeenCalledOnce();
    expect(onSelectedRowKeysChange).toHaveBeenCalledWith(['one', 'two']);
  });

  it('toggles selection from the row while keeping Open as a separate action', () => {
    const onSelectedRowKeysChange = vi.fn();
    const onRowClick = vi.fn();

    renderEntityTable({ contextPanelEnabled: true, onSelectedRowKeysChange, onRowClick });

    fireEvent.click(screen.getByRole('cell', { name: 'Acme Industries' }));
    expect(onSelectedRowKeysChange).toHaveBeenCalledWith(['one']);
    expect(onRowClick).not.toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('button', { name: 'Open Acme Industries' })[0]);
    expect(onRowClick).toHaveBeenCalledWith(rows[0], 0);
  });

  it('clears the controlled selection from the bulk toolbar', () => {
    function ControlledEntityTable() {
      const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['one', 'two']);

      return (
        <EntityTable
          rows={rows}
          columns={entityTableColumns}
          filters={entityTableFilters}
          labels={entityTableLabels}
          selectedRowKeys={selectedKeys}
          onSelectedRowKeysChange={setSelectedKeys}
        />
      );
    }

    render(<ControlledEntityTable />);

    expect(screen.getAllByRole('checkbox', { name: 'Select row one' }).some((checkbox) => (checkbox as HTMLInputElement).checked)).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.getAllByRole('checkbox', { name: 'Select row one' }).every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true);
    expect(screen.getAllByRole('checkbox', { name: 'Select row two' }).every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true);
  });

  it.each(['loading', 'skeleton', 'empty', 'error', 'forbidden'] as const)(
    'renders the %s state',
    (state) => {
      renderEntityTable({ rows: state === 'empty' ? [] : rows, state });
      const expected = {
        loading: 'Loading customer records',
        skeleton: 'Loading customer record placeholders',
        empty: 'No customer records',
        error: 'Customer records could not be loaded.',
        forbidden: 'You do not have access to customer records.',
      }[state];

      expect(screen.getByText(expected)).toBeInTheDocument();
    },
  );

  it('removes mutation actions from read-only mode and passes Axe', async () => {
    const { container } = renderEntityTable({ readOnly: true });

    expect(screen.getByRole('button', { name: 'Create customer' })).toBeDisabled();
    expect(screen.queryByRole('checkbox', { name: 'Select all rows' })).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
