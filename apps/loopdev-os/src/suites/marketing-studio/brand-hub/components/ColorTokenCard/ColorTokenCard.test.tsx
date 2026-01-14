/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ColorTokenCard } from './index';

describe('ColorTokenCard Molecule', () => {
  const mockToken: any = {
    id: 't1',
    name: 'brand.primary',
    group: 'core',
    resolvesTo: { light: '#135bec', dark: '#135bec' }
  };

  // Mock clipboard
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn(),
    },
  });

  it('renders token info correctly', () => {
    render(<ColorTokenCard token={mockToken} theme="light" />);
    expect(screen.getByText('brand.primary')).toBeDefined();
    expect(screen.getByText('#135BEC')).toBeDefined();
  });

  it('resolves color based on theme', () => {
    const themedToken: any = {
      ...mockToken,
      resolvesTo: { light: '#ffffff', dark: '#000000' }
    };
    const { rerender } = render(<ColorTokenCard token={themedToken} theme="light" />);
    expect(screen.getByText('#FFFFFF')).toBeDefined();
    
    rerender(<ColorTokenCard token={themedToken} theme="dark" />);
    expect(screen.getByText('#000000')).toBeDefined();
  });

  it('copies hex to clipboard on click', () => {
    render(<ColorTokenCard token={mockToken} theme="light" />);
    const hexLabel = screen.getByText('#135BEC');
    fireEvent.click(hexLabel);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#135bec');
  });

  it('shows FAIL badge for low contrast', () => {
    const lowContrastToken: any = {
      ...mockToken,
      resolvesTo: { light: '#eeeeee', dark: '#eeeeee' } // Light gray on white
    };
    render(<ColorTokenCard token={lowContrastToken} theme="light" />);
    expect(screen.getByText('{ FAIL }')).toBeDefined();
  });
});
