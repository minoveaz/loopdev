/**
 * @file useBotMetricsDashboard.ts
 * @description Brain: Data orchestration for metrics dashboard
 * 
 * Handles:
 * - Metrics fetching and WebSocket connection
 * - Error handling and loading states
 * - Data transformation for display
 */

'use client';

import { useEffect } from 'react';
import { useStrategyMetrics } from '@/hooks/trading/useStrategyMetrics';
import { BotMetricsDashboardProps } from './types';
import { getMetricHealth } from '@/lib/metrics/metricsValidator';

export const useBotMetricsDashboard = (props: BotMetricsDashboardProps) => {
  const { botId, onMetricsUpdate } = props;

  // Fetch metrics
  const { metrics, loading, error, isConnected, refresh } = useStrategyMetrics(botId);

  // Health check
  const health = getMetricHealth(metrics);

  // Notify parent when metrics update
  useEffect(() => {
    if (metrics && onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  return {
    metrics,
    loading,
    error,
    isConnected,
    refresh,
    health,
  };
};
