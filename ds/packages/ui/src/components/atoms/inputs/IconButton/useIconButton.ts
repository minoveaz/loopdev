'use client';

'use client';

import { useMemo } from 'react';

export const useIconButton = (props: any) => {
  const { 
    icon, 
    variant = 'neutral', 
    size = 'md', 
    isLoading = false, 
    className = '', 
    tooltip, 
    ariaLabel,
    disabled,
    ...rest 
  } = props;

  const baseStyles = "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeMap: Record<string, string> = {
    sm: 'w-7 h-7', // For 12px icon
    md: 'w-8 h-8', // For 16px icon
    lg: 'w-9 h-9', // For 20px icon
  };

  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'primary': return "text-[var(--comp-primary,#135bec)] hover:text-[var(--comp-primary-dark,#0b46be)] hover:bg-[var(--comp-primary-soft,rgba(19,91,236,0.1))]";
      case 'danger': return "text-danger hover:text-danger-vivid hover:bg-danger-soft dark:hover:bg-red-900/20";
      case 'success': return "text-status-success hover:text-status-teal hover:bg-green-50 dark:hover:bg-green-900/20";
      case 'ghost': return "text-text-muted hover:text-[var(--comp-primary,#135bec)] hover:bg-gray-100 dark:hover:bg-gray-800";
      case 'neutral': // Default
      default: return "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800";
    }
  }, [variant]);

  const finalClassName = `${baseStyles} ${sizeMap[size]} ${variantStyles} ${className}`;

  return {
    finalClassName,
    icon,
    size,
    isLoading,
    tooltip,
    ariaLabel,
    disabled: disabled || isLoading, // Disabled prop + loading state
    ...rest,
  };
};