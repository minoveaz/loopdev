import React from 'react';
import { cn } from '../../../helpers/cn';

export interface TechnicalBackgroundProps {
  className?: string;
  gridSize?: number;
  gridOpacity?: number;
  gridColor?: string;
  showMesh?: boolean;
}

/**
 * Snippet: surfaces/TechnicalBackground
 * Full technical background with 40px square grid and corner mesh gradients.
 * Replicates the designer's "Architect" aesthetic.
 */
export const TechnicalBackground: React.FC<TechnicalBackgroundProps> = ({ 
  className = '',
  gridSize = 40,
  gridOpacity = 0.1,
  gridColor = '#2d3442',
  showMesh = true
}) => {
  const gridStyle = {
    backgroundSize: `${gridSize}px ${gridSize}px`,
    backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px),
                      linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
    opacity: gridOpacity
  };

  const meshStyle = {
    backgroundImage: `radial-gradient(at 0% 0%, rgba(19, 91, 236, 0.15) 0px, transparent 50%), 
                      radial-gradient(at 100% 100%, rgba(255, 208, 37, 0.08) 0px, transparent 50%)`,
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none z-0 overflow-hidden", className)}>
      {/* Mesh Gradients */}
      {showMesh && (
        <div className="absolute inset-0 opacity-60" style={meshStyle} />
      )}
      
      {/* Square Grid */}
      <div 
        className="absolute inset-0" 
        style={gridStyle}
      />
      
      {/* Subtle vignettes or extra depth if needed */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(19,91,236,0.02)]" />
    </div>
  );
};
