import { SidebarFooterProps } from './types';

/**
 * @hook useSidebarFooter
 * @description Lógica para gestionar la disposición de la consola de control y el perfil.
 */
export const useSidebarFooter = (props: SidebarFooterProps) => {
  const { isRail = false, className = '' } = props;

  // 1. Contenedor Principal (Cierre Semántico)
  const containerClasses = `
    shrink-0 mt-auto p-4 border-t-[0.5px] border-black/5 dark:border-white/10
    bg-black/[0.01] dark:bg-white/[0.01] flex flex-col gap-5
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Bloque de Consola Técnica (Congruencia Visual)
  const consoleClasses = `
    flex items-center gap-2
    ${isRail 
      ? 'flex-col' 
      : 'justify-between bg-black/5 dark:bg-white/5 p-1.5 rounded-xl border border-black/5 dark:border-white/5'
    }
  `.replace(/\s+/g, ' ').trim();

  // 3. Estilo de Botón Técnico (Unificado)
  const technicalButtonClasses = `
    p-1.5 rounded-md text-text-muted hover:text-primary transition-all flex items-center justify-center
    ${isRail ? 'w-10 h-10 border border-black/5 dark:border-white/10 bg-white dark:bg-black/20 shadow-sm' : ''}
  `.replace(/\s+/g, ' ').trim();

  return {
    isRail,
    containerClasses,
    consoleClasses,
    technicalButtonClasses
  };
};
