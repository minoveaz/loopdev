'use client';

import { ModuleToolbarProps } from './types';

/**
 * @hook useModuleToolbar
 * @description Lógica de composición y clases para la barra de herramientas del módulo.
 */
export const useModuleToolbar = (props: ModuleToolbarProps) => {
  const { 
    className = '',
    contextSlot,
    leftSlot,
    centerSlot,
    rightSlot,
    selection,
    density = 'comfortable',
    rows = 1,
  } = props;

  // 1. Clases del Chasis
  const containerClasses = `
    grid items-center w-full min-w-0 px-4 border-b border-border-technical
    bg-shell-canvas/50 backdrop-blur-sm
    ${density === 'compact' ? 'gap-2' : 'gap-4'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Estilo dinámico para la altura (v3.9)
  const style = rows === 2
    ? { minHeight: 'var(--lpd-workspace-toolbar-h, 44px)' }
    : { height: 'var(--lpd-workspace-toolbar-h, 44px)' };

  // 3. Determinar si el toolbar debe renderizarse (Situational)
  const shouldRender = !!(contextSlot || leftSlot || centerSlot || rightSlot || selection?.count);

  return {
    containerClasses,
    style,
    shouldRender,
    isSelectionActive: !!(selection && selection.count > 0),
    layoutClasses:
      rows === 2
        ? 'grid-cols-2 grid-rows-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-1'
        : 'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
  };
};
