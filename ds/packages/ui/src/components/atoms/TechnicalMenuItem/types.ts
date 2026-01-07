import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el ítem de menú estandarizado.
 */

export type MenuItemVariant = 'default' | 'danger';

export interface TechnicalMenuItemProps {
  /** Nombre del icono de Lucide */
  icon?: string;
  /** Texto de la opción */
  label: string;
  /** Atajo de teclado opcional (ej: ⌘K) */
  shortcut?: string;
  /** Variante semántica */
  variant?: MenuItemVariant;
  /** Indica si es la opción activa */
  isActive?: boolean;
  /** Indica si la opción está bloqueada */
  isDisabled?: boolean;
  /** Callback de acción */
  onClick?: () => void;
  /** Clase CSS adicional */
  className?: string;
}
