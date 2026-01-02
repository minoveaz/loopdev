import { useMemo } from 'react';
import { cn } from '../../../helpers/cn';
import type { SpinnerProps } from './types';

/**
 * @hook useSpinner
 * @description Maneja los estilos y la lógica de animación para el componente Spinner.
 */
export const useSpinner = (props: SpinnerProps) => {
  const { size = 'md', color = 'primary', className } = props;

  const colorMap: Record<string, string> = {
    primary: 'text-primary',
    current: 'text-current',
    energy: 'text-accent', // Usamos accent para Energy Yellow
    white: 'text-white',
  };

  const finalClassName = useMemo(() => {
    return cn(
      'animate-spin inline-block shrink-0',
      colorMap[color],
      className
    );
  }, [color, className]);

  return {
    finalClassName,
    size
  };
};
