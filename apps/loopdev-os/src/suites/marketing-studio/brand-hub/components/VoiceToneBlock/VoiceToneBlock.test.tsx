/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { VoiceToneBlock } from './index';

describe('VoiceToneBlock Composite', () => {
  const mockProfiles: any = [
    { id: '1', name: 'Professional', description: 'D1', examples: { do: [], dont: [] } },
    { id: '2', name: 'Witty', description: 'D2', examples: { do: [], dont: [] } }
  ];

  it('renders all profiles in a grid', () => {
    render(<VoiceToneBlock profiles={mockProfiles} />);
    expect(screen.getByText('Professional')).toBeDefined();
    expect(screen.getByText('Witty')).toBeDefined();
  });

  it('shows skeletons when isLoading is true', () => {
    const { container } = render(<VoiceToneBlock profiles={[]} isLoading={true} />);
    // Skeletons in VoiceToneBlock are divs with h-64
    const skeletons = container.querySelectorAll('.h-64');
    expect(skeletons.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onProfileClick when a card is clicked', () => {
    const onClick = vi.fn();
    render(<VoiceToneBlock profiles={mockProfiles} onProfileClick={onClick} />);
    fireEvent.click(screen.getByText('Professional').closest('div')!);
    expect(onClick).toHaveBeenCalledWith(mockProfiles[0]);
  });
});
