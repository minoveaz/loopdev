'use client';

import React from 'react';
import { X, Info } from 'lucide-react';
import { IconButton, ScrollArea, LpdText, Divider } from '../../atoms';
import { InspectorPanelProps } from './types';

/**
 * @component InspectorPanel
 * @description Panel derecho estandarizado para propiedades y contexto profundo.
 * Proporciona un chasis coherente con cabecera fija y scroll independiente.
 * @category Layouts
 * @phase 2
 */
export const InspectorPanel: React.FC<InspectorPanelProps> = (props) => {
  const { title, subtitle, onClose, headerSlot, children, footerSlot, className = '' } = props;

  return (
    <div className={`flex flex-col h-full bg-shell-canvas ${className}`} role="region" aria-label="Panel de inspección">
      
      {/* 1. Header del Panel (Fijo) */}
      <div className="flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3 h-[48px]">
          <div className="flex flex-col min-w-0">
            <LpdText size="xs" weight="bold" className="text-text-main truncate uppercase tracking-tight">
              {title || 'Propiedades'}
            </LpdText>
            {subtitle && (
              <LpdText size="nano" className="text-text-muted truncate font-mono opacity-60">
                {`{ ${subtitle} }`}
              </LpdText>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {headerSlot}
            <IconButton 
              icon="close" 
              size="xs" 
              variant="ghost" 
              onClick={onClose} 
              aria-label="Cerrar panel" 
            />
          </div>
        </div>
        <Divider thickness="technical" className="mx-0" />
      </div>

      {/* 2. Cuerpo del Panel (Scrollable) */}
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea visibility="auto" className="h-full">
          <div className="p-4 space-y-6">
            {children}
          </div>
        </ScrollArea>
      </div>

      {/* 3. Footer del Panel (Opcional) */}
      {footerSlot && (
        <div className="p-4 border-t border-border-technical bg-background-subtle/20">
          {footerSlot}
        </div>
      )}
    </div>
  );
};
