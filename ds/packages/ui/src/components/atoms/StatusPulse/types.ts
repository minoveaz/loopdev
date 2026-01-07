/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de telemetría StatusPulse.
 */

export type StatusPulseVariant = 'success' | 'energy' | 'danger' | 'primary' | 'info' | 'neutral' | 'innovation';
export type StatusPulseSize = 'xs' | 'sm' | 'md' | 'lg';

export interface StatusPulseProps {
  /** Variante semántica de color */
  variant?: StatusPulseVariant;
  /** Tamaño industrial del punto */
  size?: StatusPulseSize;
  /** Habilitar/Deshabilitar la animación de pulso */
  isAnimated?: boolean;
  /** Clase CSS adicional para posicionamiento */
  className?: string;
}
