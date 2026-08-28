import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './index';

describe('Pagination', () => {
  it('renders page information and navigates', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={4} totalItems={80} onPageChange={onPageChange} />);
    expect(screen.getByText('Page 2 of 4 (80 total)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables boundary navigation', () => {
    render(<Pagination currentPage={1} totalPages={2} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });
});
