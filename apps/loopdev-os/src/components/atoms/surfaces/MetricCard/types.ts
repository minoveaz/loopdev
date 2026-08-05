/**
 * @file types.ts  
 * @description Type definitions for MetricCard component
 */

export interface MetricCardProps {
  /** Metric label (e.g., "SMA50", "ATR", "Price") */
  label: string;
  /** Current metric value */
  value: number | string;
  /** Unit to display (e.g., "$", "%", "pips") */
  unit?: string;
  /** Secondary value or comparison */
  secondaryValue?: number | string;
  /** Direction indicator (up, down, neutral) */
  direction?: 'up' | 'down' | 'neutral';
  /** Status color (normal, warning, alert, success) */
  status?: 'normal' | 'warning' | 'alert' | 'success';
  /** Description or hint text */
  description?: string;
  /** Show loading skeleton */
  isLoading?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}
