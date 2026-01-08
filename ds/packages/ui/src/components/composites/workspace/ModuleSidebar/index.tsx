'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input, ScrollArea, LpdText } from '../../../atoms';
import { ModuleSidebarProps } from './types';

/**
 * @component ModuleSidebar
 * @description Contenedor estandarizado para la navegación interna del módulo.
 * Gestiona el padding uniforme, scroll independiente y búsqueda local.
 * @category Layouts
 * @phase 2
 */
export const ModuleSidebar: React.FC<ModuleSidebarProps> = (props) => {
  const { title, search, topSlot, children, bottomSlot, className = '' } = props;

  return (
    <div className={`flex flex-col h-full bg-shell-canvas ${className}`} role="complementary">
      
      {/* 1. Header Interno (Opcional) */}
      {(title || search || topSlot) && (
        <div className="flex flex-col gap-4 p-4 pb-2 border-b border-border-technical">
          {title && (
            <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-widest px-1">
              {title}
            </LpdText>
          )}
          
          {search && (
            <Input 
              variant="outline"
              size="sm"
              placeholder={search.placeholder || 'Buscar...'}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              startIcon={<Search size={14} className="text-text-muted" />}
              className="bg-background-subtle/50"
            />
          )}

          {topSlot}
        </div>
      )}

      {/* 2. Área de Navegación (Scrollable) */}
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea visibility="auto" className="h-full">
          <nav className="p-3 space-y-1">
            {children}
          </nav>
        </ScrollArea>
      </div>

      {/* 3. Footer Interno (Opcional) */}
      {bottomSlot && (
        <div className="p-3 border-t border-border-technical bg-background-subtle/20">
          {bottomSlot}
        </div>
      )}
    </div>
  );
};
