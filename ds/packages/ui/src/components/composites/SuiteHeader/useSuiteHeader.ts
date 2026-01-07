import { SuiteHeaderProps } from './types';

/**
 * @hook useSuiteHeader
 * @description Lógica para gestionar los estados visuales y de interacción del header.
 */
export const useSuiteHeader = (props: SuiteHeaderProps) => {
  const { isInert = false, className = '' } = props;

  // 1. Composición de Clases del Contenedor (Chasis Inmutable)
  const containerClasses = `
    w-full border-b flex items-center px-4 md:px-6
    transition-all duration-500 select-none
    border-border-technical
    bg-shell-canvas
    ${isInert ? 'pointer-events-none cursor-default shadow-none' : 'shadow-sm'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Estilos para la altura sincronizada con el chasis
  const style = {
    height: 'var(--app-shell-header-height, 56px)',
  };

  return {
    containerClasses,
    style
  };
};
