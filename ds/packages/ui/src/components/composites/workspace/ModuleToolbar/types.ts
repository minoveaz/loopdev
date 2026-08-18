import React from 'react';

export interface ModuleToolbarProps {
  /** Trigger de contexto del módulo, reservado por el shell. */
  contextSlot?: React.ReactNode;
  /** Slot izquierdo: Búsqueda, filtros primarios */
  leftSlot?: React.ReactNode;
  
  /** Slot central: Toggles de vista, ordenación */
  centerSlot?: React.ReactNode;
  
  /** Slot derecho: Acciones bulk, toggles de paneles */
  rightSlot?: React.ReactNode;
  
  /** Información de selección activa */
  selection?: {
    count: number;
    onClear: () => void;
  };
  
  /** Densidad visual del toolbar */
  density?: 'compact' | 'comfortable';

  /** Número de filas visuales permitidas por el chasis. */
  rows?: 1 | 2;
  
  /** Clase CSS adicional */
  className?: string;

  /** Nombre accesible de la barra de herramientas. */
  ariaLabel?: string;

  /** Control responsive de visibilidad */
  visibleOnMobile?: boolean;
  visibleOnDesktop?: boolean;
}
