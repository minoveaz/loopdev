/**
 * @file index.tsx
 * @description Body: BotMetricsDashboard composite component
 *
 * Page-level component that displays:
 * - RSI gauge (MetricGauge)
 * - SMA50, ATR, Current Price metrics (MetricCard)
 * - Entry signal analysis
 * - Position preview (TP/SL)
 * - Real-time connection status
 */

'use client';

import React from 'react';
import { Button, Heading } from '@loopdev/ui';

function PositionPreview({
  side,
  entry,
  takeProfit,
  stopLoss,
}: {
  side: 'LONG' | 'SHORT';
  entry: number;
  takeProfit: number;
  stopLoss: number;
}) {
  return (
    <div className="space-y-2">
      <p className="text-micro text-primary-light">{side} Position</p>
      <div className="bg-surface-elevated rounded p-2 space-y-1 text-nano">
        <div className="flex justify-between">
          <span className="text-primary-light">Entry:</span>
          <span className="font-mono text-primary">${entry.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-500">
          <span>Take Profit:</span>
          <span className="font-mono">${takeProfit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Stop Loss:</span>
          <span className="font-mono">${stopLoss.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
import { useBotMetricsDashboard } from './useBotMetricsDashboard';
import { MetricGauge } from '@/components/atoms/indicators/MetricGauge';
import { MetricCard } from '@/components/atoms/surfaces/MetricCard';
import { SignalCard } from './SignalCard';
import { BotMetricsDashboardProps } from './types';
import {
  formatPrice,
  formatPercentage,
  formatATR,
  formatTimeAgo,
} from '@/lib/metrics/metricsFormatter';

export const BotMetricsDashboard: React.FC<BotMetricsDashboardProps> = (props) => {
  const { botId, botName = 'Trading Bot', showExtended = false, className = '' } = props;

  const { metrics, loading, error, isConnected, refresh, health } = useBotMetricsDashboard(props);

  // Loading state
  if (loading && !metrics) {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        <div className="h-64 bg-surface-dark rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-surface-dark rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !metrics) {
    return (
      <div
        className={`border border-red-500 border-opacity-50 bg-red-500 bg-opacity-5 rounded-lg p-4 ${className}`}
      >
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        <Button variant="ghost" size="sm" type="button"
          onClick={refresh}
          className="mt-2 text-nano text-red-600 dark:text-red-400 underline hover:opacity-70"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`text-center text-primary-light opacity-50 py-8 ${className}`}>
        <p>No metrics available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading as="h2" size="lg" weight="bold" className="text-primary">{botName}</Heading>
          <p className="text-nano text-primary-light opacity-70">
            Updated {formatTimeAgo(metrics.last_updated)}
            {isConnected ? ' • Live' : ' • Polling'}
          </p>
        </div>

        {/* Connection status indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`}
          />
          <span className="text-nano text-primary-light">{isConnected ? 'Live' : 'Polling'}</span>
        </div>
      </div>

      {/* Health warnings */}
      {health.warnings.length > 0 && (
        <div className="bg-yellow-500 bg-opacity-5 border border-yellow-500 border-opacity-50 rounded-lg p-3">
          <ul className="space-y-1">
            {health.warnings.map((warning, idx) => (
              <li key={idx} className="text-nano text-yellow-600 dark:text-yellow-400">
                ⚠ {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main metrics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* RSI Gauge (full height) */}
        <div className="lg:col-span-1">
          <div className="border border-border-technical rounded-lg backdrop-blur-sm bg-surface-dark bg-opacity-50 p-4 h-full flex items-center justify-center">
            <MetricGauge
              value={metrics.rsi.value}
              label="RSI"
              unit={`/${metrics.rsi.overbought_threshold}`}
              lowThreshold={metrics.rsi.oversold_threshold}
              highThreshold={metrics.rsi.overbought_threshold}
              status={metrics.rsi.status}
              size="lg"
            />
          </div>
        </div>

        {/* Right column: Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Price + SMA50 */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Current Price"
              value={metrics.current_price}
              unit="$"
              status="normal"
            />

            <MetricCard
              label="SMA50"
              value={metrics.sma50.value}
              unit="$"
              secondaryValue={formatPercentage(metrics.sma50.distance_pct)}
              direction={metrics.sma50.position === 'above' ? 'up' : 'down'}
            />
          </div>

          {/* ATR + Volatility */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="ATR"
              value={formatATR(metrics.volatility.atr)}
              unit={`(${formatPercentage(metrics.volatility.atr_pct)})`}
              status={
                metrics.volatility.status === 'low'
                  ? 'warning'
                  : metrics.volatility.status === 'high'
                    ? 'alert'
                    : 'normal'
              }
            />

            <MetricCard
              label="Volatility"
              value={metrics.volatility.status.toUpperCase()}
              status={
                metrics.volatility.status === 'low'
                  ? 'warning'
                  : metrics.volatility.status === 'high'
                    ? 'alert'
                    : 'success'
              }
            />
          </div>
        </div>
      </div>

      {/* Signal Analysis Section */}
      <div className="border border-border-technical rounded-lg backdrop-blur-sm bg-surface-dark bg-opacity-50 p-4 space-y-3">
        <Heading as="h3" size="sm" weight="medium" className="text-technical text-primary">Entry Signals</Heading>

        <div className="grid grid-cols-2 gap-4">
          <SignalCard
            label="LONG"
            signal={metrics.signals.long_entry}
            readyColor="text-green-500"
            gradient="from-green-500 to-green-600"
          />
          <SignalCard
            label="SHORT"
            signal={metrics.signals.short_entry}
            readyColor="text-purple-500"
            gradient="from-purple-500 to-purple-600"
          />
        </div>
      </div>

      {/* Position Preview Section */}
      {showExtended && (
        <div className="border border-border-technical rounded-lg backdrop-blur-sm bg-surface-dark bg-opacity-50 p-4 space-y-3">
          <Heading as="h3" size="sm" weight="medium" className="text-technical text-primary">Position Preview</Heading>

          <div className="grid grid-cols-2 gap-4">
            <PositionPreview
              side="LONG"
              entry={metrics.preview.entry_price}
              takeProfit={metrics.preview.long_tp}
              stopLoss={metrics.preview.long_sl}
            />
            <PositionPreview
              side="SHORT"
              entry={metrics.preview.entry_price}
              takeProfit={metrics.preview.short_tp}
              stopLoss={metrics.preview.short_sl}
            />
          </div>
        </div>
      )}

      {/* Refresh button */}
      <Button
        onClick={refresh}
        className="text-nano text-primary-light hover:text-primary opacity-70 hover:opacity-100 transition-opacity"
      >
        ↻ Refresh Metrics
      </Button>
    </div>
  );
};
