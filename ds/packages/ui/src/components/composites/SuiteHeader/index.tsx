'use client';

import React from 'react';
import { SuiteHeaderProps } from './types';
import { useSuiteHeader } from './useSuiteHeader';

/**
 * @component SuiteHeader
 * @description Chasis oficial para la cabecera global de las suites de LoopDev OS.
 * @category Composites
 * @phase 1
 */
export const SuiteHeader: React.FC<SuiteHeaderProps> = (props) => {
  const { leftSlot, centerSlot, rightSlot, isInert } = props;
  const { containerClasses, style } = useSuiteHeader(props);

  return (
    <header 
      className={containerClasses}
      style={style}
      role="banner"
      aria-hidden={isInert}
    >
      {/* Accesibilidad: Salto al contenido principal */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-[3000] shadow-2xl"
        aria-label="Skip to main content"
        title="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Cápsula Izquierda: Orientación */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {leftSlot}
      </div>

      {/* Cápsula Central: Comando */}
      <div className="flex-1 flex items-center justify-center min-w-0 px-4">
        {centerSlot}
      </div>

      {/* Cápsula Derecha: Estado y Control */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        {rightSlot}
      </div>
    </header>
  );
};
