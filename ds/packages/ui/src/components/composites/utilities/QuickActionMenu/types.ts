import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el menú de acciones rápidas QuickActionMenu.
 */

export interface QuickActionItem {
  /** ID único de la acción */
  id: string;
  /** Etiqueta de la acción (ej: Nueva Campaña) */
  label: string;
  /** Nombre del icono de Lucide */
  icon: string;
  /** Atajo de teclado (ej: N) */
  shortcut?: string;
  /** Indica si la acción es crítica */
  isCritical?: boolean;
  /** Indica si está deshabilitada */
  isDisabled?: boolean;
  /** Callback al ejecutar la acción */
  onAction?: () => void;
}

export interface QuickActionGroup {
  /** Nombre del grupo (ej: Marketing) */
  label?: string;
  /** Lista de acciones */
  actions: QuickActionItem[];
}

export interface QuickActionMenuProps {
  /** Grupos de acciones a mostrar */
  groups: QuickActionGroup[];
  /** Callback al cambiar el estado de apertura */
  onOpenChange?: (open: boolean) => void;
  /** Clase CSS adicional para el disparador */
  className?: string;
}
