import { TechnicalSurfaceProps } from './types';

/**
 * @hook useTechnicalSurface
 * @description Centraliza la lógica de estilos para las superficies industriales.
 */
export const useTechnicalSurface = (props: TechnicalSurfaceProps) => {
  const { 
    variant = 'surface', 
    depth = 'flat', 
    overflow = 'hidden',
    className = '',
    onClick 
  } = props;

  // 1. Mapeo de Variantes (Backgrounds)
  const variantMap = {
    surface: 'bg-white dark:bg-surface-dark',
    glass: 'bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md',
    canvas: 'bg-shell-canvas',
  };

  // 2. Mapeo de Profundidad (Bordes y Sombras)
  const depthMap = {
    flat: 'border-black/5 dark:border-white/5 shadow-none',
    raised: 'border-black/5 dark:border-white/10 shadow-xl',
    overlay: 'border-black/10 dark:border-white/20 shadow-2xl',
  };

  // 3. Mapeo de Overflow
  const overflowMap = {
    hidden: 'overflow-hidden',
    visible: 'overflow-visible',
    auto: 'overflow-auto',
  };

  // 4. Composición de clases indestructible
  const surfaceClasses = `
    relative rounded-xl border transition-all duration-300
    ${variantMap[variant]}
    ${depthMap[depth]}
    ${overflowMap[overflow]}
    ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    surfaceClasses,
    handleOnClick: onClick
  };
};
