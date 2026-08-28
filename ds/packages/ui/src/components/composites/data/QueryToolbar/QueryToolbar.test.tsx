import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryToolbar } from './index';

describe('QueryToolbar', () => {
  it('renders count, sorting and view controls', () => {
    render(
      <QueryToolbar
        resultCount={12}
        sort={{ value: 'recent', options: [{ value: 'recent', label: 'Recent' }], onChange: vi.fn() }}
        view={{ value: 'table', options: [{ value: 'table', label: 'Table' }], onChange: vi.fn() }}
      />,
    );
    expect(screen.getByText('12 results')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Sort' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Table' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('controls sort and view changes', () => {
    const onSortChange = vi.fn();
    const onViewChange = vi.fn();
    render(
      <QueryToolbar
        sort={{ value: 'recent', options: [{ value: 'recent', label: 'Recent' }, { value: 'name', label: 'Name' }], onChange: onSortChange }}
        view={{ value: 'table', options: [{ value: 'table', label: 'Table' }, { value: 'cards', label: 'Cards' }], onChange: onViewChange }}
      />,
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Sort' }), { target: { value: 'name' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cards' }));
    expect(onSortChange).toHaveBeenCalledWith('name');
    expect(onViewChange).toHaveBeenCalledWith('cards');
  });
});
