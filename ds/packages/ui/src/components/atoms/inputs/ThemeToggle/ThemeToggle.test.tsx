import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ThemeToggle } from './index';

describe('ThemeToggle', () => {
  it('renders control button with toggle label', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Toggle Theme' })).toBeInTheDocument();
  });

  it('toggles dark class and persists mode in localStorage', () => {
    localStorage.removeItem('lpd-theme');
    document.documentElement.removeAttribute('class');

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Theme' }));

    expect(document.documentElement.getAttribute('class')?.split(/\s+/)).toContain('dark');
    expect(localStorage.getItem('lpd-theme')).toBe('dark');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ThemeToggle />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
