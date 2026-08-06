import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de agrupación de navegación.
 */

export interface NavGroupProps {
  /** Etiqueta del grupo (ej: Operativo) */
  label: string;
  /** Contenido del grupo (NavSidebarItems) */
  children: ReactNode;
  /** Indica si está en modo Rail */
  isRail?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
