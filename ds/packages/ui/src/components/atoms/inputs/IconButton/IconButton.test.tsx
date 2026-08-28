import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { IconButton } from './index';

describe('IconButton', () => {
  it('renders as button with fallback aria label based on icon name', () => {
    render(<IconButton icon="settings" />);
    const button = screen.getByRole('button', { name: 'settings' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-control', 'icon-button');
    expect(button).toHaveAttribute('data-control-variant', 'neutral');
    expect(button).toHaveAttribute('data-control-size', 'md');
  });

  it('runs click action when enabled', () => {
    const onClick = vi.fn();
    render(<IconButton icon="settings" onClick={onClick} tooltip="Open settings" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['neutral', 'text-text-muted'],
    ['primary', 'text-[var(--comp-primary,#135bec)]'],
    ['danger', 'text-danger'],
    ['success', 'text-status-success'],
    ['ghost', 'text-text-muted'],
    ['energy', 'text-energy-yellow'],
  ] as const)('supports the %s variant', (variant, className) => {
    render(<IconButton icon="settings" variant={variant} />);
    expect(screen.getByRole('button')).toHaveClass(className);
  });

  it.each([
    ['sm', 'w-7', 'h-7'],
    ['md', 'w-8', 'h-8'],
    ['lg', 'w-9', 'h-9'],
  ] as const)('uses stable %s geometry', (size, widthClass, heightClass) => {
    render(<IconButton icon="settings" size={size} />);
    expect(screen.getByRole('button')).toHaveClass(widthClass, heightClass);
  });

  it('prefers explicit accessible copy over tooltip and icon fallback', () => {
    render(<IconButton icon="settings" tooltip="Tooltip" ariaLabel="Open settings" />);
    expect(screen.getByRole('button', { name: 'Open settings' })).toHaveAttribute('title', 'Tooltip');
  });

  it('prevents activation when explicitly disabled', () => {
    const onClick = vi.fn();
    render(<IconButton icon="settings" disabled onClick={onClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders custom content when provided', () => {
    render(
      <IconButton ariaLabel="Open help">
        <span data-testid="custom-icon">Help</span>
      </IconButton>,
    );

    const button = screen.getByRole('button', { name: 'Open help' });
    expect(button.querySelector('[data-testid="custom-icon"]')).not.toBeNull();
  });

  it('disables itself while loading and shows progress glyph', () => {
    render(<IconButton icon="settings" isLoading tooltip="Loading action" />);

    expect(screen.getByRole('button', { name: 'Loading action' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Loading action' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('progress_activity')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<IconButton icon="settings" tooltip="Settings" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
