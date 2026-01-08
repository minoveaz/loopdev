import React from 'react';

export interface ModuleToolbarProps {
  /** Slot izquierdo: Búsqueda, filtros primarios */
  left?: React.ReactNode;
  
  /** Slot central: Toggles de vista, ordenación */
  center?: React.ReactNode;
  
  /** Slot derecho: Acciones bulk, toggles de paneles */
  right?: React.ReactNode;
  
  /** Información de selección activa */
  selection?: {
    count: number;
    onClear: () => void;
  };
  
  /** Densidad visual del toolbar */
  density?: 'compact' | 'comfortable';
  
  /** Clase CSS adicional */
  className?: string;
}
