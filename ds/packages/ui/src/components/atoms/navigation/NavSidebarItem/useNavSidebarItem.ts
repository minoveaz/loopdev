import { NavSidebarItemProps, NavItemStatus } from './types';

/**
 * @hook useNavSidebarItem
 * @description Lógica para la gestión de estados, accesibilidad y estilos de interacción.
 */
export const useNavSidebarItem = (props: NavSidebarItemProps) => {
  const { 
    isActive = false, 
    isRail = false, 
    revealOnHover = false,
    status = 'enabled',
    className = '',
    onNavigate,
    onAction,
    route,
    actionId
  } = props;

  const isDisabled = status === 'disabled';
  const isComingSoon = status === 'coming-soon';
  const isInert = isDisabled || isComingSoon;

  // 1. Lógica de Interacción (Handlers)
  const handleClick = () => {
    if (isInert) return;
    if (route && onNavigate) onNavigate(route);
    if (actionId && onAction) onAction(actionId);
  };

  // 2. Composición de Clases del Contenedor (Zero Hardcoding)
  const containerClasses = `
    group relative flex items-center rounded-md border border-transparent transition-colors duration-200
    ${isRail ? 'mx-auto size-10 justify-center' : 'w-full gap-3 px-3 py-2.5'}
    ${isActive 
      ? 'bg-primary text-white dark:bg-primary dark:text-white'
      : isInert
        ? 'grayscale opacity-40 cursor-not-allowed border-transparent'
        : 'text-text-muted cursor-pointer hover:bg-accent/10 hover:!text-accent dark:hover:bg-accent/15 dark:hover:!text-accent'
    }
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 3. Clases del Texto e Icono
  const contentClasses = `transition-colors duration-300 ${ 
    isActive ? 'text-white font-bold' : 'font-medium group-hover:!text-accent'
  }`;

  // 4. Formateo del Tooltip Técnico (Historia 8)
  const technicalTooltip = isRail
    ? props.label
    : undefined;

  return {
    isRail,
    revealOnHover,
    isActive,
    isDisabled,
    isComingSoon,
    isInert,
    containerClasses,
    contentClasses,
    technicalTooltip,
    handleClick
  };
};
