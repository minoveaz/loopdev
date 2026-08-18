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
    leftSlot,
    centerSlot,
    rightSlot,
    rows = 1,
    className = '',
    ariaLabel = 'Module header',
    visibleOnMobile = true,
    visibleOnDesktop = true,
  } = props;

  const { 
    containerClasses,
    hasSidebarToggle 
  } = useModuleHeader(props);

  return (
    <header
      aria-label={ariaLabel}
      data-module-header="true"
      data-module-header-rows={rows}
      className={`${containerClasses} ${visibleOnMobile ? 'grid' : 'hidden'} ${visibleOnDesktop ? 'lg:grid' : 'lg:hidden'} ${rows === 2 ? 'min-h-[var(--lpd-workspace-header-h,56px)] grid-cols-1 grid-rows-2 py-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-1' : 'h-[var(--lpd-workspace-header-h,56px)] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'} items-center gap-x-3 gap-y-2 border-b border-border-technical bg-shell-canvas px-4 select-none lg:gap-x-4 lg:px-6 ${className}`}
    >
      
      {/* 1. SLOT IZQUIERDO: Path Authority (IndustrialBreadcrumbs) */}
      <div className="flex min-w-0 items-center gap-2 lg:gap-4">
        {hasSidebarToggle && (
          <IconButton
            icon="menu"
            size="sm"
            variant="ghost"
            onClick={sidebarToggle?.onToggle}
            aria-expanded={sidebarToggle?.isOpen}
            aria-label={sidebarToggle?.ariaLabel ?? 'Toggle module context'}
            className="shrink-0"
          />
        )}

        {leftSlot ?? <IndustrialBreadcrumbs segments={segments} />}
      </div>

      {/* 2. SLOT CENTRAL: Status Sensor */}
      <div className="hidden min-w-0 items-center justify-center md:flex">
        {centerSlot ?? (statusLabel && (
          <TechnicalStatusBadge 
            label={statusLabel} 
            severity={statusSeverity} 
            withPulse 
            variant="glass"
          />
        ))}
      </div>

      {/* 3. SLOT DERECHO: Local Actions */}
      <div className="flex min-w-0 items-center justify-end gap-2 lg:gap-3">
        {rightSlot}
      </div>
    </header>
  );
};
