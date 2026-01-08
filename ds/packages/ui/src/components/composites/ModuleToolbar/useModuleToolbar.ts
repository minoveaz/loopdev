'use client';

import { ModuleToolbarProps } from './types';

/**
 * @hook useModuleToolbar
 * @description Lógica de composición y clases para la barra de herramientas del módulo.
 */
export const useModuleToolbar = (props: ModuleToolbarProps) => {
  const { 
    className = '',
    left,
    center,
    right,
    selection,
    density = 'comfortable'
  } = props;

  // 1. Clases del Chasis
  const containerClasses = `
    flex items-center w-full px-4 border-b border-border-technical
    bg-shell-canvas/50 backdrop-blur-sm
    ${density === 'compact' ? 'gap-2' : 'gap-4'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Estilo dinámico para la altura (v3.9)
  const style = {
    height: 'var(--lpd-workspace-toolbar-h, 44px)',
  };

  // 3. Determinar si el toolbar debe renderizarse (Situational)
  const shouldRender = !!(left || center || right || selection?.count);

  return {
    containerClasses,
    style,
    shouldRender,
    isSelectionActive: !!(selection && selection.count > 0)
  };
};
