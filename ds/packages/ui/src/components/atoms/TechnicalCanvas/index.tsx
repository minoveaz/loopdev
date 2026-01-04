'use client';

import React, { useMemo } from 'react';
import { TechnicalCanvasProps } from './types';
import { cn } from '../../../lib/utils';

export const TechnicalCanvas: React.FC<TechnicalCanvasProps> = ({
  variant = 'blueprint',
  intensity = 'low',
  size = 40,
  showSubgrid = true,
  className,
  ...props
}) => {
  
  const backgroundStyle = useMemo(() => {
    // Definición de opacidades industriales mejoradas para visibilidad
    const opacities = {
      low: 0.05,
      medium: 0.15,
      high: 0.25
    };
    
    const alpha = opacities[intensity];
    const color = `rgba(19, 91, 236, ${alpha})`; // Primary Blue
    
    if (variant === 'clean') return {};

    if (variant === 'neural') {
      return {
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: `24px 24px`
      };
    }

    // Blueprint Grid (Líneas)
    const mainGrid = `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;
    const subGrid = showSubgrid 
      ? `, linear-gradient(to right, ${color.replace(String(alpha), String(alpha * 0.4))} 1px, transparent 1px), linear-gradient(to bottom, ${color.replace(String(alpha), String(alpha * 0.4))} 1px, transparent 1px)`
      : '';

    return {
      backgroundImage: mainGrid + subGrid,
      backgroundSize: `${size}px ${size}px, ${size / 5}px ${size / 5}px`
    };
  }, [variant, intensity, size, showSubgrid]);

  return (
    <div 
      className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-1000 animate-in fade-in",
        className
      )}
      style={backgroundStyle}
      {...props}
    />
  );
};
