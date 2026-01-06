import { ExitHatchProps } from './types';

/**
 * @hook useExitHatch
 * @description Lógica para la gestión de animaciones de salida y composición de estilos.
 */
export const useExitHatch = (props: ExitHatchProps) => {
  const { isRail = false, className = '' } = props;

  // 1. Composición de Clases del Contenedor (Zero Hardcoding)
  const containerClasses = `
    flex items-center gap-3 transition-all duration-300 group cursor-pointer
    text-text-muted hover:text-slate-900 dark:hover:text-white
    ${isRail ? 'justify-center w-full py-4' : 'px-4 py-3 w-full'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Clases para el Icono (Animación de retroceso)
  const iconClasses = `
    transition-transform duration-300 transform
    group-hover:-translate-x-1
    ${isRail ? 'size-5' : 'size-4'}
  `.replace(/\s+/g, ' ').trim();

  // 3. Clases para el Texto
  const textClasses = `
    uppercase tracking-widest text-[9px] font-black
  `;

  return {
    containerClasses,
    iconClasses,
    textClasses,
    isRail
  };
};
