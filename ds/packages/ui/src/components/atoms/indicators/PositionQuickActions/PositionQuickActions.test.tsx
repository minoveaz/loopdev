import React from 'react';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PositionQuickActions } from './index';

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('PositionQuickActions', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock as unknown as typeof ResizeObserver);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders all quick action controls', () => {
    render(<PositionQuickActions trailingDistance={0} />);

    expect(screen.getByRole('button', { name: /market exit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /move to be/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /activate trail/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tp now/i })).toBeInTheDocument();
  });

  it('executes actions and respects disabled break-even state', async () => {
    const user = userEvent.setup();
    const onMarketExit = vi.fn().mockResolvedValue(undefined);
    const onExecuteTP = vi.fn().mockResolvedValue(undefined);

    render(
      <PositionQuickActions
        onMarketExit={onMarketExit}
        onExecuteTP={onExecuteTP}
        canMoveToBE={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: /market exit/i }));
    await user.click(screen.getByRole('button', { name: /tp now/i }));

    expect(onMarketExit).toHaveBeenCalledTimes(1);
    expect(onExecuteTP).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /move to be/i })).toBeDisabled();
  });

  it('updates trailing distance using tactical presets', async () => {
    const user = userEvent.setup();
    const onUpdateTrail = vi.fn().mockResolvedValue(undefined);

    render(<PositionQuickActions trailingDistance={1} onUpdateTrail={onUpdateTrail} />);
    await user.click(screen.getByRole('button', { name: /trail: 1%/i }));
    await user.click(screen.getByRole('button', { name: /tight/i }));

    expect(onUpdateTrail).toHaveBeenCalledWith(0.5);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PositionQuickActions />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
