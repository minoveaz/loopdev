import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { NextEvalTimer } from './index';

describe('NextEvalTimer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders default countdown when no lastUpdatedAt is provided', () => {
    render(<NextEvalTimer intervalSeconds={30} />);
    expect(screen.getByText('00:30')).toBeInTheDocument();
  });

  it('syncs remaining time and updates each second', async () => {
    const now = new Date('2026-08-08T10:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(now);

    render(
      <NextEvalTimer
        intervalSeconds={30}
        lastUpdatedAt={new Date(now.getTime() - 26_000).toISOString()}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByText('00:04')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(screen.getByText('00:03')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<NextEvalTimer intervalSeconds={15} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
