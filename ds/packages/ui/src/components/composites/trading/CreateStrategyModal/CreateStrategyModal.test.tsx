import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateStrategyModal } from './index';

describe('CreateStrategyModal Composite', () => {
  const exchanges = [{ id: 'binance', name: 'Binance', provider: 'binance' }];
  const assets = [
    { symbol: 'BTC/USDT', name: 'Bitcoin', category: 'crypto' as const },
    { symbol: 'ETH/USDT', name: 'Ethereum', category: 'crypto' as const },
  ];
  const cores = [
    {
      id: 'atr-breakout-v1',
      name: 'ATR Breakout Core',
      category: 'SCALPING',
      description: 'Momentum breakout engine',
      technical_summary: 'Uses volatility breakout and trend filter.',
      recommended_timeframe: '5m',
      parameters: [{ id: 'period', label: 'Period', default: 14, type: 'number', description: 'ATR period' }],
    },
  ];

  it('does not render when closed', () => {
    render(
      <CreateStrategyModal
        isOpen={false}
        onClose={vi.fn()}
        onCreate={vi.fn()}
        exchanges={exchanges}
        availableAssets={assets}
        availableCores={cores}
      />,
    );

    expect(screen.queryByText('Protocol_Selection')).not.toBeInTheDocument();
  });

  it('completes main flow and submits strategy payload', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();

    render(
      <CreateStrategyModal
        isOpen
        onClose={vi.fn()}
        onCreate={onCreate}
        exchanges={exchanges}
        availableAssets={assets}
        availableCores={cores}
      />,
    );

    await user.type(screen.getByLabelText('Strategy Friendly Name'), 'Alpha Bot');
    await user.click(screen.getByRole('button', { name: /Next_Phase/i }));

    await user.click(screen.getByRole('button', { name: /BTC\/USDT/i }));
    await user.click(screen.getByRole('button', { name: /Next_Phase/i }));
    await user.click(screen.getByRole('button', { name: /Next_Phase/i }));
    await user.click(screen.getByRole('button', { name: 'Commit_Strategy' }));

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        name: 'Alpha Bot',
        coreId: 'atr-breakout-v1',
        pairs: ['BTC/USDT'],
      }),
    );
  });
});
