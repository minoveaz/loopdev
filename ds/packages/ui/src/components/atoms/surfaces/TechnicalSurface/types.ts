import React from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de superficie técnica.
 */

export type SurfaceVariant = 'surface' | 'glass' | 'canvas';
export type SurfaceDepth = 'flat' | 'raised' | 'overlay';
export type SurfaceRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SurfaceBorder = 'none' | 'subtle' | 'technical' | 'strong';
export type SurfaceBorderWidth = 'thin' | 'medium';
export type SurfaceInteraction = 'static' | 'interactive';

export interface TechnicalSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variación estética del fondo */
  variant?: SurfaceVariant;
  /** Nivel de elevación y sombra */
  depth?: SurfaceDepth;
  /** Radio semántico de la superficie */
  radius?: SurfaceRadius;
  /** Contraste semántico del borde */
  border?: SurfaceBorder;
  /** Grosor del borde */
  borderWidth?: SurfaceBorderWidth;
  /** Define si la superficie expone affordance de interacción */
  interaction?: SurfaceInteraction;
  /** Control de desbordamiento de contenido */
  overflow?: 'hidden' | 'visible' | 'auto';
  /** Habilitar micro-grilla técnica interna */
  withGrid?: boolean;
}
