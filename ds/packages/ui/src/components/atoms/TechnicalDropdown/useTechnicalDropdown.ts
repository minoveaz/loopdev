import { TechnicalDropdownProps, TechnicalDropdownItemProps } from './types';

/**
 * @hook useTechnicalDropdown
 * @description Lógica para gestionar estilos y estados de los componentes del menú.
 */
export const useTechnicalDropdown = () => {
  
  // 1. Estilo del Contenedor de Contenido (Estándar Lab v3.9)
  const getContentClasses = (className: string = '') => `
    min-w-[240px] p-0 rounded-xl border shadow-2xl overflow-hidden
    bg-white dark:bg-surface-elevated
    border-border-technical
    z-[5000] animate-in fade-in zoom-in-95 duration-200
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Estilo de los Ítems Individuales
  const getItemClasses = (props: TechnicalDropdownItemProps) => {
    const { isActive = false, disabled = false, className = '' } = props;
    
    return `
      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
      outline-none select-none
      ${isActive 
        ? 'bg-primary/5 text-primary' 
        : disabled
          ? 'opacity-40 grayscale cursor-not-allowed'
          : 'text-slate-600 dark:text-text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer'
      }
      ${className}
    `.replace(/\s+/g, ' ').trim();
  };

  // 3. Estilo de los Separadores
  const separatorClasses = `
    h-[0.5px] bg-black/5 dark:bg-white/10 my-1.5 mx-1
  `;

  return {
    getContentClasses,
    getItemClasses,
    separatorClasses
  };
};
