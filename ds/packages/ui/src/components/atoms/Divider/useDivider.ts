import { useMemo } from 'react';
import { DividerProps, DividerOrientation, DividerThickness } from './types';

/**
 * @hook useDivider
 * @description Lógica de mapeo de estilos para la separación técnica.
 * Implementa grosores de precisión para el estándar v3.8.
 */
export const useDivider = (props: DividerProps) => {
  const { 
    orientation = 'horizontal', 
    thickness = 'standard',
    label, 
    className = '' 
  } = props;

  const isHorizontal = orientation === 'horizontal';

  // Mapeo de grosores técnicos
  const thicknessMap: Record<DividerThickness, string> = {
    standard: isHorizontal ? 'h-[1px]' : 'w-[1px]',
    technical: isHorizontal ? 'h-[0.5px]' : 'w-[0.5px]'
  };

  const containerClasses = useMemo(() => {
    const base = 'flex items-center text-text-muted select-none pointer-events-none';
    const orientationClasses = isHorizontal ? 'w-full' : 'h-full flex-col';
    return `${base} ${orientationClasses} ${className}`.replace(/\s+/g, ' ').trim();
  }, [isHorizontal, className]);

  const lineClasses = useMemo(() => {
    // Usamos el token border-subtle con opacidades reactivas
    const base = 'bg-black/5 dark:bg-white/10 transition-colors duration-300';
    const dimClasses = thicknessMap[thickness];
    return `${base} ${dimClasses} ${label ? 'flex-grow' : 'w-full h-full'}`;
  }, [thickness, isHorizontal, label]);

  const labelWrapperClasses = useMemo(() => {
    return isHorizontal ? 'mx-4' : 'my-4';
  }, [isHorizontal]);

  return {
    label,
    isHorizontal,
    containerClasses,
    lineClasses,
    labelWrapperClasses,
  };
};
