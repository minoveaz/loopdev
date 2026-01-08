'use client';

import { useMemo } from 'react';
import { ModuleHeaderProps } from './types';

/**
 * @hook useModuleHeader
 * @description Lógica de composición y clases para la cabecera del módulo.
 */
export const useModuleHeader = (props: ModuleHeaderProps) => {
  const { 
    className = '',
    status,
    sidebarToggle
  } = props;

  // 1. Clases del Chasis (Sincronizado con tokens industriales)
  const containerClasses = `
    flex items-center gap-4 px-4 w-full
    bg-white/80 dark:bg-laboratory/80 backdrop-blur-md
    border-b border-border-technical
    transition-all duration-300
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Estilo dinámico para la altura (v3.9)
  const style = {
    height: 'var(--lpd-workspace-header-h, 48px)',
  };

  // 3. Mapeo de tonos para el Pill de Estado
  const statusClasses = useMemo(() => {
    if (!status) return '';
    const tone = status.tone || 'neutral';
    
    const toneMap = {
      neutral: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
      success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      warning: 'bg-energy-yellow/10 text-energy-yellow border-energy-yellow/20',
      danger: 'bg-danger/10 text-danger border-danger/20',
    };

    return `
      flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[9px] font-bold uppercase tracking-widest
      ${toneMap[tone as keyof typeof toneMap]}
    `.replace(/\s+/g, ' ').trim();
  }, [status]);

  return {
    containerClasses,
    style,
    statusClasses,
    hasSidebarToggle: !!sidebarToggle
  };
};
