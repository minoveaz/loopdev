import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { PlatformContextPanel } from './index';

const notifications = [
  {
    id: 'notification-1',
    title: 'Build completed',
    description: 'Your build is ready.',
    timestamp: '2m ago',
    type: 'success' as const,
    read: true,
  },
];

describe('PlatformContextPanel Composite', () => {
  it.each([
    ['notifications', 'Notifications'],
    ['assistant', 'AI Assistant'],
    ['help', 'Help & Support'],
    ['profile', 'Profile'],
  ] as const)('renders the %s mode with its accessible label', (mode, label) => {
    render(<PlatformContextPanel mode={mode} onClose={vi.fn()} notifications={notifications} />);

    expect(screen.getByRole('complementary', { name: label })).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('keeps the shell surface and technical boundary tokens', () => {
    render(<PlatformContextPanel mode="help" onClose={vi.fn()} />);

    expect(screen.getByRole('complementary')).toHaveClass('bg-shell-canvas', 'border-border-technical');
  });

  it('exposes an accessible close action', () => {
    const onClose = vi.fn();
    render(<PlatformContextPanel mode="help" onClose={onClose} />);

    expect(screen.getByRole('button', { name: 'Close context panel' })).toBeInTheDocument();
  });

  it('keeps notification actions as sibling buttons instead of nesting them', () => {
    render(
      <PlatformContextPanel
        mode="notifications"
        onClose={vi.fn()}
        notifications={notifications}
        onMarkAsRead={vi.fn()}
        onRemoveNotification={vi.fn()}
      />,
    );

    const notificationButton = screen.getByText('Build completed').closest('button');
    const removeButton = screen.getByRole('button', { name: 'Remove Build completed' });

    expect(notificationButton).not.toBeNull();
    expect(notificationButton.querySelector('button')).toBeNull();
    expect(notificationButton.parentElement).toContainElement(removeButton);
  });

  it('has no accessibility violations in each panel mode', async () => {
    for (const mode of ['notifications', 'assistant', 'help', 'profile'] as const) {
      const { container, unmount } = render(
        <PlatformContextPanel mode={mode} onClose={vi.fn()} notifications={notifications} />,
      );

      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });

  it('keeps profile content inside the shared panel boundary', () => {
    render(
      <PlatformContextPanel mode="profile" onClose={vi.fn()}>
        <div>Shared profile content</div>
      </PlatformContextPanel>,
    );

    expect(screen.getByRole('complementary', { name: 'Profile' })).toContainElement(
      screen.getByText('Shared profile content'),
    );
  });
});