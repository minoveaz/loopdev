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

  // 1. Mapeo de Variantes de Color (Reactivo al Estándar Lab)
  const variantMap: Record<MenuItemVariant, string> = {
    default: isActive 
      ? 'bg-primary/5 text-primary' 
      : 'text-text-muted hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:text-text-main dark:hover:text-white',
    danger: 'text-danger hover:bg-danger/[0.04] hover:text-danger-vivid'
  };

  // 2. Composición de Clases del Contenedor
  const containerClasses = `
    flex items-center gap-3 px-4 py-2.5 transition-all duration-200
    outline-none select-none text-technical font-bold
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
