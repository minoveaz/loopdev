import React from 'react';
import { useLogoSpinner } from './useLogoSpinner';
import { InfinityPath } from './components';
import { LogoSpinnerProps } from './types';

/**
 * @component LogoSpinner
 * @description Indicador de carga de marca de alta fidelidad. Representa el flujo generativo de LoopDev.
 * @category Feedback
 * @phase 2
 */
export const LogoSpinner: React.FC<LogoSpinnerProps> = (props) => {
  const { finalSize, animationDuration, className } = useLogoSpinner(props);

  return (
    <div 
      role="status"
      aria-label="LoopDev Generative System Processing"
      className={`relative inline-flex items-center justify-center aspect-[100/69] ${className}`}
      style={{ 
        width: finalSize
      }}
    >
      <InfinityPath duration={animationDuration} />
    </div>
  );
};