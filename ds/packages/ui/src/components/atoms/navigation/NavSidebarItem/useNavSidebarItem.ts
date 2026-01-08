import { NavSidebarItemProps, NavItemStatus } from './types';

/**
 * @hook useNavSidebarItem
 * @description Lógica para la gestión de estados, accesibilidad y estilos de interacción.
 */
export const useNavSidebarItem = (props: NavSidebarItemProps) => {
  const { 
    isActive = false, 
    isRail = false, 
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
    group relative flex items-center transition-all duration-300 rounded-xl border
    ${isRail ? 'justify-center w-10 h-10 mx-auto' : 'px-4 py-2.5 gap-3 w-full'}
    ${isActive 
      ? 'bg-primary/5 border-primary-light/20 dark:border-primary/20 shadow-lg shadow-primary/5' 
      : isInert
        ? 'grayscale opacity-40 cursor-not-allowed border-transparent'
        : 'text-slate-500 dark:text-text-muted hover:bg-primary/5 border-transparent cursor-pointer'
    }
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 3. Clases del Texto e Icono
  const contentClasses = `transition-colors duration-300 ${ 
    isActive ? 'text-slate-900 dark:text-white font-bold' : 'font-medium group-hover:text-primary'
  }`;

  // 4. Formateo del Tooltip Técnico (Historia 8)
  const technicalTooltip = isRail 
    ? `${props.label}\n[Status: ${status.toUpperCase().replace('-', '_')}]`
    : undefined;

  return {
    isRail,
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
