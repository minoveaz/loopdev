'use client';

import React from 'react';
import { StatusPulse } from '../..';
import { TechnicalTooltip } from '../..';
import { SystemStatusProps, SystemStatusState } from './types';
import { useSystemStatus } from './useSystemStatus';

/**
 * @component SystemStatus
 * @description Átomo oficial para mostrar la salud del sistema y el contexto técnico.
 * @category Primitives
 * @phase 1
 */
export const SystemStatus: React.FC<SystemStatusProps> = (props) => {
  const { currentConfig, containerClasses, formattedId, label, state } = useSystemStatus(props);

  // Mapeo de estado local a variante de StatusPulse
  const pulseVariant = state === 'operational' ? 'success' : 
                       state === 'degraded' ? 'energy' : 
                       state === 'outage' ? 'danger' : 'info';

  const telemetryInfo = `${currentConfig.label} · Region: US-EAST-1 · Sync: 2m ago`;

  return (
    <div className={containerClasses} role="status">
      {/* Indicador de Salud con Telemetría Enterprise */}
      <TechnicalTooltip content={telemetryInfo} side="top" sideOffset={12}>
        <div className="flex items-center gap-2 cursor-help">
          <StatusPulse variant={pulseVariant} size="sm" />
          <span className={`uppercase font-bold tracking-tight ${currentConfig.text}`}>
            {currentConfig.label}
          </span>
        </div>
      </TechnicalTooltip>

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