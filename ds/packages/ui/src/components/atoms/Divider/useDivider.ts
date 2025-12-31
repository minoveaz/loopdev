import { useMemo } from 'react';

/**
 * @hook useDivider
 * @description Lógica de mapeo de estilos para la primitiva Divider.
 */
export const useDivider = (props: any) => {
  const { 
    orientation = 'horizontal', 
    label, 
    className = '', 
    ...rest 
  } = props;

  const isHorizontal = orientation === 'horizontal';

  const containerClasses = useMemo(() => {
    const base = 'flex items-center text-text-muted';
    const orientationClasses = isHorizontal ? 'w-full' : 'h-full flex-col';
    return `${base} ${orientationClasses} ${className}`;
  }, [isHorizontal, className]);

  const lineClasses = useMemo(() => {
    const base = 'bg-border-subtle';
    const orientationClasses = isHorizontal ? 'h-px flex-grow' : 'w-px flex-grow';
    return `${base} ${orientationClasses}`;
  }, [isHorizontal]);

  const labelWrapperClasses = useMemo(() => {
    return isHorizontal ? 'mx-4' : 'my-4';
  }, [isHorizontal]);

  return {
    ...rest,
    label,
    isHorizontal,
    containerClasses,
    lineClasses,
    labelWrapperClasses,
  };
};