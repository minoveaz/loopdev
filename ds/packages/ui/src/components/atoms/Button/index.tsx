import React from 'react';
import { useButton } from './useButton';
import { ButtonContent } from './components';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'energy';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: string;
}

/**
 * @component Button
 * @description Botón principal del sistema con soporte para variantes, tamaños, iconos y estados de carga.
 * @category Primitives
 * @status stable
 */
export const Button: React.FC<ButtonProps> = (props) => {
  const { finalClassName, children, icon, isLoading, ...rest } = useButton(props);

  return (
    <button 
      className={finalClassName} 
      aria-busy={isLoading}
      {...rest}
    >
      <ButtonContent isLoading={isLoading} icon={icon}>
        {children}
      </ButtonContent>
    </button>
  );
};