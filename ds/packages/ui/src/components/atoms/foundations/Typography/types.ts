/**
 * Typography Types - Single Source of Truth
 * Estos tipos reflejan exactamente los tokens definidos en:
 * @loopdev/tokens/src/foundations/typography.css
 */

import type { ElementType, ReactNode, HTMLAttributes } from 'react';

/** Tamaños tipográficos disponibles en el Design System */
export type TypographySize = 
  | 'nano'  // 9px  - Industrial density
  | 'xs'    // 12px
  | 'sm'    // 14px
  | 'base'  // 16px
  | 'lg'    // 18px
  | 'xl'    // 20px
  | '2xl'   // 24px
  | '3xl'   // 30px
  | '4xl'   // 36px
  | '5xl'   // 48px
  | '6xl'   // 60px
  | '7xl';  // 72px

/** Pesos tipográficos disponibles */
export type TypographyWeight = 
  | 'normal'    // 400
  | 'medium'    // 500
  | 'semibold'  // 600
  | 'bold'      // 700
  | 'black';    // 900

/** Variantes de fuente */
export type TypographyVariant = 'sans' | 'mono';

/** Props base para componentes de tipografía */
export interface TypographyProps {
  /** Tamaño del texto. Usa tokens del DS. */
  size?: TypographySize;
  /** Peso de la fuente */
  weight?: TypographyWeight;
  /** Familia tipográfica */
  variant?: TypographyVariant;
  /** Elemento HTML a renderizar */
  as?: ElementType;
  /** Clases adicionales de Tailwind */
  className?: string;
  /** Contenido */
  children?: ReactNode;
}

/** Props específicas para Heading */
export interface HeadingProps extends Omit<TypographyProps, 'as'> {
  /** Nivel semántico del heading (h1-h6) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
