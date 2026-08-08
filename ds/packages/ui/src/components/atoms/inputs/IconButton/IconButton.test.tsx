import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { IconButton } from './index';

describe('IconButton', () => {
  it('renders as button with fallback aria label based on icon name', () => {
    render(<IconButton icon="settings" />);
    expect(screen.getByRole('button', { name: 'settings' })).toBeInTheDocument();
  });

  it('runs click action when enabled', () => {
    const onClick = vi.fn();
    render(<IconButton icon="settings" onClick={onClick} tooltip="Open settings" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables itself while loading and shows progress glyph', () => {
    render(<IconButton icon="settings" isLoading tooltip="Loading action" />);

    expect(screen.getByRole('button', { name: 'Loading action' })).toBeDisabled();
    expect(screen.getByText('progress_activity')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<IconButton icon="settings" tooltip="Settings" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
