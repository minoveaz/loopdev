import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { SystemNoticeRail } from './index';

describe('SystemNoticeRail Composite', () => {
  const notices = [
    {
      id: 'info-1',
      severity: 'info' as const,
      title: 'Info Notice',
      dismissible: true,
    },
    {
      id: 'danger-1',
      severity: 'danger' as const,
      title: 'Danger Notice',
      primaryAction: { label: 'Resolve', onClick: vi.fn() },
      dismissible: true,
    },
  ];

  it('prioritizes highest severity notice', () => {
    render(<SystemNoticeRail notices={notices} />);
    expect(screen.getByText('Danger Notice')).toBeInTheDocument();
  });

  it('supports dismiss and view-all callbacks', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onViewAll = vi.fn();

    render(<SystemNoticeRail notices={notices} onDismiss={onDismiss} onViewAll={onViewAll} />);

    await user.click(screen.getByRole('button', { name: '+1 More' }));
    expect(onViewAll).toHaveBeenCalledTimes(1);

    const closeButtons = screen.getAllByRole('button');
    await user.click(closeButtons[closeButtons.length - 1]);
    expect(onDismiss).toHaveBeenCalledWith('danger-1');
  });

  it('has no accessibility violations in base render', async () => {
    const { container } = render(<SystemNoticeRail notices={notices} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
