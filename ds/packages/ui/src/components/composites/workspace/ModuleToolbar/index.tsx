'use client';

import React from 'react';
import { X } from 'lucide-react';
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
  const { left, center, right, selection } = props;
  const { 
    containerClasses, 
    style, 
    shouldRender, 
    isSelectionActive 
  } = useModuleToolbar(props);

  if (!shouldRender) return null;

  return (
    <div className={containerClasses} style={style} role="toolbar">
      
      {/* 1. Cubo Izquierdo: Operaciones Primarias / Selección */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
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
          left
        )}
      </div>

      {/* 2. Cubo Central: Controles de Vista */}
      <div className="flex-1 flex items-center justify-center min-w-0 px-2">
        {center}
      </div>

      {/* 3. Cubo Derecho: Acciones Secundarias / Paneles */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {right}
      </div>
    </div>
  );
};
