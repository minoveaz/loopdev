import { ScrollAreaProps } from './types';

/**
 * @hook useScrollArea
 * @description Lógica para gestionar las clases de la barra de scroll técnica.
 */
export const useScrollArea = (props: ScrollAreaProps) => {
  const { visibility = 'auto', className = '' } = props;

  // 1. Lógica de Clases de Scroll
  // La clase `custom-scrollbar` ya está definida globalmente en globals.css
  const containerClasses = `
    overflow-y-auto overflow-x-hidden custom-scrollbar h-full w-full
    ${visibility === 'hidden' ? 'scrollbar-hide' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    containerClasses
  };
};
