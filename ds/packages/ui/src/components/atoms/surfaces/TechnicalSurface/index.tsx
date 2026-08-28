'use client';

import React from 'react';
import { TechnicalSurfaceProps } from './types';
import { useTechnicalSurface } from './useTechnicalSurface';
import { TechnicalCanvas } from '../../foundations/TechnicalCanvas';

/**
 * @component TechnicalSurface
 * @description Átomo oficial que implementa la "piel" técnica de LoopDev.
 * Gestiona fondos, bordes y profundidades de forma estandarizada.
 * @category Foundations
 * @phase 1
 */
export const TechnicalSurface: React.FC<TechnicalSurfaceProps & { withHoverAura?: boolean }> = (props) => {
  const {
    children,
    withGrid = false,
    withHoverAura = false,
    variant = 'surface',
    depth = 'flat',
    radius = 'xl',
    border = 'subtle',
    borderWidth = 'thin',
    interaction,
    overflow = 'hidden',
    className: _className,
    style: _style,
    ...domProps
  } = props;
  const { surfaceClasses, handleOnClick } = useTechnicalSurface(props);

  return (
    <div
      {...domProps}
      className={surfaceClasses}
      onClick={handleOnClick}
      data-surface-variant={variant}
      data-surface-depth={depth}
      data-surface-radius={radius}
      data-surface-border={border}
      data-surface-border-width={borderWidth}
      data-surface-overflow={overflow}
      data-surface-interaction={interaction ?? (props.onClick ? 'interactive' : 'static')}
    >
      {/* 1. Blueprint Grid Texture */}
      {withGrid && <TechnicalCanvas size={20} showSubgrid={false} intensity="low" />}

      {/* 2. Interactive Aura Effect */}
      {withHoverAura && (
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}

      {/* 3. Content Layer */}
      <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-col max-md:h-full">
        {children}
      </div>
    </div>
  );
};
