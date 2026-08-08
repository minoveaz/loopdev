import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PositionsDataTable } from './index';

describe('PositionsDataTable Composite', () => {
  const positions = [
    {
      id: 'p-1',
      pair: 'BTC/USDT',
      side: 'LONG' as const,
      strategy: 'ATR Breakout',
      entryPrice: '62000',
      currentPrice: '64000',
      quantity: '0.5',
      valueUsdt: '32000',
      pnlPct: 3.2,
      pnlUsdt: 1024,
      status: 'healthy' as const,
    },
  ];

  it('renders table rows and values', () => {
    render(<PositionsDataTable data={positions} />);

    expect(screen.getByText('BTC/USDT')).toBeInTheDocument();
    expect(screen.getByText('ATR Breakout')).toBeInTheDocument();
    expect(screen.getByText('3.2%')).toBeInTheDocument();
  });

  it('triggers row actions', async () => {
    const user = userEvent.setup();
    const onViewDetail = vi.fn();
    const onClosePosition = vi.fn();

    render(
      <PositionsDataTable
        data={positions}
        onViewDetail={onViewDetail}
        onClosePosition={onClosePosition}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClosePosition).toHaveBeenCalledWith('p-1');

    const iconButtons = screen.getAllByRole('button');
    await user.click(iconButtons[0]);
    expect(onViewDetail).toHaveBeenCalledWith('p-1');
  });

  it('has no accessibility violations in base render', async () => {
    const { container } = render(<PositionsDataTable data={positions} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
