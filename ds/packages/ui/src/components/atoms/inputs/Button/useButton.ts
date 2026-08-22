'use client';

import { useMemo } from 'react';
import { useAuth } from '../../../../modules/auth';

export const useButton = (props: any) => {
  // Fix: Correctly destructure children and className from props, as they are now explicitly defined in ButtonProps
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading,
    children,
    className,
    startIcon,
    endIcon,
    disabled,
    permission,
    ...rest
  } = props;

  // RBAC Integration (Infra Awareness)
  const { hasPermission } = useAuth();
  const isAllowed = permission ? hasPermission(permission) : true;

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-sm text-lpd-sm leading-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed max-w-full overflow-hidden';

  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-accent hover:text-text-main focus-visible:ring-accent/40';
      case 'secondary':
        return 'border border-border-technical bg-surface-light text-text-main hover:border-accent hover:bg-accent/10 dark:bg-surface-dark dark:text-white';
      case 'outline':
        return 'border border-primary text-primary hover:border-accent hover:bg-accent/10 hover:text-accent';
      case 'ghost':
        return 'text-text-muted hover:bg-background-subtle hover:text-text-main dark:hover:bg-background-subtle/80';
      case 'energy':
        return 'bg-accent text-text-main hover:bg-accent-hover focus-visible:ring-energy';
      case 'danger':
        return 'border border-danger text-danger hover:bg-danger/10 focus-visible:ring-danger';
      default:
        return '';
    }
  }, [variant]);

  const sizeStyles = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5';
      case 'md':
        return 'px-3 py-2';
      case 'lg':
        return 'px-4 py-2.5 text-lpd-base';
      default:
        return '';
    }
  }, [size]);

  const widthStyle = fullWidth ? 'w-full' : '';

  // Logic Upgrade: Button also gets class 'rbac-restricted' if blocked by permission for easier testing
  const rbacStyle = !isAllowed ? 'opacity-40 cursor-not-allowed grayscale' : '';

  const finalClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyle} ${rbacStyle} ${className || ''}`;

  // Lógica crítica: El botón se deshabilita si está disabled, cargando O si falta el permiso
  const isDisabled = disabled || isLoading || !isAllowed;

  // Accesibilidad: Si está deshabilitado por permisos, explicamos por qué en el title
  const title = !isAllowed ? 'No tienes permisos para realizar esta acción.' : props.title;

  return {
    finalClassName,
    isLoading,
    startIcon,
    endIcon,
    children,
    disabled: isDisabled,
    title,
    'aria-disabled': isDisabled,
    ...rest,
  };
};
