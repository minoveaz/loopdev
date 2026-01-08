'use client';

import React from 'react';
import { useSkeleton } from './useSkeleton';
import { SkeletonProps } from './types';

/**
 * @component Skeleton
 * @description Primitiva atómica para estados de carga estructural.
 * @category Feedback
 * @subcategory Primitives
 * @phase 2
 */
export const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { finalClassName, style, animation } = useSkeleton(props);

  return (
    <div 
      className={finalClassName} 
      style={style}
      aria-hidden="true"
      role="presentation" // Role para facilitar la búsqueda en tests sin semántica para lectores de pantalla
    >
      {/* Shimmer Overlay */}
      {animation === 'shimmer' && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
      )}
    </div>
  );
};

// Exportar Presets
export * from './components';