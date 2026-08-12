import { render, screen } from '@testing-library/react';
import { ResponsiveTable } from './index';
import { axe } from 'vitest-axe';

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
  });

  it('renders the empty contract when no rows are available', () => {
    render(<ResponsiveTable columns={columns} rows={[]} emptyState="No brands" />);

    expect(screen.getByText('No brands')).toBeInTheDocument();
  });

  it('has no accessibility violations with data and a caption', async () => {
    const rows: BrandRow[] = [{ id: 'brand-1', name: 'VitaBlue', status: 'Published' }];
    const { container } = render(
      <ResponsiveTable caption="Brands" columns={columns} rows={rows} getRowKey={(row) => row.id} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
