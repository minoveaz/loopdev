'use client';

'use client';

import { useMemo } from 'react';
import { LogoSpinnerProps } from './types';

/**
 * @hook useLogoSpinner
 * @description Lógica técnica para el trazado infinito.
 */
export const useLogoSpinner = (props: LogoSpinnerProps) => {
  const { 
    size = 'lg', 
    speed = 'normal',
    className = '' 
  } = props;

  const sizeMap: Record<string, number> = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
    '2xl': 120
  };

  const finalSize = typeof size === 'number' ? size : (sizeMap[size] || sizeMap.lg);

  const animationDuration = useMemo(() => {
    switch (speed) {
      case 'fast': return '1.5s';
      case 'slow': return '4s';
      default: return '2.5s';
    }
  }, [speed]);

  return {
    finalSize,
    animationDuration,
    className
  };
};
