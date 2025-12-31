/**
 * @file types.ts
 * @description Contratos de tipado para el LogoSpinner.
 */

export type LogoSpinnerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

export interface LogoSpinnerProps {
  /** Tamaño semántico o numérico en px */
  size?: LogoSpinnerSize;
  /** Velocidad de la animación (fast | normal | slow) */
  speed?: 'fast' | 'normal' | 'slow';
  /** Si es true, el gradiente será estático en lugar de animado */
  isStatic?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
