import { ReactNode } from 'react';

export type MetricTrend = 'up' | 'down' | 'neutral';

/**
 * @interface MetricCardProps
 * @description Industrial contract for high-density metric display.
 */
export interface MetricCardProps {
  /** The descriptive title of the metric */
  label: string;
  /** The main value to display (e.g., "$12,420.50") */
  value: string | number;
  /** Optional secondary info or percentage change (e.g., "+2.4%") */
  delta?: string | number;
  /** Visual direction of the delta */
  trend?: MetricTrend;
  /** Material symbol name for the metric icon */
  icon?: string;
  /** Color theme for the icon and value (e.g., 'text-emerald-500') */
  colorClassName?: string;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Optional footer or extra context */
  children?: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
}
