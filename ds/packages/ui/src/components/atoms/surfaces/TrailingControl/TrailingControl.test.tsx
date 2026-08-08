import React from 'react';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TrailingControl } from './index';

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('TrailingControl', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock as unknown as typeof ResizeObserver);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders activation label when trailing is disabled', () => {
    render(<TrailingControl currentDistance={0} onUpdateDistance={vi.fn()} />);
    expect(screen.getByRole('button', { name: /activate trail/i })).toBeInTheDocument();
  });

  it('shows current trail value and updates on preset click', async () => {
    const user = userEvent.setup();
    const onUpdateDistance = vi.fn().mockResolvedValue(undefined);

    render(<TrailingControl currentDistance={1} onUpdateDistance={onUpdateDistance} />);
    await user.click(screen.getByRole('button', { name: /trail: 1%/i }));
    await user.click(screen.getByRole('button', { name: /sniper/i }));

    expect(onUpdateDistance).toHaveBeenCalledWith(0.2);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TrailingControl currentDistance={0.5} onUpdateDistance={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
