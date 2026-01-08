'use client';

import React from 'react';
import { 
  IconButton, 
  TechnicalStatusBadge,
  IndustrialBreadcrumbs
} from '../../../atoms';
import { ModuleHeaderProps } from './types';
import { useModuleHeader } from './useModuleHeader';

/**
 * @component ModuleHeader
 * @description Cabecera de Nivel 2 para orientación y contexto de módulo.
 * Implementa el patrón de "Path Authority" usando IndustrialBreadcrumbs.
 */
export const ModuleHeader: React.FC<ModuleHeaderProps> = (props) => {
  const { 
    segments = [], 
    statusLabel,
    statusSeverity,
    sidebarToggle,
    rightSlot,
    className = ''
  } = props;

  const { 
    containerClasses,
    hasSidebarToggle 
  } = useModuleHeader(props);

  return (
    <header className={`${containerClasses} h-14 px-6 border-b border-border-technical bg-shell-canvas flex items-center justify-between gap-4 select-none ${className}`}>
      
      {/* 1. SLOT IZQUIERDO: Path Authority (IndustrialBreadcrumbs) */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {hasSidebarToggle && (
          <IconButton
            icon="menu"
            size="sm"
            variant="ghost"
            onClick={sidebarToggle?.onToggle}
            isActive={sidebarToggle?.isOpen}
            className="shrink-0"
          />
        )}

        <IndustrialBreadcrumbs segments={segments} />
      </div>

      {/* 2. SLOT CENTRAL: Status Sensor */}
      <div className="hidden md:flex flex-1 justify-center shrink-0">
        {statusLabel && (
          <TechnicalStatusBadge 
            label={statusLabel} 
            severity={statusSeverity} 
            withPulse 
            variant="glass"
          />
        )}
      </div>

      {/* 3. SLOT DERECHO: Local Actions */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        {rightSlot}
      </div>
    </header>
  );
};