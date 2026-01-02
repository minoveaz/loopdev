import { useMemo, useEffect, useState } from 'react';
import { SkeletonProps } from './types';

/**
 * @hook useSkeleton
 * @description Lógica de animación y estilos para placeholders.
 */
export const useSkeleton = (props: SkeletonProps) => {
  const {
    variant = 'rect',
    animation: initialAnimation = 'shimmer',
    radius,
    className = '',
    width,
    height
  } = props;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // 1. Detección de Accesibilidad (Reduced Motion)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 2. Determinar animación final
  const animation = prefersReducedMotion ? 'none' : initialAnimation;

  const finalClassName = useMemo(() => {
    const base = 'bg-slate-300 dark:bg-white/10 overflow-hidden relative shrink-0';
    
    // Mapeo de formas
    const variantStyles = {
      rect: 'rounded-md',
      circle: 'rounded-full',
      text: 'rounded-sm',
      button: 'rounded-lg'
    }[variant];

    // Mapeo de radios explícitos
    const radiusStyles = radius ? {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-[1rem]',
      full: 'rounded-full'
    }[radius] : '';

    // Mapeo de animaciones (CSS Classes)
    const animationStyles = {
      shimmer: '', // El shimmer se maneja internamente en el Body
      pulse: 'animate-pulse-soft',
      none: ''
    }[animation];

    return `${base} ${variantStyles} ${radiusStyles} ${animationStyles} ${className}`;
  }, [variant, radius, animation, className]);

  const style = useMemo(() => ({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }), [width, height]);

  return {
    finalClassName,
    style,
    animation
  };
};
