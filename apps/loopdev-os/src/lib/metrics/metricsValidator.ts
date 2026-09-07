/**
 * @file metricsValidator.ts
 * @description Validate and sanitize metrics data from API
 *
 * Ensures data integrity without throwing errors
 * (graceful degradation via null coalescing)
 */

import { StrategyMetricsSnapshot } from '@/hooks/trading/useStrategyMetrics';

export const getMetricHealth = (
  snapshot: StrategyMetricsSnapshot | null,
): {
  isHealthy: boolean;
  warnings: string[];
} => {
  const warnings: string[] = [];

  if (!snapshot) {
    return { isHealthy: false, warnings: ['No metrics available'] };
  }

  // Check if data is stale (> 10 seconds old)
  const lastUpdateMs = new Date(snapshot.last_updated).getTime();
  const nowMs = new Date().getTime();
  const ageSeconds = (nowMs - lastUpdateMs) / 1000;

  if (ageSeconds > 10) {
    warnings.push(`Data is ${Math.round(ageSeconds)}s old`);
  }

  // Check for invalid prices
  if (snapshot.current_price <= 0) {
    warnings.push('Invalid price data');
  }

  // Check for extreme volatility
  if (snapshot.volatility.atr_pct > 5) {
    warnings.push('Extreme volatility detected');
  }

  return {
    isHealthy: warnings.length === 0,
    warnings,
  };
};
