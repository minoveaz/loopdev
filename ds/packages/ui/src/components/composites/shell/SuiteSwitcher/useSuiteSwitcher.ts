import { SuiteSwitcherProps } from './types';

/**
 * @hook useSuiteSwitcher
 * @description Lógica para gestionar la identidad de la suite y el estado del menú.
 */
export const useSuiteSwitcher = (props: SuiteSwitcherProps) => {
  const { currentSuite, className = '' } = props;

  // 1. Composición de Clases del Trigger (Botón del Header)
  const triggerClasses = `
    flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-300
    hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer select-none
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Estilo del Menú Desplegable (Cápsula Técnica)
  const menuContentClasses = `
    min-w-[220px] p-1.5 rounded-xl border shadow-2xl animate-in fade-in zoom-in-95 duration-200
    bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl
    border-black/5 dark:border-white/10
  `.replace(/\s+/g, ' ').trim();

  // 3. Estilo de los Ítems del Menú
  const getItemClasses = (isActive: boolean, isDisabled: boolean) => `
    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
    outline-none select-none
    ${isActive 
      ? 'bg-primary/5 text-primary' 
      : isDisabled
        ? 'opacity-40 grayscale cursor-not-allowed'
        : 'text-slate-600 dark:text-text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer'
    }
  `.replace(/\s+/g, ' ').trim();

  return {
    triggerClasses,
    menuContentClasses,
    getItemClasses,
    currentSuite
  };
};
