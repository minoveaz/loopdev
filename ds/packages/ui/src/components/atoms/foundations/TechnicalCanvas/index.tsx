'use client';

import React, { useMemo } from 'react';
import { TechnicalCanvasProps } from './types';
import { cn } from '../../../../lib/utils';

export const TechnicalCanvas: React.FC<TechnicalCanvasProps> = ({
  variant = 'blueprint',
  intensity = 'low',
  size = 40,
  showSubgrid = true,
  className,
  ...props
}) => {
  const backgroundStyle = useMemo(() => {
    if (variant === 'clean') return {};

    const color = 'currentColor';
    if (variant === 'neural') {
      return {
        backgroundImage: `radial-gradient(${color} 1.5px, transparent 1px)`,
        backgroundSize: '40px 40px',
      };
    }

    const gridSize = variant === 'monochrome' ? 40 : size;
    const mainGrid = `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;
    const subGrid = showSubgrid && variant !== 'monochrome'
      ? `, linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`
      : '';

    return {
      backgroundImage: mainGrid + subGrid,
      backgroundSize: `${gridSize}px ${gridSize}px`,
    };
  }, [variant, size, showSubgrid]);

  const intensityClass = {
    low: 'opacity-[0.04]',
    medium: 'opacity-10',
    high: 'opacity-20',
  }[intensity];

  const variantClass = {
    blueprint: 'text-primary',
    neural: 'text-text-main',
    monochrome: 'text-text-muted',
    clean: 'text-text-muted',
  }[variant];

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none motion-safe:transition-opacity motion-safe:duration-1000 motion-reduce:transition-none',
        intensityClass,
        variantClass,
        className,
      )}
      aria-hidden="true"
      style={backgroundStyle}
      {...props}
    />
  );
};
