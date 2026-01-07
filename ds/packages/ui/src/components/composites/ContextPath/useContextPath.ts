import { useMemo } from 'react';
import { ContextPathProps, PathSegment } from './types';

/**
 * @hook useContextPath
 * @description Lógica para el colapso progresivo y gestión de segmentos de ruta.
 */
export const useContextPath = (props: ContextPathProps) => {
  const { 
    segments, 
    maxVisible = 3, 
    className = '',
    onNavigate 
  } = props;

  // 1. Algoritmo de Colapso Inteligente (Historia de Estrés #1)
  const processedSegments = useMemo(() => {
    if (segments.length <= maxVisible) return segments;

    // Si supera el límite, mostramos el primero, elipsis, y los últimos
    const first = segments[0];
    const lastItems = segments.slice(- (maxVisible - 1));
    
    return [
      first,
      { id: 'ellipsis', label: '...', isActive: false } as PathSegment,
      ...lastItems
    ];
  }, [segments, maxVisible]);

  // 2. Composición de Clases del Contenedor
  const containerClasses = `
    flex items-center gap-2 select-none
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 3. Estilos de los Segmentos
  const getSegmentClasses = (isActive: boolean, isEllipsis: boolean) => `
    transition-all duration-200 rounded px-1 -mx-1
    ${isActive 
      ? 'text-slate-900 dark:text-white font-bold' 
      : 'text-text-muted hover:text-primary cursor-pointer'
    }
    ${isEllipsis ? 'cursor-default hover:text-text-muted' : ''}
  `.replace(/\s+/g, ' ').trim();

  return {
    processedSegments,
    containerClasses,
    getSegmentClasses,
    handleNavigate: onNavigate
  };
};
