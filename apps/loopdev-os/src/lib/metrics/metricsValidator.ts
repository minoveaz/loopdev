/**
 * @file metricsValidator.ts
 * @description Validate and sanitize metrics data from API
 *
 * Ensures data integrity without throwing errors
 * (graceful degradation via null coalescing)
 */

import { StrategyMetricsSnapshot } from '@/hooks/trading/useStrategyMetrics';

const isValidMetricsSnapshot = (data: unknown): data is StrategyMetricsSnapshot => {
  if (!data || typeof data !== 'object') return false;

  const snapshot = data as StrategyMetricsSnapshot;

  // Check required top-level fields
  if (!('current_price' in snapshot) || typeof snapshot.current_price !== 'number') {
    return false;
  }

  // Check RSI structure
  if (
    !snapshot.rsi ||
    typeof snapshot.rsi.value !== 'number' ||
    !['oversold', 'neutral', 'overbought'].includes(snapshot.rsi.status)
  ) {
    return false;
  }

  // Check SMA50 structure
  if (
    !snapshot.sma50 ||
    typeof snapshot.sma50.value !== 'number' ||
    !['above', 'below'].includes(snapshot.sma50.position)
  ) {
    return false;
  }

  // Check signals structure
  if (!snapshot.signals?.long_entry || !snapshot.signals?.short_entry) {
    return false;
  }

  // Check preview structure
  if (
    !snapshot.preview ||
    typeof snapshot.preview.entry_price !== 'number' ||
    typeof snapshot.preview.long_tp !== 'number'
  ) {
    return false;
  }

  // Check volatility structure
  if (
    !snapshot.volatility ||
    typeof snapshot.volatility.atr !== 'number' ||
    !['low', 'normal', 'high'].includes(snapshot.volatility.status)
  ) {
    return false;
  }

  return true;
};

/**
 * Validate individual fields and return sanitized versions
 */
const validateMetricValue = (
  value: unknown,
  type: 'number' | 'string' | 'boolean',
  defaultValue: unknown = null,
) => {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  switch (type) {
    case 'number':
      if (typeof value === 'number' && isFinite(value)) {
        return value;
      }
      return defaultValue;

    case 'string':
      if (typeof value === 'string') {
        return value.trim();
      }
      return defaultValue;

    case 'boolean':
      if (typeof value === 'boolean') {
        return value;
      }
      return defaultValue;

    default:
      return defaultValue;
  }
};

/**
 * Safe accessor for nested metrics
 */
const safeGetMetricValue = (
  snapshot: StrategyMetricsSnapshot | null,
  path: string,
  defaultValue: unknown = null,
) => {
  if (!snapshot) return defaultValue;

  const keys = path.split('.');
  let current: unknown = snapshot;

  for (const key of keys) {
    if (current == null) return defaultValue;
    if (typeof current !== 'object') return defaultValue;
    current = (current as Record<string, unknown>)[key];
  }

  return current ?? defaultValue;
};

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
