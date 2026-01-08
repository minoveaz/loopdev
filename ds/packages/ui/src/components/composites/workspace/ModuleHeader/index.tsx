'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, PanelLeft } from 'lucide-react';
import { 
  IconButton, 
  Icon, 
  TechnicalLabel, 
  LpdText, 
  TechnicalTooltip 
} from '../../../atoms';
import { ModuleHeaderProps } from './types';
import { useModuleHeader } from './useModuleHeader';

/**
 * @component ModuleHeader
 * @description Cabecera de Nivel 2 para orientación y contexto de módulo.
 * @category Layouts
 * @phase 2
 */
export const ModuleHeader: React.FC<ModuleHeaderProps> = (props) => {
  const { 
    title, 
    subtitle, 
    breadcrumbs = [], 
    showBack, 
    onBack, 
    sidebarToggle,
    status,
    rightSlot 
  } = props;

  const { 
    containerClasses, 
    style, 
    statusClasses,
    hasSidebarToggle 
  } = useModuleHeader(props);

  return (
    <div className={containerClasses} style={style} role="navigation">
      
      {/* --- CÁPSULA IZQUIERDA: Orientación --- */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Toggle de Sidebar (Si aplica) */}
        {hasSidebarToggle && (
          <IconButton
            icon="auto_awesome_motion" // Usamos un icono de grilla técnica
            size="sm"
            variant="ghost"
            onClick={sidebarToggle?.onToggle}
            isActive={sidebarToggle?.isOpen}
            aria-label={sidebarToggle?.ariaLabel || 'Alternar menú de módulo'}
            className="shrink-0"
          />
        )}

        {/* Botón Atrás */}
        {showBack && (
          <IconButton 
            icon="arrow_back" 
            size="sm" 
            variant="ghost" 
            onClick={onBack} 
            aria-label="Volver atrás"
            className="shrink-0"
          />
        )}

        {/* Identidad del Módulo */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <LpdText size="sm" weight="bold" className="text-text-main truncate">
              {title}
            </LpdText>
            {status && (
              <div className={statusClasses}>
                <span className="opacity-60">{`{`}</span>
                <span>{status.label}</span>
                <span className="opacity-60">{`}`}</span>
              </div>
            )}
          </div>
          
          {/* Breadcrumbs Jerárquicos */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-micro opacity-60">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={`${bc.label}-${idx}`}>
                  <span className="truncate max-w-[120px] hover:text-primary transition-colors cursor-pointer">
                    {bc.label}
                  </span>
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight size={10} className="shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- CÁPSULA CENTRAL: Contexto --- */}
      <div className="hidden md:flex flex-1 justify-center min-w-0 px-4">
        {/* Espacio reservado para Tabs de Módulo */}
      </div>

      {/* --- CÁPSULA DERECHA: Acciones Meta --- */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {rightSlot}
      </div>
    </div>
  );
};
