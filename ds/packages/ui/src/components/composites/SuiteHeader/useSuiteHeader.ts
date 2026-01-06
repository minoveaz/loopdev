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
    transition-colors duration-300 select-none
    border-black/5 dark:border-white/10
    bg-white/80 dark:bg-background-dark/80
    dark:backdrop-blur-md
    ${isInert ? 'pointer-events-none opacity-50' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Estilos para la altura fija industrial
  const style = {
    height: 'var(--lpd-header-height, 56px)',
  };

  return {
    containerClasses,
    style
  };
};
