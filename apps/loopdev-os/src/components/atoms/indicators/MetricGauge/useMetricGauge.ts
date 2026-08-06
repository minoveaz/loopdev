/**
 * @file useMetricGauge.ts
 * @description Brain: Logic for gauge visualization
 * 
 * Calculates:
 * - Gauge arc position (0-360 degrees)
 * - Color based on zone (oversold/neutral/overbought)
 * - Animation state
 */

'use client';

import { useMemo } from 'react';
import { MetricGaugeProps } from './types';

export const useMetricGauge = (props: MetricGaugeProps) => {
  const {
    value,
    min = 0,
    max = 100,
    lowThreshold = 30,
    highThreshold = 70,
    status,
    size = 'md',
    isStatic = false,
    className = '',
  } = props;

  // Validate value is within bounds
  const normalizedValue = Math.max(min, Math.min(max, isNaN(value) ? 0 : value));

  // Calculate percentage (0 to 1)
  const percentage = (normalizedValue - min) / (max - min);

  // Calculate arc rotation (0-360 degrees, starting from top-left)
  // 0% = 225° (bottom-left), 100% = -45° (bottom-right)
  const rotation = 225 + (percentage * 270);

  // Determine color based on status or threshold
  const getColor = useMemo(() => {
    if (status === 'oversold') return 'from-red-500 to-orange-500';
    if (status === 'overbought') return 'from-purple-500 to-red-500';
    return 'from-green-500 to-cyan-500'; // neutral
  }, [status]);

  // Size mapping
  const sizeMap: Record<string, { container: number; indicator: number; text: string }> = {
    sm: { container: 120, indicator: 110, text: 'text-xl' },
    md: { container: 160, indicator: 150, text: 'text-2xl' },
    lg: { container: 200, indicator: 190, text: 'text-4xl' },
  };

  const sizes = sizeMap[size];

  return {
    normalizedValue: Number(normalizedValue.toFixed(1)),
    percentage: Number((percentage * 100).toFixed(1)),
    rotation,
    color: getColor,
    sizes,
    isStatic,
    className,
  };
};
