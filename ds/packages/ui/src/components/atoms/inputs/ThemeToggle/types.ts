/**
 * @file types.ts
 * @description Contratos de tipado para el selector de tema oficial.
 */

type ThemeToggleVariant = 'technical' | 'standard';
type ThemeToggleSize = 'sm' | 'md' | 'lg';

export interface ThemeToggleProps {
  /** Estética del botón */
  variant?: ThemeToggleVariant;
  /** Tamaño industrial */
  size?: ThemeToggleSize;
  /** Clase CSS adicional */
  className?: string;
}
