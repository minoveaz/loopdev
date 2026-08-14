import { CSSProperties, ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de superficie técnica.
 */

type SurfaceVariant = 'surface' | 'glass' | 'canvas';
type SurfaceDepth = 'flat' | 'raised' | 'overlay';
type SurfaceRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type SurfaceBorder = 'subtle' | 'technical' | 'strong';
type SurfaceBorderWidth = 'thin' | 'medium';

export interface TechnicalSurfaceProps {
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
  /** Control de desbordamiento de contenido */
  overflow?: 'hidden' | 'visible' | 'auto';
  /** Habilitar micro-grilla técnica interna */
  withGrid?: boolean;
  /** Clase CSS adicional para paddings o dimensiones */
  className?: string;
  /** Estilos de layout calculados por una composición declarativa */
  style?: CSSProperties;
  /** Contenido del contenedor */
  children?: ReactNode;
  /** Propagar eventos de clic si es necesario */
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
