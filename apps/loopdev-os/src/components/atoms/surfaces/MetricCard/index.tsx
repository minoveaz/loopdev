/**
 * @file index.tsx
 * @description Body: MetricCard visual component
 * 
 * Technical surface container for displaying metrics with:
 * - Status-aware colors and borders
 * - Direction indicators
 * - Loading state skeleton
 * - Responsive sizing
 */

'use client';

import React from 'react';
import { useMetricCard } from './useMetricCard';
import { MetricCardProps } from './types';

export const MetricCard: React.FC<MetricCardProps> = (props) => {
  const {
    label,
    value,
    unit = '',
    secondaryValue,
    description,
    isLoading = false,
  } = props;

  const {
    statusColor,
    directionIcon,
    sizeClasses,
  } = useMetricCard(props);

  if (isLoading) {
    return (
      <div
        className={`
          border rounded-lg backdrop-blur-sm
          ${statusColor.border} ${statusColor.bg}
          ${sizeClasses.padding}
          animate-pulse
        `}
      >
        <div className="h-4 bg-primary-light bg-opacity-20 rounded w-1/3 mb-2" />
        <div className="h-6 bg-primary-light bg-opacity-20 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div
      className={`
        border rounded-lg backdrop-blur-sm transition-colors duration-200
        ${statusColor.border} ${statusColor.bg}
        ${sizeClasses.padding}
      `}
      role="status"
      aria-label={`${label}: ${value} ${unit}`}
    >
      {/* Header: Label + Direction */}
      <div className="flex items-center justify-between mb-1">
        <p className={`${sizeClasses.textLabel} font-mono uppercase tracking-wider text-primary-light opacity-70`}>
          {label}
        </p>
        {props.direction && props.direction !== 'neutral' && (
          <span
            className={`text-sm font-bold ${
              props.direction === 'up'
                ? 'text-green-500'
                : props.direction === 'down'
                ? 'text-red-500'
                : 'text-primary-light'
            }`}
          >
            {directionIcon}
          </span>
        )}
      </div>

      {/* Main value */}
      <div className="flex items-baseline gap-1">
        <p className={`${sizeClasses.textValue} font-mono font-bold text-primary`}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </p>
        {unit && (
          <span className="text-nano text-primary-light opacity-70">
            {unit}
          </span>
        )}
      </div>

      {/* Secondary value (if provided) */}
      {secondaryValue && (
        <p className={`${sizeClasses.textLabel} text-primary-light opacity-60 mt-1`}>
          {typeof secondaryValue === 'number'
            ? secondaryValue.toFixed(2)
            : secondaryValue}
        </p>
      )}

      {/* Description */}
      {description && (
        <p className="text-nano text-primary-light opacity-50 mt-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
