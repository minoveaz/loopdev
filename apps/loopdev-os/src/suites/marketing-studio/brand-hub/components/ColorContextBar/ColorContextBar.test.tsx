/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ColorContextBar } from './index';

describe('ColorContextBar Composite', () => {
  const mockProps: any = {
    theme: 'light',
    onThemeChange: vi.fn(),
    viewMode: 'grid',
    onViewModeChange: vi.fn(),
    search: '',
    onSearchChange: vi.fn(),
    activeCategory: 'all',
    onCategoryChange: vi.fn(),
  };

  it('renders all control sections', () => {
    render(<ColorContextBar {...mockProps} />);
    expect(screen.getByPlaceholderText(/SEARCH TOKENS/i)).toBeDefined();
    expect(screen.getByText(/Core/i)).toBeDefined();
    expect(screen.getByText('{ LIGHT }')).toBeDefined();
  });

  it('calls onThemeChange when theme buttons are clicked', () => {
    render(<ColorContextBar {...mockProps} />);
    const darkButton = screen.getByText('dark_mode').closest('button')!;
    fireEvent.click(darkButton);
    expect(mockProps.onThemeChange).toHaveBeenCalledWith('dark');
  });

  it('calls onSearchChange when typing in search input', () => {
    render(<ColorContextBar {...mockProps} />);
    const input = screen.getByPlaceholderText(/SEARCH TOKENS/i);
    fireEvent.change(input, { target: { value: 'blue' } });
    expect(mockProps.onSearchChange).toHaveBeenCalledWith('blue');
  });
});
