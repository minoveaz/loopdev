import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de tipografía técnica.
 */

export type TechnicalLabelVariant = 'primary' | 'muted' | 'subtle' | 'white';
export type TechnicalLabelSize = 'nano' | 'xs';

export interface TechnicalLabelProps {
  /** Contenido de la etiqueta */
  children: ReactNode;
  /** Variante semántica de color */
  variant?: TechnicalLabelVariant;
  /** Tamaño industrial */
  size?: TechnicalLabelSize;
  /** Forzar transformación a mayúsculas */
  isUppercase?: boolean;
  /** Espaciado entre letras extra */
  isWide?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
