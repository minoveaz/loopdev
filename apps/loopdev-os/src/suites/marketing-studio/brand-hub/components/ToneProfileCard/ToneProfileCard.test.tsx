/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ToneProfileCard } from './index';

describe('ToneProfileCard Molecule', () => {
  const mockProfile: any = {
    id: 'p1',
    name: 'Professional',
    description: 'Technical and clear',
    examples: {
      do: ['Positive example'],
      dont: ['Negative example']
    }
  };

  it('renders name and description correctly', () => {
    render(<ToneProfileCard profile={mockProfile} />);
    expect(screen.getByText('Professional')).toBeDefined();
    expect(screen.getByText('Technical and clear')).toBeDefined();
  });

  it('renders Do/Don\'t examples with icons', () => {
    render(<ToneProfileCard profile={mockProfile} />);
    expect(screen.getByText(/"Positive example"/i)).toBeDefined();
    expect(screen.getByText(/"Negative example"/i)).toBeDefined();
    // Material symbols check (text content)
    expect(screen.getByText(/check_circle/i)).toBeDefined();
    expect(screen.getByText(/cancel/i)).toBeDefined();
  });

  it('triggers onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ToneProfileCard profile={mockProfile} onClick={onClick} />);
    fireEvent.click(screen.getByText('Professional').closest('div')!);
    expect(onClick).toHaveBeenCalled();
  });
});
