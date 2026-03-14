'use client';

import React from 'react';
import { TechnicalSurfaceProps } from './types';
import { useTechnicalSurface } from './useTechnicalSurface';

/**
 * @component TechnicalSurface
 * @description Átomo oficial que implementa la "piel" técnica de LoopDev.
 * Gestiona fondos, bordes y profundidades de forma estandarizada.
 * @category Foundations
 * @phase 1
 */
export const TechnicalSurface: React.FC<TechnicalSurfaceProps & { withHoverAura?: boolean }> = (props) => {
  const { children, withGrid = false, withHoverAura = false } = props;
  const { surfaceClasses, handleOnClick } = useTechnicalSurface(props);

  return (
    <div className={surfaceClasses} onClick={handleOnClick}>
      {/* 1. Blueprint Grid Texture */}
      {withGrid && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.03] text-slate-900 dark:text-white"
          style={{ 
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* 2. Interactive Aura Effect */}
      {withHoverAura && (
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}

      {/* 3. Content Layer */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};
