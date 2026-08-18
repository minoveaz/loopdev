import React from 'react';
import { useIconButton } from './useIconButton';
import { IconButtonContent } from './components';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  children?: React.ReactNode;
  variant?: 'neutral' | 'primary' | 'danger' | 'success' | 'ghost' | 'energy';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  tooltip?: string;
  ariaLabel?: string;
}

/**
 * @component IconButton
 * @description Botón interactivo basado en iconos para acciones discretas. Alineado a la grilla de 4px y protocolos de accesibilidad.
 * @category Primitives
 * @status stable
 */
export const IconButton: React.FC<IconButtonProps> = (props) => {
  const { finalClassName, icon, children, size, isLoading, tooltip, ariaLabel, disabled, ...rest } = useIconButton(props);

  return (
    <button
      type="button"
      className={finalClassName}
      data-control="icon-button"
      data-control-variant={props.variant ?? 'neutral'}
      data-control-size={size}
      title={tooltip}
      aria-label={ariaLabel || tooltip || (typeof icon === 'string' ? icon.replace(/_/g, ' ') : 'Icon button')}
      aria-busy={isLoading || undefined}
      disabled={disabled}
      {...rest}
    >
      {children ?? (
        <IconButtonContent
          icon={icon ?? 'help'}
          size={size}
          isLoading={isLoading}
        />
      )}
    </button>
  );
};
