import type { StrategyMetricsSnapshot } from '@/hooks/trading/useStrategyMetrics';

/**
 * @file types.ts
 * @description Type definitions for BotMetricsDashboard composite
 */

export interface BotMetricsDashboardProps {
  /** Bot ID for fetching metrics */
  botId: string;
  /** Bot name for display */
  botName?: string;
  /** Show or hide extended metrics */
  showExtended?: boolean;
  /** Callback when metrics are updated */
  onMetricsUpdate?: (metrics: StrategyMetricsSnapshot) => void;
  /** Additional CSS class */
  className?: string;
}
