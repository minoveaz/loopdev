import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DenseOperationalTable, type DenseOperationalRow } from './DenseOperationalTable';

const rows: DenseOperationalRow[] = [
  { id: 'one', name: 'Acme Industries', segment: 'Enterprise', status: 'Active', owner: 'Ana' },
  { id: 'two', name: 'Northstar Health', segment: 'Mid-market', status: 'Active', owner: 'Luis' },
  { id: 'three', name: 'Studio Meridian', segment: 'SMB', status: 'Paused', owner: 'Marta' },
];

describe('DenseOperationalTable', () => {
  it('renders a focused sortable and paginated operational data surface', () => {
    render(
      <DenseOperationalTable
        rows={rows}
        pageSize={2}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Customer' })).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(6);
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getAllByText('Acme Industries')).not.toHaveLength(0);
    expect(screen.queryByText('Studio Meridian')).not.toBeInTheDocument();

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Rows per page' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getAllByText('Studio Meridian')).not.toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Sort by Customer' }));
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('keeps pagination and sorting usable with a dense operational dataset', () => {
    const denseRows = Array.from({ length: 100 }, (_, index) => ({
      id: `dense-${index + 1}`,
      name: `Operation ${String(index + 1).padStart(3, '0')}`,
      segment: index % 2 === 0 ? 'Enterprise' : 'SMB',
      status: index % 3 === 0 ? 'Paused' as const : 'Active' as const,
      owner: index % 2 === 0 ? 'Ana' : 'Luis',
    }));

    render(<DenseOperationalTable rows={denseRows} pageSize={5} />);

    expect(screen.getByText('Showing 1-5 of 100')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: 'Rows per page' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Showing 6-10 of 100')).toBeInTheDocument();
    expect(screen.getByText('Operation 006')).toBeInTheDocument();
    expect(screen.queryByText('Operation 001')).not.toBeInTheDocument();
  });
});
