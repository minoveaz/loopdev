'use client';

import { cn } from '../../../../helpers/cn';
import type { TypographyProps, TypographySize, TypographyWeight, TypographyVariant } from './types';

/**
 * Mapeo de tamaños a clases de Tailwind
 * IMPORTANTE: Estas clases deben coincidir con las definidas en:
 * - @loopdev/tokens/src/foundations/typography.css
 * - @loopdev/tailwind-config/tailwind.preset.js (safelist)
 * - helpers/cn.ts (extendTailwindMerge)
 */
const sizeMap: Record<TypographySize, string> = {
  nano: 'text-lpd-nano',
  xs: 'text-lpd-xs',
  sm: 'text-lpd-sm',
  base: 'text-lpd-base',
  lg: 'text-lpd-lg',
  xl: 'text-lpd-xl',
  '2xl': 'text-lpd-2xl',
  '3xl': 'text-lpd-3xl',
  '4xl': 'text-lpd-4xl',
  '5xl': 'text-lpd-5xl',
  '6xl': 'text-lpd-6xl',
  '7xl': 'text-lpd-7xl',
};

const weightMap: Record<TypographyWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
};

const variantMap: Record<TypographyVariant, string> = {
  sans: 'font-sans',
  mono: 'font-mono',
};

/**
 * @hook useTypography
 * @description Lógica de mapeo de estilos para la primitiva Text.
 */
export const useTypography = (props: TypographyProps) => {
  const { 
    size = 'base', 
    weight = 'normal', 
    variant = 'sans', 
    className = '', 
    as = 'span' 
  } = props;

  const classes = cn(
    variantMap[variant],
    sizeMap[size],
    weightMap[weight],
    className
  );

  return {
    classes,
    Component: as
  };
};
