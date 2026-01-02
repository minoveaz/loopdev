import { useMemo } from 'react';
import { cn } from '../../../helpers/cn';

/**
 * @hook useTypography
 * @description Lógica de mapeo de estilos para la primitiva Text.
 */
export const useTypography = (props: any) => {
  const { 
    size = 'base', 
    weight = 'normal', 
    variant = 'sans', 
    className = '', 
    as = 'span' 
  } = props;

  const sizeMap: Record<string, string> = {
    xs: 'text-[10px]',
    sm: 'text-[12px]',
    base: 'text-[14px]',
    lg: 'text-[16px]',
    xl: 'text-[18px]',
    '2xl': 'text-[24px]',
    '3xl': 'text-[30px]',
    '4xl': 'text-[36px]',
    '5xl': 'text-[48px]',
  };

  const weightMap: Record<string, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  };

  const variantMap: Record<string, string> = {
    sans: 'font-sans',
    mono: 'font-mono',
  };

  const classes = cn(
    variantMap[variant] || variantMap.sans,
    sizeMap[size] || sizeMap.base,
    weightMap[weight] || weightMap.normal,
    className
  );

  return {
    classes,
    Component: as
  };
};
