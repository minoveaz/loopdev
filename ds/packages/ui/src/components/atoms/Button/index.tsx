import React from 'react';
import { useButton } from './useButton';
import { ButtonContent } from './components';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'energy' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: string;
  endIcon?: string;
  /**
   * RBAC Security: The required permission to interact with this button.
   * If the user lacks this permission, the button is automatically disabled.
   * @example "create:user"
   */
  permission?: string;
}

/**
 * @component Button
 * @description Botón principal del sistema con soporte para variantes, tamaños, iconos y estados de carga.
 * @category Primitives
 * @status stable
 */
export const Button: React.FC<ButtonProps> = (props) => {
  // Extraemos startIcon y endIcon para NO pasarlos al <button> como atributo HTML
  const { finalClassName, children, isLoading, startIcon, endIcon, ...rest } = useButton(props);

  return (
    <button 
      className={finalClassName} 
      aria-busy={isLoading}
      {...rest}
    >
      <ButtonContent 
        isLoading={isLoading} 
        startIcon={startIcon} 
        endIcon={endIcon}
      >
        {children}
      </ButtonContent>
    </button>
  );
};
