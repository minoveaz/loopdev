import { fireEvent, render, screen } from '@testing-library/react';
import { ResponsiveTable } from './index';
import { axe } from 'vitest-axe';
import { vi } from 'vitest';

interface BrandRow extends Record<string, unknown> {
  id: string;
  name: string;
}

const columns = [
  { key: 'name', header: 'Brand' },
  { key: 'status', header: 'Status' },
];

describe('ResponsiveTable', () => {
  it('renders an accessible table and keeps overflow at the wrapper boundary', () => {
    const rows: BrandRow[] = [{ id: 'brand-1', name: 'VitaBlue', status: 'Published' }];

    render(
      <ResponsiveTable
        caption="Brands"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
      />,
    );

    expect(screen.getByRole('table', { name: 'Brands' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'VitaBlue' })).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByLabelText('Scrollable data table')).toHaveAttribute('data-table-density', 'comfortable');
    expect(screen.getByLabelText('Scrollable data table')).toHaveAttribute('data-table-overflow', 'horizontal-zone');
    expect(screen.getByLabelText('Scrollable data table').querySelector('[data-table-scroll="horizontal"]')).toBeInTheDocument();
  });

  it('renders the empty contract when no rows are available', () => {
    render(<ResponsiveTable columns={columns} rows={[]} emptyState="No brands" />);

    expect(screen.getByText('No brands')).toBeInTheDocument();
  });

  it('exposes loading, error, forbidden and read-only table states', () => {
    const { rerender } = render(
      <ResponsiveTable columns={columns} rows={[]} loading loadingState="Loading brands" readOnly />,
    );

    expect(screen.getByText('Loading brands')).toBeInTheDocument();
    expect(screen.getByLabelText('Scrollable data table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText('Scrollable data table')).toHaveAttribute('data-readonly', 'true');

    rerender(<ResponsiveTable columns={columns} rows={[]} errorState="Unable to load brands" />);
    expect(screen.getByText('Unable to load brands')).toBeInTheDocument();

    rerender(<ResponsiveTable columns={columns} rows={[]} forbidden forbiddenState="Restricted" />);
    expect(screen.getByText('Restricted')).toBeInTheDocument();

    rerender(<ResponsiveTable columns={columns} rows={[]} disabled disabledState="Unavailable" />);
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.getByLabelText('Scrollable data table')).toHaveAttribute('aria-disabled', 'true');
  });

  it('keeps row actions from triggering the row click handler', () => {
    const onRowClick = vi.fn();
    const rows: BrandRow[] = [{ id: 'brand-1', name: 'VitaBlue', status: 'Published' }];

    render(
      <ResponsiveTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onRowClick={onRowClick}
        rowActions={() => <button type="button">Open</button>}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('uses configurable mobile headers and falls back to the selection callback', () => {
    const onSelectedRowKeysChange = vi.fn();
    const rows: BrandRow[] = [{ id: 'brand-1', name: 'VitaBlue', status: 'Published' }];

    render(
      <ResponsiveTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        selectable
        selectedRowKeys={['brand-1']}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
        bulkActions={<button type="button">Archive</button>}
        renderMobileRow={(row) => <article aria-label={row.name}>{row.name}</article>}
        mobileHeaders={{ record: 'Customer', status: 'State', actions: 'More' }}
      />,
    );

    expect(screen.getAllByText('Customer').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onSelectedRowKeysChange).toHaveBeenCalledWith([]);
  });

  it('supports controlled pagination, sorting accessors and page selection semantics', () => {
    const onPageChange = vi.fn();
    const onSelectedRowKeysChange = vi.fn();
    const rows: BrandRow[] = [
      { id: 'brand-1', name: 'Zeta', status: 'Published' },
      { id: 'brand-2', name: 'Alpha', status: 'Draft' },
    ];

    render(
      <ResponsiveTable
        columns={[{ key: 'name', header: 'Brand', sortable: true, sortAccessor: (row) => row.name }]}
        rows={rows}
        getRowKey={(row) => row.id}
        selectable
        selectionMode="all"
        selectedRowKeys={[]}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
        currentPage={1}
        pageSize={1}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sort by Brand' }));
    expect(screen.getByRole('columnheader', { name: /Brand/ })).toHaveAttribute('aria-sort', 'ascending');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectedRowKeysChange).toHaveBeenCalledWith(['brand-2', 'brand-1']);
  });

  it('locks sorting and pagination controls for non-interactive table states', () => {
    const rows: BrandRow[] = Array.from({ length: 6 }, (_, index) => ({
      id: `brand-${index + 1}`,
      name: `Brand ${index + 1}`,
      status: 'Published',
    }));

    render(
      <ResponsiveTable
        columns={[{ key: 'name', header: 'Brand', sortable: true }]}
        rows={rows}
        getRowKey={(row) => row.id}
        readOnly
        pageSize={5}
        density="dense"
        paginationVariant="compact"
      />,
    );

    const table = screen.getByLabelText('Scrollable data table');
    expect(table).toHaveAttribute('data-table-density', 'dense');
    expect(table).toHaveAttribute('data-table-pagination', 'compact');
    expect(screen.getByRole('button', { name: 'Sort by Brand' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('supports compact pagination without the page-size selector', () => {
    const rows: BrandRow[] = Array.from({ length: 6 }, (_, index) => ({
      id: `brand-${index + 1}`,
      name: `Brand ${index + 1}`,
      status: 'Published',
    }));

    render(
      <ResponsiveTable
        caption="Brands"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        pageSize={5}
        paginationVariant="compact"
        hidePageSizeSelector
      />,
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Rows per page' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page' })).toBeInTheDocument();
  });

  it('resets the page when the consumer changes the reset key', () => {
    const rows: BrandRow[] = Array.from({ length: 6 }, (_, index) => ({
      id: `brand-${index + 1}`,
      name: `Brand ${index + 1}`,
      status: 'Published',
    }));
    const { rerender } = render(
      <ResponsiveTable columns={columns} rows={rows} getRowKey={(row) => row.id} pageSize={5} resetPageKey="initial" />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Brand 6')).toBeInTheDocument();
    rerender(<ResponsiveTable columns={columns} rows={rows.slice(0, 1)} getRowKey={(row) => row.id} pageSize={5} resetPageKey="filtered" />);
    expect(screen.getByText('Brand 1')).toBeInTheDocument();
  });

  it('supports controlled row selection and bulk actions', () => {
    const onSelectedRowKeysChange = vi.fn();
    const rows: BrandRow[] = [
      { id: 'brand-1', name: 'VitaBlue', status: 'Published' },
      { id: 'brand-2', name: 'LoopDev', status: 'Draft' },
    ];

    render(
      <ResponsiveTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        selectable
        selectedRowKeys={[]}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
        bulkActions={<button type="button">Archive</button>}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row brand-1' }));
    expect(onSelectedRowKeysChange).toHaveBeenCalledWith(['brand-1']);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectedRowKeysChange).toHaveBeenCalledWith(['brand-1', 'brand-2']);
  });

  it('supports an explicit semantic mobile row representation', () => {
    const rows: BrandRow[] = [{ id: 'brand-1', name: 'VitaBlue', status: 'Published' }];

    render(
      <ResponsiveTable
        caption="Brands"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        renderMobileRow={(row) => (
          <article aria-label={row.name}>
            <strong>{row.name}</strong>
            <span>{String(row.status)}</span>
          </article>
        )}
      />,
    );

    const mobileRow = screen.getByRole('article', { name: 'VitaBlue' });
    expect(mobileRow).toBeInTheDocument();
    expect(mobileRow).toHaveTextContent('Published');
  });

  it('has no accessibility violations with data and a caption', async () => {
    const rows: BrandRow[] = [{ id: 'brand-1', name: 'VitaBlue', status: 'Published' }];
    const { container } = render(
      <ResponsiveTable caption="Brands" columns={columns} rows={rows} getRowKey={(row) => row.id} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
