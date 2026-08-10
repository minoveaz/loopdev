import { TechnicalDropdownItemProps } from './types';

/**
 * @hook useTechnicalDropdown
 * @description Lógica para gestionar estilos y estados de los componentes del menú.
 */
export const useTechnicalDropdown = () => {
  
  // 1. Surface compartida: compacta, estable y consistente entre menús.
  const getContentClasses = (className: string = '') => `
    w-[min(260px,calc(100vw-2rem))] p-1 rounded-md border shadow-lg overflow-hidden
    bg-white dark:bg-surface-elevated
    border-border-technical
    z-[5000] animate-in fade-in duration-150
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Filas de altura estable, sin desplazamiento ni redondeado de tarjeta.
  const getItemClasses = (props: TechnicalDropdownItemProps) => {
    const { isActive = false, disabled = false, className = '' } = props;
    
    return `
      flex min-h-9 items-center gap-2.5 rounded-sm px-3 py-2 text-[13px] font-normal transition-colors duration-150
      outline-none select-none
      ${isActive 
        ? 'bg-[var(--lpd-color-bg-primary-subtle)] text-primary'
        : disabled
          ? 'opacity-40 grayscale cursor-not-allowed'
          : 'text-slate-600 dark:text-text-muted hover:bg-accent/10 dark:hover:bg-accent/10 hover:text-accent cursor-pointer'
      }
      ${className}
    `.replace(/\s+/g, ' ').trim();
  };

  // 3. Separadores de grupo de un solo píxel.
  const separatorClasses = `
    h-px bg-border-technical my-1
  `;

  return {
    getContentClasses,
    getItemClasses,
    separatorClasses
  };
};
