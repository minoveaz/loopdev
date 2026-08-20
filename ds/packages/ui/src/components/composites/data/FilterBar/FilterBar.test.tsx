import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from './index';

describe('FilterBar', () => {
  it('renders controlled search and filters', () => {
    render(
      <FilterBar
        search={{ value: 'Acme', onChange: vi.fn(), ariaLabel: 'Search contacts' }}
        filters={[{ id: 'status', label: 'Status', options: ['Active', 'Paused'] }]}
        filterValues={{ status: [] }}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Search contacts' })).toHaveValue('Acme');
    expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();
  });

  it('clears search and filter values', () => {
    const onSearchChange = vi.fn();
    const onFilterValuesChange = vi.fn();
    render(
      <FilterBar
        search={{ value: 'Acme', onChange: onSearchChange }}
        filters={[{ id: 'status', label: 'Status', options: ['Active'] }]}
        filterValues={{ status: ['Active'] }}
        onFilterValuesChange={onFilterValuesChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onSearchChange).toHaveBeenCalledWith('');
    expect(onFilterValuesChange).toHaveBeenCalledWith('status', []);
  });
});
