import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ActivityStream } from './index';

describe('ActivityStream Composite', () => {
  const events = [
    {
      id: 'e-1',
      time: '10:30',
      type: 'BUY' as const,
      pair: 'BTC/USDT',
      strategy: 'ATR',
      qty: '0.1',
      price: '64000',
      status: 'filled' as const,
    },
    {
      id: 'e-2',
      time: '10:32',
      type: 'SYSTEM' as const,
      status: 'success' as const,
      message: 'Sync completed',
    },
  ];

  it('renders events and contextual metadata', () => {
    render(<ActivityStream title="Execution_Log" events={events} isLive />);

    expect(screen.getByText('Execution_Log')).toBeInTheDocument();
    expect(screen.getByText('BUY')).toBeInTheDocument();
    expect(screen.getByText('BTC/USDT')).toBeInTheDocument();
    expect(screen.getByText(/Sync completed/i)).toBeInTheDocument();
  });

  it('renders empty message with no events', () => {
    render(<ActivityStream events={[]} />);
    expect(screen.getByText('// awaiting_system_events')).toBeInTheDocument();
  });

  it('has no accessibility violations in base render', async () => {
    const { container } = render(<ActivityStream events={events} title="Stream" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});