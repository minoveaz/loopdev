import { useMemo } from 'react';

export const useButton = (props: any) => {
  // Fix: Correctly destructure children and className from props, as they are now explicitly defined in ButtonProps
  const { variant = 'primary', size = 'md', fullWidth = false, isLoading, children, className, startIcon, endIcon, disabled, ...rest } = props;

  const baseStyles = "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'primary': return "bg-[var(--comp-primary,#135bec)] hover:bg-[var(--comp-primary-dark,#0b46be)] text-white shadow-lg shadow-[var(--comp-primary-shadow,rgba(19,91,236,0.2))] focus:ring-[var(--comp-primary,#135bec)]";
      case 'secondary': return "bg-surface-light dark:bg-surface-dark text-text-main dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[var(--comp-primary,#135bec)] dark:hover:border-[var(--comp-primary,#135bec)]";
      case 'outline': return "border-2 border-[var(--comp-primary,#135bec)] text-[var(--comp-primary,#135bec)] hover:bg-[var(--comp-primary-soft,rgba(19,91,236,0.05))]";
      case 'ghost': return "text-text-muted hover:text-[var(--comp-primary,#135bec)] hover:bg-gray-100 dark:hover:bg-gray-800";
      case 'energy': return "bg-accent hover:bg-accent-hover text-text-main shadow-lg shadow-energy/20 focus:ring-energy";
      default: return "";
    }
  }, [variant]);

  const sizeStyles = useMemo(() => {
    switch (size) {
      case 'sm': return "px-3 py-1.5 text-xs";
      case 'md': return "px-5 py-2.5 text-sm";
      case 'lg': return "px-8 py-3 text-base";
      default: return "";
    }
  }, [size]);

  const widthStyle = fullWidth ? "w-full" : "";

  const finalClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyle} ${className || ''}`;

  // Lógica crítica: El botón se deshabilita si está disabled O si está cargando
  const isDisabled = disabled || isLoading;

  return {
    finalClassName,
    isLoading,
    startIcon, // Pasamos explícitamente startIcon para que index.tsx lo reciba
    endIcon,   // Pasamos explícitamente endIcon
    children,
    disabled: isDisabled, // Override del prop disabled original
    ...rest,
  };
};