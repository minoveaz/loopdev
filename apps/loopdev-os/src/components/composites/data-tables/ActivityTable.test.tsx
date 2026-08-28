import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityTable } from './ActivityTable';

describe('ActivityTable', () => {
  it('renders newest-first activity with semantic identity and status atoms', () => {
    render(<ActivityTable />);

    expect(screen.getByRole('table', { name: 'Activity events' })).toBeInTheDocument();
    expect(screen.getByText('Ana Morgan')).toBeInTheDocument();
    expect(screen.getAllByText('Open')).toHaveLength(2);
    expect(screen.getByText('Showing recent 3 events')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Date/ })).toHaveAttribute('aria-sort', 'descending');
  });

  it('sorts the activity rows when a header is activated', () => {
    render(<ActivityTable />);
    const dateHeader = screen.getByRole('button', { name: /Sort by Date/ });

    fireEvent.click(dateHeader);

    expect(screen.getByRole('columnheader', { name: /Date/ })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('emits the selected activity when context panel integration is enabled', () => {
    const onRowClick = vi.fn();
    render(<ActivityTable onRowClick={onRowClick} />);

    fireEvent.click(screen.getAllByText('Follow-up scheduled')[0]);

    expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'a1', status: 'Open' }), 0);
  });

  it('does not emit row selection when context panel integration is disabled', () => {
    const onRowClick = vi.fn();
    render(<ActivityTable contextPanelEnabled={false} onRowClick={onRowClick} />);

    fireEvent.click(screen.getAllByText('Follow-up scheduled')[0]);

    expect(onRowClick).not.toHaveBeenCalled();
  });
});
