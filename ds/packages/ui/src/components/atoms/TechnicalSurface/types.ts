import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de superficie técnica.
 */

export type SurfaceVariant = 'surface' | 'glass' | 'canvas';
export type SurfaceDepth = 'flat' | 'raised' | 'overlay';

export interface TechnicalSurfaceProps {
  /** Variación estética del fondo */
  variant?: SurfaceVariant;
  /** Nivel de elevación y sombra */
  depth?: SurfaceDepth;
  /** Habilitar micro-grilla técnica interna */
  withGrid?: boolean;
  /** Clase CSS adicional para paddings o dimensiones */
  className?: string;
  /** Contenido del contenedor */
  children?: ReactNode;
  /** Propagar eventos de clic si es necesario */
  onClick?: () => void;
}
