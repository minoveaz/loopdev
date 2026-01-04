import { BrandLogoProps, BrandLogoSize } from './types';

export const useBrandLogo = (props: BrandLogoProps) => {
  const { 
    variant = 'full', 
    size = 'md', 
    className = '',
    colorMode 
  } = props;

  // Mapeo de tamaños industriales
  const sizeMap: Record<BrandLogoSize, { box: string, icon: string, text: string, gap: string }> = {
    xs: { box: 'w-6 h-6 rounded', icon: 'text-[12px]', text: 'text-[10px]', gap: 'gap-1' },
    sm: { box: 'w-8 h-8 rounded-lg', icon: 'text-[16px]', text: 'text-[14px]', gap: 'gap-2' },
    md: { box: 'w-10 h-10 rounded-xl', icon: 'text-[20px]', text: 'text-[18px]', gap: 'gap-3' },
    lg: { box: 'w-14 h-14 rounded-2xl', icon: 'text-[28px]', text: 'text-[24px]', gap: 'gap-4' },
    xl: { box: 'w-20 h-20 rounded-[24px]', icon: 'text-[40px]', text: 'text-[32px]', gap: 'gap-6' },
  };

  const currentSize = sizeMap[size];

  // Lógica de clases para el contenedor principal
  const containerClasses = `inline-flex items-center ${currentSize.gap} ${className}`;

  // Lógica de clases para el texto (Reactividad de tema)
  const textClasses = `font-black tracking-tighter ${currentSize.text} ${
    colorMode === 'dark' ? 'text-white' : 
    colorMode === 'light' ? 'text-slate-900' : 
    'text-slate-900 dark:text-white'
  }`;

  return {
    variant,
    currentSize,
    containerClasses,
    textClasses
  };
};
