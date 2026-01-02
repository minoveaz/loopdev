import React from 'react';
import { useSpinner } from './useSpinner';
import { Icon } from '../Icon';
import type { SpinnerProps } from './types';

/**
 * @component Spinner
 * @description Indicador de carga atómico. Utiliza el glifo 'progress_activity' con animación rotativa.
 * @category Primitives
 * @status stable
 */
export const Spinner: React.FC<SpinnerProps> = (props) => {
  const { finalClassName, size } = useSpinner(props);

  return (
    <Icon 
      name="progress_activity" 
      size={size} 
      className={finalClassName} 
    />
  );
};
