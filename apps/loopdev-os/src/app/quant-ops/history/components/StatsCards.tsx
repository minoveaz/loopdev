'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';
import type { OrderStats } from '@/types/orders';

interface StatsCardsProps {
  stats: OrderStats | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function StatsCards({ stats, isLoading, error }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-background-surface rounded-lg border border-border-technical/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-status-error/10 border border-status-error/30 rounded-lg p-4">
        <LpdText size="sm" className="text-red-500">
          Failed to load statistics
        </LpdText>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Orders',
      value: stats.total_orders,
      format: 'number',
    },
    {
      label: 'Total P&L',
      value: stats.total_pnl_usdt,
      format: 'currency',
      className: stats.total_pnl_usdt >= 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      label: 'Win Rate',
      value: stats.win_rate,
      format: 'percent',
      className: stats.win_rate >= 50 ? 'text-green-500' : 'text-red-500',
    },
    {
      label: 'Avg P&L %',
      value: stats.avg_pnl_pct,
      format: 'percent',
      className: stats.avg_pnl_pct >= 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-background-surface border border-border-technical/30 rounded-lg p-4 hover:border-border-technical/50 transition-colors"
        >
          <LpdText size="xs" className="text-text-muted uppercase tracking-wide mb-2">
            {item.label}
          </LpdText>
          <LpdText size="2xl" weight="bold" className={item.className || 'text-text-main'}>
            {item.format === 'currency' && '$'}
            {item.format === 'number' && item.value}
            {item.format === 'currency' && item.value.toFixed(2)}
            {item.format === 'percent' && item.value.toFixed(1)}%
          </LpdText>
        </div>
      ))}
    </div>
  );
}
