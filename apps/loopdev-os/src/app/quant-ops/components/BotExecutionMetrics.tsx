'use client';

import React from 'react';
import { LpdText, TechnicalSurface } from '@loopdev/ui';

interface BotExecutionMetricsProps {
  currentPrice: number;
  targetPrice: number;
  atr: number;
  recentVolatility?: number;
  botName: string;
}

/**
 * @component BotExecutionMetrics
 * @description Shows progress metrics for pending orders
 * Including distance to target, progress percentage, and time estimate
 */
export const BotExecutionMetrics: React.FC<BotExecutionMetricsProps> = ({
  currentPrice,
  targetPrice,
  atr,
  recentVolatility = 0.002, // Default 0.2% volatility per period
}) => {
  // Calculate distance metrics
  const distance = Math.abs(targetPrice - currentPrice);
  const distancePercentage = (distance / currentPrice) * 100;
  const direction = targetPrice > currentPrice ? 'UP ↑' : 'DOWN ↓';

  // Calculate progress (0-100%)
  // Assume ATR as reference for "normal" move
  const progressPercentage = Math.min((atr / distance) * 100, 100);

  // Estimate time to execution based on volatility
  // Using recent volatility rate, estimate candles/hours needed
  const estimatedCandles = Math.ceil(distance / (currentPrice * recentVolatility));
  const estimatedHours = Math.max(1, Math.floor(estimatedCandles / 12)); // Assuming 5min candles = ~12/hour
  const estimatedMinutes = Math.ceil((estimatedCandles % 12) * 5);

  // Color coding based on distance
  let distanceColor = 'text-emerald-500'; // Close
  let progressColor = 'bg-emerald-500';

  if (distancePercentage > 2) {
    distanceColor = 'text-amber-500'; // Medium
    progressColor = 'bg-amber-500';
  }
  if (distancePercentage > 5) {
    distanceColor = 'text-rose-500'; // Far
    progressColor = 'bg-rose-500';
  }

  return (
    <TechnicalSurface
      variant="surface"
      depth="flat"
      className="bg-background-subtle/40 flex flex-col gap-3 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest">
          Execution_Progress
        </LpdText>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${distanceColor}`}>{direction}</span>
        </div>
      </div>

      {/* Distance Display */}
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col gap-1">
          <LpdText size="xs" className="text-text-muted">
            Distance to Target
          </LpdText>
          <div className="flex items-baseline gap-2">
            <LpdText size="lg" weight="bold" className={distanceColor}>
              ${distance.toFixed(2)}
            </LpdText>
            <LpdText size="sm" weight="bold" className={`${distanceColor} opacity-60`}>
              ({distancePercentage.toFixed(2)}%)
            </LpdText>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <LpdText size="xs" className="text-text-muted">
            Current ATR
          </LpdText>
          <LpdText size="lg" weight="bold" className="text-text-main">
            ${atr.toFixed(2)}
          </LpdText>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <LpdText size="nano" className="text-text-muted">
            Progress
          </LpdText>
          <LpdText size="nano" weight="bold" className="text-text-main">
            {progressPercentage.toFixed(1)}%
          </LpdText>
        </div>
        <div className="bg-background-stronger h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Time Estimate */}
      <div className="bg-background-strongest/30 border-border-technical/20 flex items-center justify-between rounded-lg border p-2">
        <LpdText size="nano" className="text-text-muted">
          Est. Execution Time
        </LpdText>
        <div className="flex items-center gap-3">
          {estimatedHours > 0 && (
            <LpdText size="sm" weight="bold" className="text-text-main font-mono">
              {estimatedHours}h {estimatedMinutes}m
            </LpdText>
          )}
          {estimatedHours === 0 && (
            <LpdText size="sm" weight="bold" className="font-mono text-emerald-500">
              ~{estimatedMinutes}m
            </LpdText>
          )}
          <span className="text-text-muted text-xs">from now</span>
        </div>
      </div>

      {/* Price Range Info */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-background-strongest/20 flex flex-col gap-1 rounded p-2">
          <LpdText size="nano" className="text-text-muted">
            Current
          </LpdText>
          <LpdText size="sm" weight="bold" className="text-text-main">
            ${currentPrice.toFixed(2)}
          </LpdText>
        </div>
        <div className="bg-background-strongest/20 flex flex-col gap-1 rounded p-2">
          <LpdText size="nano" className="text-text-muted">
            Target
          </LpdText>
          <LpdText size="sm" weight="bold" className={distanceColor}>
            ${targetPrice.toFixed(2)}
          </LpdText>
        </div>
      </div>
    </TechnicalSurface>
  );
};
