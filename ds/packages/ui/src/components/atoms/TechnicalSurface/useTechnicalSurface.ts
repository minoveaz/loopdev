import { TechnicalSurfaceProps } from './types';

/**
 * @hook useTechnicalSurface
 * @description Centraliza la lógica de estilos para las superficies industriales.
 */
export const useTechnicalSurface = (props: TechnicalSurfaceProps) => {
  const { 
    variant = 'surface', 
    depth = 'flat', 
    className = '',
    onClick 
  } = props;

  // 1. Mapeo de Variantes (Backgrounds)
  const variantMap = {
    surface: 'bg-white dark:bg-surface-dark',
    glass: 'bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md',
    canvas: 'bg-slate-50 dark:bg-black/20',
  };

  // 2. Mapeo de Profundidad (Bordes y Sombras)
  const depthMap = {
    flat: 'border-black/5 dark:border-white/5 shadow-none',
    raised: 'border-black/5 dark:border-white/10 shadow-xl',
    overlay: 'border-black/10 dark:border-white/20 shadow-2xl',
  };

  // 3. Composición de clases indestructible
  const surfaceClasses = `
    group relative overflow-hidden rounded-xl border transition-all duration-300
    ${variantMap[variant]}
    ${depthMap[depth]}
    ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    surfaceClasses,
    handleOnClick: onClick
  };
};
