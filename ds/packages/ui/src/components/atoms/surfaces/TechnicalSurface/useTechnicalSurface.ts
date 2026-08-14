import { TechnicalSurfaceProps } from './types';

/**
 * @hook useTechnicalSurface
 * @description Centraliza la lógica de estilos para las superficies industriales.
 */
export const useTechnicalSurface = (props: TechnicalSurfaceProps) => {
  const { 
    variant = 'surface', 
    depth = 'flat', 
    radius = 'xl',
    border = 'subtle',
    borderWidth = 'thin',
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
    flat: 'shadow-none',
    raised: 'shadow-xl',
    overlay: 'shadow-2xl',
  };

  const radiusMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  const borderMap = {
    subtle: 'border-border-subtle dark:border-border-subtle',
    technical: 'border-border-technical dark:border-border-technical',
    strong: 'border-slate-400 dark:border-white/25',
  };

  const borderWidthMap = {
    thin: 'border',
    medium: 'border-2',
  };

  // 3. Mapeo de Overflow
  const overflowMap = {
    hidden: 'overflow-hidden',
    visible: 'overflow-visible',
    auto: 'overflow-auto',
  };

  // 4. Composición de clases indestructible
  const surfaceClasses = `
    relative transition-all duration-300
    ${variantMap[variant]}
    ${depthMap[depth]}
    ${radiusMap[radius]}
    ${borderMap[border]}
    ${borderWidthMap[borderWidth]}
    ${overflowMap[overflow]}
    ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    surfaceClasses,
    handleOnClick: onClick
  };
};
