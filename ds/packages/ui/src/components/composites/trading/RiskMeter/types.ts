import { ReactNode } from 'react';

/**
 * @interface RiskMeterProps
 * @description Contract for industrial risk and exposure visualization.
 */
export interface RiskMeterProps {
  /** The current value (e.g. 4200) */
  value: number;
  /** The maximum allowed value (e.g. 10000) */
  maxValue: number;
  /** Label for the current value (e.g. "$4,200") */
  valueLabel?: string;
  /** Label for the max value (e.g. "/ $10,000") */
  maxLabel?: string;
  /** Title for the meter context (e.g. "Exposure_Limit") */
  title: string;
  /** Status subtitle or secondary info */
  subtitle?: string;
  /** Whether to show glow effects (Energy mode) */
  withGlow?: boolean;
  /** Additional CSS classes */
  className?: string;
}
