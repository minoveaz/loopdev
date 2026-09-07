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
  const { label, value, unit = '', secondaryValue, description, isLoading = false } = props;

  const { statusColor, directionIcon, sizeClasses } = useMetricCard(props);

  if (isLoading) {
    return (
      <div
        className={`
          rounded-lg border backdrop-blur-sm
          ${statusColor.border} ${statusColor.bg}
          ${sizeClasses.padding}
          animate-pulse
        `}
      >
        <div className="bg-primary-light mb-2 h-4 w-1/3 rounded bg-opacity-20" />
        <div className="bg-primary-light h-6 w-2/3 rounded bg-opacity-20" />
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-lg border backdrop-blur-sm transition-colors duration-200
        ${statusColor.border} ${statusColor.bg}
        ${sizeClasses.padding}
        ${props.className ?? ''}
      `}
      role="status"
      aria-label={`${label}: ${value} ${unit}`}
    >
      {/* Header: Label + Direction */}
      <div className="mb-1 flex items-center justify-between">
        <p
          className={`${sizeClasses.textLabel} text-primary-light font-mono uppercase tracking-wider opacity-70`}
        >
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
        <p className={`${sizeClasses.textValue} text-primary font-mono font-bold`}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </p>
        {unit && <span className="text-nano text-primary-light opacity-70">{unit}</span>}
      </div>

      {/* Secondary value (if provided) */}
      {secondaryValue && (
        <p className={`${sizeClasses.textLabel} text-primary-light mt-1 opacity-60`}>
          {typeof secondaryValue === 'number' ? secondaryValue.toFixed(2) : secondaryValue}
        </p>
      )}

      {/* Description */}
      {description && <p className="text-nano text-primary-light mt-2 opacity-50">{description}</p>}
    </div>
  );
};
