/**
 * @file types.ts
 * @description Contratos de tipado para el átomo IdentityBar.
 */

export type IdentityBarOrientation = 'vertical' | 'horizontal';
export type IdentityBarSize = 'technical' | 'sm' | 'md' | 'lg';

export interface IdentityBarProps {
  /** Color de la identidad (soporta token CSS o Hex) */
  color?: string;
  /** Orientación de la barra */
  orientation?: IdentityBarOrientation;
  /** Escala industrial */
  size?: IdentityBarSize;
  /** Habilitar resplandor sutil (glow) */
  withGlow?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
