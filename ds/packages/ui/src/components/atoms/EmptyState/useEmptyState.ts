import { useMemo } from 'react';
import { EmptyStateProps } from './types';

/**
 * @hook useEmptyState
 * @description Lógica de composición y estilos para el componente EmptyState.
 */
export const useEmptyState = (props: EmptyStateProps) => {
  const { 
    size = 'md', 
    variant = 'card',
    isLoading = false,
    className = '' 
  } = props;

  const isAI = variant === 'ai' || isLoading;

  const containerClasses = useMemo(() => {
    const base = 'flex flex-col items-center justify-center text-center transition-all duration-500 group overflow-hidden relative';
    
    let variantStyles = '';
    
    if (isAI) {
      variantStyles = 'bg-innovation-soft-purple border border-innovation-purple/20 rounded-[2.5rem] shadow-lg shadow-innovation-purple/5 hover:border-innovation-purple/40';
    } else if (variant === 'card') {
      variantStyles = 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm hover:border-primary/30';
    } else {
      variantStyles = 'bg-transparent';
    }

    const paddingStyles = {
      sm: 'p-8',
      md: 'p-16',
      lg: 'p-24'
    }[size];

    return `${base} ${variantStyles} ${paddingStyles} ${className}`;
  }, [variant, size, className, isAI]);

  const iconSize = useMemo(() => {
    return {
      sm: 'lg', 
      md: 'xl', 
      lg: '2xl' 
    }[size] as any;
  }, [size]);

  return {
    containerClasses,
    iconSize,
    isAI
  };
};
