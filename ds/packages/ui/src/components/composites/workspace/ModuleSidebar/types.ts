import React from 'react';

export interface ModuleSidebarProps {
  /** Título interno de la sidebar */
  title?: string;
  
  /** Configuración de búsqueda local */
  search?: {
    placeholder?: string;
    value: string;
    onChange: (v: string) => void;
  };
  
  /** Slot superior (ej: botón 'New') */
  topSlot?: React.ReactNode;
  
  /** Contenido principal (Navegación) */
  children: React.ReactNode;
  
  /** Slot inferior (ej: links secundarios) */
  bottomSlot?: React.ReactNode;
  
  /** Clase CSS adicional */
  className?: string;
}
