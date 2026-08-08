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
    <header className={containerClasses} style={style} role="banner" aria-hidden={isInert}>
      {/* Cápsula Izquierda: Orientación */}
      <div className="flex min-w-0 flex-1 items-center gap-2 pl-10 md:gap-4 md:pl-0">
        {leftSlot}
      </div>

      {/* Cápsula Central: Comando */}
      <div className="hidden min-w-0 flex-1 items-center justify-center px-4 md:flex">
        {centerSlot}
      </div>

      {/* Cápsula Derecha: Estado y Control */}
      <div className="flex min-w-0 shrink-0 items-center justify-end gap-1 md:flex-1 md:gap-2">
        {rightSlot}
      </div>
    </header>
  );
};
