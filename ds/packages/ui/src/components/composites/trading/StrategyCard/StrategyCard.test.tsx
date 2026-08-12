import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrategyCard } from './index';

describe('StrategyCard Composite', () => {
  const baseStrategy = {
    id: 'strat-1',
    name: 'ATR Breakout',
    coreId: 'atr-breakout-v1',
    exchangeId: 'binance',
    mode: 'paper',
    status: 'draft',
    pairs: ['BTC/USDT', 'ETH/USDT'],
    parameters: {},
    stopLoss: 2,
    takeProfit: 5,
  } as any;

  it('renders strategy metadata and performance', () => {
    render(
      <StrategyCard
        strategy={baseStrategy}
        performance={{ winRate: 61, totalReturn: 12.3, drawdown: 5.2, riskScore: 40 }}
      />,
    );

    expect(screen.getByText('ATR Breakout')).toBeInTheDocument();
    expect(screen.getByText(/Mode\s*\/\//i)).toBeInTheDocument();
    expect(screen.getByText('61%')).toBeInTheDocument();
    expect(screen.getByText('+12.3%')).toBeInTheDocument();
  });

  it('calls onActivate for draft strategy', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();

    render(<StrategyCard strategy={baseStrategy} onActivate={onActivate} />);

    await user.click(screen.getByRole('button', { name: 'Deploy_Active' }));
    expect(onActivate).toHaveBeenCalledWith('strat-1');
  });
});
