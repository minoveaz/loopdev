import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el sistema de menús desplegables técnicos.
 */

export interface TechnicalDropdownProps {
  /** Disparador del menú (Trigger) */
  trigger: ReactNode;
  /** Contenido del menú (Items, Groups, etc.) */
  children: ReactNode;
  /** Alineación del menú respecto al trigger */
  align?: 'start' | 'center' | 'end';
  /** Lado de aparición preferido */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Espaciado respecto al trigger */
  sideOffset?: number;
  /** Indica si el menú está abierto (Controlado) */
  open?: boolean;
  /** Callback de cambio de estado */
  onOpenChange?: (open: boolean) => void;
  /** Clase CSS adicional para el contenido */
  className?: string;
}

export interface TechnicalDropdownItemProps {
  /** Contenido del ítem */
  children: ReactNode;
  /** Acción disparada al seleccionar */
  onClick?: () => void;
  /** Indica si el ítem está deshabilitado */
  disabled?: boolean;
  /** Indica si es el ítem activo */
  isActive?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
