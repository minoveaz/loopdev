import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterDropdown } from './index';

describe('FilterDropdown', () => {
  const options = ['Alpha', 'Beta', 'Gamma'];

  it('renders label and current selection count', () => {
    render(
      <FilterDropdown
        icon="filter_alt"
        label="Strategies"
        options={options}
        selected={['Alpha', 'Gamma']}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByText('Strategies')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('opens options panel and toggles an item', () => {
    const onToggle = vi.fn();

    render(
      <FilterDropdown
        icon="filter_alt"
        label="Strategies"
        options={options}
        selected={[]}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(screen.getByText('Strategies'));
    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }));

    expect(onToggle).toHaveBeenCalledWith('Alpha');
  });
});
