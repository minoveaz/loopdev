import { cn } from '@/helpers/cn';

/**
 * @hook useIcon
 * @description Estilos oficiales para la primitiva Icon en producción.
 */
export const useIcon = (props: any) => {
  const { 
    size = 'md', 
    variant = 'standard', 
    color, 
    className = '' 
  } = props;

  const sizeMap: Record<string, string> = {
    sm: 'text-[12px]',
    md: 'text-[16px]',
    lg: 'text-[20px]',
    xl: 'text-[24px]',
  };

  const containerSizes: Record<string, string> = {
    sm: 'w-6 h-6 rounded-md',
    md: 'w-8 h-8 rounded-lg',
    lg: 'w-10 h-10 rounded-xl',
    xl: 'w-12 h-12 rounded-2xl',
  };

  const iconClassName = cn(
    'material-symbols-outlined select-none block leading-none',
    sizeMap[size] || sizeMap.md,
    variant === 'boxed' ? 'text-white' : '',
    className
  );

  const containerClassName = variant === 'boxed' ? cn(
    'bg-[var(--lpd-color-brand-primary)] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 ring-1 ring-white/10',
    containerSizes[size] || containerSizes.md
  ) : '';

  return {
    iconClassName,
    containerClassName,
    finalColor: color || (variant === 'boxed' ? '#FFFFFF' : 'currentColor')
  };
};
