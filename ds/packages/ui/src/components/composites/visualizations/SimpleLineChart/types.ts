import { ReactNode } from 'react';

/**
 * @interface SimpleLineChartProps
 * @description Contract for high-performance SVG line charts.
 */
export interface SimpleLineChartProps {
  /** Array of data points from 0 to 100 or actual values */
  data: number[];
  /** Primary color for the line and gradient (e.g., 'var(--lpd-color-brand-primary)') */
  color?: string;
  /** Whether to show the background grid */
  withGrid?: boolean;
  /** Whether to show the pulsing live point at the end */
  isLive?: boolean;
  /** Optional labels to overlay on the chart */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Viewbox height for SVG resolution */
  viewBoxHeight?: number;
}
