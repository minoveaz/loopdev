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
    const opacities = {
      low: 0.04, // Sincronizado con mockv2
      medium: 0.1,
      high: 0.2
    };
    
    const alpha = opacities[intensity];
    
    // Color dinámico: Azul industrial o Monocromo técnico (vía CSS var)
    const color = variant === 'monochrome' 
      ? `var(--grid-line-color)` 
      : `rgba(19, 91, 236, ${alpha})`;
    
    if (variant === 'clean') return {};

    if (variant === 'neural') {
      return {
        backgroundImage: `radial-gradient(${color} 1.5px, transparent 1px)`, // Puntos ligeramente más definidos
        backgroundSize: `40px 40px`
      };
    }

    // Blueprint Grid (Líneas) - 40px exactos como en el Lab
    const gridSize = variant === 'monochrome' ? 40 : size;
    // Usamos 0.5px de grosor para que sea ultra-fina pero visible
    const mainGrid = `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;
    const subGrid = (showSubgrid && variant !== 'monochrome') // En monocromo el Lab usa grilla simple, sin subgrilla
      ? `, linear-gradient(to right, ${color.replace(String(alpha), String(alpha * 0.3))} 1px, transparent 1px), linear-gradient(to bottom, ${color.replace(String(alpha), String(alpha * 0.3))} 1px, transparent 1px)`
      : '';

    return {
      backgroundImage: mainGrid + subGrid,
      backgroundSize: `${gridSize}px ${gridSize}px`
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
