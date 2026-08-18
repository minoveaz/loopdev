import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SelectionTable } from './SelectionTable';

describe('SelectionTable', () => {
  it('renders semantic owner and status atoms with customer sorted by default', () => {
    render(<SelectionTable />);

    expect(screen.getByRole('table', { name: 'Selection workflows' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Customer/ })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getAllByText('Active')).toHaveLength(4);
    expect(screen.getAllByText('Paused')).toHaveLength(2);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Showing 1-3 of 3 records')).toBeInTheDocument();
  });

  it('reveals contextual bulk actions and confirms owner assignment in a modal', () => {
    render(<SelectionTable />);

    fireEvent.click(screen.getByRole('checkbox', { name: /Select row acme/i }));

    expect(screen.getByText('1 selected')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Assign owner' })[0]);
    expect(screen.getByRole('heading', { name: 'Assign owner' })).toBeInTheDocument();
    expect(screen.getByText('You are assigning 1 record')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('New owner'), { target: { value: 'Sofia' } });
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Assign owner' }));

    expect(screen.getByText('Sofia')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Assign owner' })).not.toBeInTheDocument();
  });

  it('selects a row when the operator clicks a non-control cell', () => {
    render(<SelectionTable />);

    fireEvent.click(screen.getByRole('cell', { name: 'Enterprise' }));

    expect(screen.getByRole('checkbox', { name: /Select row acme/i })).toBeChecked();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('exposes mixed master selection and selects the full visible page on activation', () => {
    render(<SelectionTable />);

    fireEvent.click(screen.getByRole('checkbox', { name: /Select row acme/i }));
    const masterCheckbox = screen.getByRole('checkbox', { name: /Select all/i });

    expect(masterCheckbox).toHaveAttribute('aria-checked', 'mixed');
    fireEvent.click(masterCheckbox);

    expect(masterCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });
});
