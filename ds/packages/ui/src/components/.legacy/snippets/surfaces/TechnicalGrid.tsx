import React from 'react';
import { cn } from '../../../helpers/cn';

export interface TechnicalGridProps {
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
}

/**
 * Snippet: surfaces/TechnicalGrid
 * Technical square grid pattern (40px) as seen in the designer's mockups.
 * Line color #2d3442 with 0.1 opacity on f8f9fc background.
 */
export const TechnicalGrid: React.FC<TechnicalGridProps> = ({ 
  className = '',
  size = 40,
  opacity = 0.1,
  color = '#2d3442'
}) => {
  const gridPattern = {
    backgroundSize: `${size}px ${size}px`,
    backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px),
                      linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
    opacity: opacity
  };

  return (
    <div 
      className={cn("absolute inset-0 pointer-events-none z-0", className)} 
      style={gridPattern}
    />
  );
};