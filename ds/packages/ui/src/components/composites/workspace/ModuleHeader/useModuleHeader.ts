'use client';

import { ModuleHeaderProps } from './types';

/**
 * @hook useModuleHeader
 * @description Lógica de composición para la cabecera industrial de nivel 2.
 */
export const useModuleHeader = (props: ModuleHeaderProps) => {
  const { 
    className = '',
    sidebarToggle
  } = props;

  // 1. Clases del Chasis (Foco en transparencia y bordes técnicos)
  const containerClasses = `
    w-full transition-all duration-300
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    containerClasses,
    hasSidebarToggle: !!sidebarToggle
  };
};