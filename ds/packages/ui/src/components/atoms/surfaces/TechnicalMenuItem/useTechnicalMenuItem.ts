import { TechnicalMenuItemProps, MenuItemVariant } from './types';

/**
 * @hook useTechnicalMenuItem
 * @description Lógica para la composición de clases y estados de un ítem de menú.
 */
export const useTechnicalMenuItem = (props: TechnicalMenuItemProps) => {
  const { 
    variant = 'default', 
    isActive = false, 
    isDisabled = false, 
    className = '' 
  } = props;

  // 1. Variantes semánticas sobre la misma fila base del dropdown.
  const variantMap: Record<MenuItemVariant, string> = {
    default: isActive 
      ? 'bg-[var(--lpd-color-bg-primary-subtle)] text-primary'
      : 'text-slate-600 dark:text-text-muted hover:bg-accent/10 dark:hover:bg-accent/15 hover:!text-accent dark:hover:!text-accent',
    danger: 'text-danger hover:bg-danger/[0.04] hover:text-danger-vivid'
  };

  // 2. Misma densidad y geometría que TechnicalDropdownItem.
  const containerClasses = `
    flex min-h-9 items-center gap-2.5 rounded-sm px-3 py-2 text-[13px] font-normal transition-colors duration-150
    outline-none select-none
    ${isDisabled ? 'opacity-40 grayscale cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
    ${variantMap[variant]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 3. Clases para el Atajo (Shortcut)
  const shortcutClasses = `
    ml-auto font-mono text-micro opacity-40 group-hover:opacity-100 transition-opacity
  `;

  return {
    containerClasses,
    shortcutClasses,
    iconSize: 16
  };
};
