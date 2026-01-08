import { IdentityBarProps, IdentityBarOrientation, IdentityBarSize } from './types';

/**
 * @hook useIdentityBar
 * @description Lógica para gestionar las dimensiones y estilos de la barra de identidad.
 */
export const useIdentityBar = (props: IdentityBarProps) => {
  const { 
    color = 'var(--lpd-color-brand-primary)', 
    orientation = 'vertical', 
    size = 'md',
    withGlow = false,
    className = '' 
  } = props;

  // 1. Mapeo de Dimensiones según Orientación y Tamaño
  const dimensionMap: Record<IdentityBarOrientation, Record<IdentityBarSize, string>> = {
    vertical: {
      technical: 'w-[0.5px] h-4',
      sm: 'w-0.5 h-4',
      md: 'w-0.5 h-6',
      lg: 'w-1 h-8',
    },
    horizontal: {
      technical: 'h-[0.5px] w-4',
      sm: 'h-0.5 w-4',
      md: 'h-0.5 w-6',
      lg: 'h-1 w-8',
    }
  };

  const currentDimensions = dimensionMap[orientation][size];

  // 2. Composición de Clases
  const barClasses = `
    rounded-full transition-all duration-500 shrink-0
    ${currentDimensions}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 3. Estilo dinámico para el color y el resplandor
  const style = {
    backgroundColor: color,
    boxShadow: withGlow ? `0 0 10px ${color}` : undefined
  };

  return {
    barClasses,
    style
  };
};
