import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BotCardIndustrial } from './index';

describe('BotCardIndustrial Composite', () => {
  const bot = {
    id: 'bot-1',
    name: 'Alpha Node',
    pair: 'BTC/USDT',
    status: 'active',
    currentAction: 'SCANNING',
    currentPrice: 64000,
    currentEntryPrice: 0,
    currentPnlPct: 0,
    currentPnlUsdt: 0,
    proximityPct: 20,
    strategyName: 'ATR Breakout',
    coreId: 'atr-breakout-v1',
    logicSnapshot: { bias: 'bullish', node_latency: 18 },
  } as any;

  it('renders identity and reactive price information', () => {
    render(<BotCardIndustrial bot={bot} />);

    expect(screen.getByText('BTC/USDT')).toBeInTheDocument();
    expect(screen.getByText('Alpha Node')).toBeInTheDocument();
    expect(screen.getByText('$64,000.00')).toBeInTheDocument();
  });

  it('supports core control callbacks', async () => {
    const user = userEvent.setup();
    const onToggleStatus = vi.fn();
    const onDelete = vi.fn();
    const onOpenDetails = vi.fn();

    render(
      <BotCardIndustrial
        bot={bot}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onOpenDetails={onOpenDetails}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Pause Bot/i }));
    expect(onToggleStatus).toHaveBeenCalledWith('bot-1', 'paused');

    await user.click(screen.getByTitle('STOP_BOT'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
