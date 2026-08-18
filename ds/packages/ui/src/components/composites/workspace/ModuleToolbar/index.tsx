'use client';

import React from 'react';
import { IconButton, LpdText } from '../../../atoms';
import { ModuleToolbarProps } from './types';
import { useModuleToolbar } from './useModuleToolbar';

/**
 * @component ModuleToolbar
 * @description Barra de herramientas operativa del Canvas. 
 * Se organiza en un layout de 3 cubos: Left, Center, Right.
 * @category Layouts
 * @phase 2
 */
export const ModuleToolbar: React.FC<ModuleToolbarProps> = (props) => {
  const {
    contextSlot,
    leftSlot,
    centerSlot,
    rightSlot,
    selection,
    rows = 1,
    ariaLabel = 'Module toolbar',
    visibleOnMobile = true,
    visibleOnDesktop = true,
  } = props;
  const { 
    containerClasses, 
    style, 
    shouldRender,
    isSelectionActive,
    layoutClasses,
  } = useModuleToolbar(props);

  if (!shouldRender) return null;

  return (
    <div
      aria-label={ariaLabel}
      data-module-toolbar="true"
      data-module-toolbar-rows={rows}
      className={`${containerClasses} ${layoutClasses} ${visibleOnMobile ? 'grid' : 'hidden'} ${visibleOnDesktop ? 'lg:grid' : 'lg:hidden'} min-h-0 overflow-hidden`}
      style={style}
      role="toolbar"
    >
      
      {/* 1. Cubo Izquierdo: Operaciones Primarias / Selección */}
      <div className={`flex min-w-0 items-center gap-3 overflow-x-auto ${rows === 2 ? 'max-lg:col-span-2' : ''}`}>
        {contextSlot ? <div className="shrink-0">{contextSlot}</div> : null}
        {isSelectionActive ? (
          <div className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
            <IconButton 
              icon="close" 
              size="sm" 
              variant="ghost" 
              onClick={selection?.onClear} 
              aria-label="Limpiar selección" 
            />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              <LpdText size="nano" weight="bold" className="text-primary uppercase tracking-widest">
                {`{ ${selection?.count} seleccionados }`}
              </LpdText>
            </div>
          </div>
        ) : (
          leftSlot
        )}
      </div>

      {/* 2. Cubo Central: Controles de Vista */}
      <div className={`flex min-w-0 items-center justify-start px-2 lg:justify-center ${rows === 2 ? 'max-lg:col-span-1' : ''}`}>
        {centerSlot}
      </div>

      {/* 3. Cubo Derecho: Acciones Secundarias / Paneles */}
      <div className={`flex min-w-0 items-center justify-end gap-2 max-lg:flex-none ${rows === 2 ? 'max-lg:col-span-1' : ''}`}>
        {rightSlot}
      </div>
    </div>
  );
};
