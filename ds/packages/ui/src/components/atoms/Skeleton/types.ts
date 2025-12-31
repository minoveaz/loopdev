/**
 * @file types.ts
 * @description Contratos para la infraestructura de Skeletons.
 */

export type SkeletonVariant = 'rect' | 'circle' | 'text' | 'button';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

export interface SkeletonProps {
  /** Forma geométrica base */
  variant?: SkeletonVariant;
  /** Tipo de animación (shimmer para pequeños, pulse para grandes) */
  animation?: SkeletonAnimation;
  /** Ancho (acepta tokens de Tailwind o valores CSS) */
  width?: string | number;
  /** Alto (acepta tokens de Tailwind o valores CSS) */
  height?: string | number;
  /** Radio de borde (hereda del sistema por defecto) */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Props específicas para el preset de texto
 */
export interface TextSkeletonProps extends SkeletonProps {
  /** Número de líneas a generar */
  lines?: number;
  /** Espaciado entre líneas */
  gap?: string;
}
