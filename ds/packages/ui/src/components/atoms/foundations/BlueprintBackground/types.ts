/**
 * @file types.ts
 * @description Contratos de tipado para el fondo técnico oficial.
 */

export type BackgroundIntensity = 'low' | 'medium' | 'high';
export type BackgroundVariant = 'blueprint' | 'neural' | 'monochrome';

export interface BlueprintBackgroundProps {
  /** Intensidad de la rejilla y efectos */
  intensity?: BackgroundIntensity;
  /** Habilitar el efecto de barrido Scanline */
  withScanline?: boolean;
  /** Tipo de rejilla técnica */
  variant?: BackgroundVariant;
  /** Clase CSS adicional */
  className?: string;
}
