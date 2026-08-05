/**
 * @file types.ts
 * @description Type definitions for MetricGauge component
 */

export interface MetricGaugeProps {
  /** Current value (typically 0-100 for RSI) */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Label text displayed below gauge */
  label?: string;
  /** Unit text (e.g., "RSI", "%") */
  unit?: string;
  /** Threshold for "oversold" zone (e.g., 30 for RSI) */
  lowThreshold?: number;
  /** Threshold for "overbought" zone (e.g., 70 for RSI) */
  highThreshold?: number;
  /** Status indicator */
  status?: 'oversold' | 'neutral' | 'overbought';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** If true, disable animations */
  isStatic?: boolean;
  /** Additional CSS class */
  className?: string;
}
