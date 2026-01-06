/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de separación técnica.
 */

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerThickness = 'standard' | 'technical';

export interface DividerProps {
  /** Orientación del separador */
  orientation?: DividerOrientation;
  /** Grosor técnico de la línea */
  thickness?: DividerThickness;
  /** Etiqueta opcional en el centro (solo horizontal) */
  label?: string;
  /** Clase CSS adicional */
  className?: string;
}
