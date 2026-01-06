import { TechnicalLabelProps, TechnicalLabelVariant, TechnicalLabelSize } from './types';

/**
 * @hook useTechnicalLabel
 * @description Lógica para la gestión de estilos tipográficos de precisión.
 */
export const useTechnicalLabel = (props: TechnicalLabelProps) => {
  const { 
    variant = 'muted', 
    size = 'nano', 
    isUppercase = true,
    isWide = true,
    className = '' 
  } = props;

  // 1. Mapeo de Variantes de Color (Reactivo al Tema)
  const variantMap: Record<TechnicalLabelVariant, string> = {
    primary: 'text-primary',
    muted: 'text-text-muted/60 dark:text-text-muted/60',
    subtle: 'text-text-muted/40 dark:text-text-muted/40',
    white: 'text-slate-900 dark:text-white',
  };

  // 2. Mapeo de Tamaños y Pesos
  const sizeMap: Record<TechnicalLabelSize, string> = {
    nano: 'text-[8px]',
    xs: 'text-lpd-xs',
  };

  // 3. Composición de Clases Finales (Zero Hardcoding)
  const labelClasses = `
    font-black leading-none select-none
    ${variantMap[variant]}
    ${sizeMap[size]}
    ${isUppercase ? 'uppercase' : ''}
    ${isWide ? 'tracking-[0.3em]' : 'tracking-widest'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    labelClasses
  };
};
