'use client';

import React from 'react';
import { TechnicalCanvas } from '../..';
import { BlueprintBackgroundProps } from './types';
import { useBlueprintBackground } from './useBlueprintBackground';

/**
 * @component BlueprintBackground
 * @description Átomo de utilidad que encapsula la atmósfera visual técnica de LoopDev.
 * @category Foundations
 * @phase 1
 */
export const BlueprintBackground: React.FC<BlueprintBackgroundProps> = (props) => {
  const { variant, withScanline, containerClasses, scanlineClasses } = useBlueprintBackground(props);

  return (
    <div className={containerClasses} aria-hidden="true">
      {/* 1. Rejilla Técnica (Blueprint o Neural) */}
      <TechnicalCanvas 
        variant={variant} 
        intensity="low" // La opacidad real la controla el contenedor padre
      />

      {/* 2. Capa de Efectos Ambientales (Scanline) */}
      {withScanline && (
        <div className={scanlineClasses} />
      )}

      {/* 3. Gradiente de Profundidad (Opcional/Ambiental) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-black/20" />
    </div>
  );
};
