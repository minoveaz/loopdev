import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para la utilidad de scroll técnico.
 */

export type ScrollbarVisibility = 'auto' | 'always' | 'hidden';

export interface ScrollAreaProps {
  /** Contenido que necesita scroll */
  children: ReactNode;
  /** Controla la visibilidad de la barra de scroll */
  visibility?: ScrollbarVisibility;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}
