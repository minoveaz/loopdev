/**
 * @file useMetricCard.ts
 * @description Brain: Logic for metric card display
 */

'use client';

import { useMemo } from 'react';
import { MetricCardProps } from './types';

export const useMetricCard = (props: MetricCardProps) => {
  const {
    status = 'normal',
    direction = 'neutral',
    isLoading = false,
    size = 'md',
    className = '',
  } = props;

  // Determine border and background colors based on status
  const statusColor = useMemo(() => {
    switch (status) {
      case 'warning':
        return {
          border: 'border-yellow-500 border-opacity-50',
          bg: 'bg-yellow-500 bg-opacity-5',
          text: 'text-yellow-600 dark:text-yellow-400',
        };
      case 'alert':
        return {
          border: 'border-red-500 border-opacity-50',
          bg: 'bg-red-500 bg-opacity-5',
          text: 'text-red-600 dark:text-red-400',
        };
      case 'success':
        return {
          border: 'border-green-500 border-opacity-50',
          bg: 'bg-green-500 bg-opacity-5',
          text: 'text-green-600 dark:text-green-400',
        };
      default:
        return {
          border: 'border-border-technical',
          bg: 'bg-surface-dark bg-opacity-50',
          text: 'text-primary',
        };
    }
  }, [status]);

  // Direction arrow
  const directionIcon = useMemo(() => {
    switch (direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  }, [direction]);

  // Size mapping
  const sizeMap = {
    sm: { padding: 'p-2', textValue: 'text-sm', textLabel: 'text-nano' },
    md: { padding: 'p-3', textValue: 'text-base', textLabel: 'text-micro' },
    lg: { padding: 'p-4', textValue: 'text-lg', textLabel: 'text-technical' },
  };

  const sizeClasses = sizeMap[size];

  return {
    statusColor,
    directionIcon,
    sizeClasses,
    isLoading,
    className,
  };
};
