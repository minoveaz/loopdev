'use client';

import React from 'react';
import { SystemStatusProps } from './types';
import { useSystemStatus } from './useSystemStatus';

/**
 * @component SystemStatus
 * @description Átomo oficial para mostrar la salud del sistema y el contexto técnico.
 * @category Primitives
 * @phase 1
 */
export const SystemStatus: React.FC<SystemStatusProps> = (props) => {
  const { currentConfig, containerClasses, formattedId, label } = useSystemStatus(props);

  return (
    <div className={containerClasses} role="status">
      {/* Indicador de Salud (Punto de Pulso) */}
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${currentConfig.dot}`} />
        <span className={`uppercase font-bold tracking-tight ${currentConfig.text}`}>
          {currentConfig.label}
        </span>
      </div>

      {/* Identificador Técnico (Sintaxis de Brackets) */}
      {formattedId && (
        <div className="text-slate-500 dark:text-text-muted border-l border-black/5 dark:border-white/10 pl-4">
          <span className="mr-1">{label}:</span>
          <span className="text-energy-yellow font-bold">{`{`}</span>
          <span className="mx-0.5">{formattedId}</span>
          <span className="text-energy-yellow font-bold">{`}`}</span>
        </div>
      )}
    </div>
  );
};
