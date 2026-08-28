import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
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

    expect(screen.getByRole('button', { name: 'Strategies' })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('opens options panel and toggles an item', async () => {
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

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Strategies' }));
    const alpha = await screen.findByRole('menuitemcheckbox', { name: 'Alpha' });
    fireEvent.click(alpha);

    expect(onToggle).toHaveBeenCalledWith('Alpha');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Alpha' })).toBeInTheDocument();
  });

  it('can hide the selection count for single-property controls', () => {
    render(
      <FilterDropdown
        icon="sort"
        label="Name (A-Z)"
        options={['Name (A-Z)', 'Name (Z-A)']}
        selected={['Name (A-Z)']}
        showSelectionCount={false}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Name (A-Z)' })).toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('clears all selected values in multi-select mode', async () => {
    const onClear = vi.fn();
    render(
      <FilterDropdown
        icon="filter_alt"
        label="Strategies"
        options={options}
        selected={['Alpha', 'Gamma']}
        onToggle={vi.fn()}
        onClear={onClear}
      />,
    );

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Strategies' }));
    const clear = await screen.findByRole('menuitem', { name: 'Clear selection' });
    fireEvent.click(clear);

    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByRole('menuitem', { name: 'Clear selection' })).toBeInTheDocument();
  });

  it('exposes trigger state and closes with Escape', async () => {
    render(
      <FilterDropdown
        icon="filter_alt"
        label="Strategies"
        options={options}
        selected={[]}
        onToggle={vi.fn()}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Strategies' });
    fireEvent.pointerDown(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    expect(trigger).toHaveFocus();
  });

  it('distinguishes disabled and read-only interaction states', async () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <FilterDropdown
        icon="filter_alt"
        label="Strategies"
        options={options}
        selected={[]}
        onToggle={onToggle}
        disabled
      />,
    );

    expect(screen.getByRole('button', { name: 'Strategies' })).toBeDisabled();

    rerender(
      <FilterDropdown
        icon="filter_alt"
        label="Strategies"
        options={options}
        selected={[]}
        onToggle={onToggle}
        readOnly
      />,
    );

    const readOnlyTrigger = screen.getByRole('button', { name: 'Strategies' });
    fireEvent.pointerDown(readOnlyTrigger);
    const alpha = await screen.findByRole('menuitemcheckbox', { name: 'Alpha' });
    expect(alpha).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(alpha);
    expect(readOnlyTrigger).toHaveAttribute('aria-disabled', 'true');
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('has no accessibility violations when closed and open', async () => {
    const { container } = render(
      <FilterDropdown
        icon="filter_alt"
        label="Strategies"
        options={options}
        selected={['Alpha']}
        onToggle={vi.fn()}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Strategies' }));
    await waitFor(() =>
      expect(document.querySelector('[role="menuitemcheckbox"]')).toBeInTheDocument(),
    );
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
