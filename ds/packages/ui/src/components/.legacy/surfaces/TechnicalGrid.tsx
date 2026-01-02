import React from 'react';
import { cn } from '../../../helpers/cn';

export interface TechnicalGridProps {
  size?: number;
  thickness?: number;
  opacity?: number;
  color?: string;
  className?: string;
  variant?: 'grid' | 'dots' | 'blueprint';
}

/**
 * @atom TechnicalGrid
 * @description Generative background pattern for engineering and design workspaces.
 * Replicates and evolves the grid found in the designer's Overview page.
 */
export const TechnicalGrid: React.FC<TechnicalGridProps> = ({
  size = 40,
  thickness = 1,
  opacity,
  color,
  className,
  variant = 'grid'
}) => {
  const finalColor = color || 'rgb(var(--lpd-grid-color))';
  const finalOpacity = opacity !== undefined ? opacity : 'var(--lpd-grid-opacity)';

  const gridStyle = variant === 'grid' ? {
    backgroundImage: `
      linear-gradient(${finalColor} ${thickness}px, transparent ${thickness}px),
      linear-gradient(90deg, ${finalColor} ${thickness}px, transparent ${thickness}px)
    `,
    backgroundSize: `${size}px ${size}px`,
    opacity: finalOpacity
  } : variant === 'dots' ? {
    backgroundImage: `radial-gradient(${finalColor} ${thickness}px, transparent 0)`,
    backgroundSize: `${size}px ${size}px`,
    opacity: finalOpacity
  } : {
    // Variant Blueprint: Major and Minor lines
    backgroundImage: `
      linear-gradient(${finalColor} ${thickness}px, transparent ${thickness}px),
      linear-gradient(90deg, ${finalColor} ${thickness}px, transparent ${thickness}px),
      linear-gradient(${finalColor} ${thickness / 2}px, transparent ${thickness / 2}px),
      linear-gradient(90deg, ${finalColor} ${thickness / 2}px, transparent ${thickness / 2}px)
    `,
    backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size / 4}px ${size / 4}px, ${size / 4}px ${size / 4}px`,
    opacity: finalOpacity
  };

  return (
    <div 
      className={cn("absolute inset-0 pointer-events-none select-none z-0", className)}
      style={gridStyle}
      aria-hidden="true"
    />
  );
};
