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
    actionId,
    variant = 'default',
  } = props;

  const isDisabled = status === 'disabled' || status === 'forbidden';
  const isComingSoon = status === 'coming-soon';
  const isInert = isDisabled || isComingSoon;
  const isContextualAction = variant === 'contextual-action';

  // 1. Lógica de Interacción (Handlers)
  const handleClick = () => {
    if (isInert) return;
    if (route && onNavigate) onNavigate(route);
    if (actionId && onAction) onAction(actionId);
  };

  // 2. Composición de Clases del Contenedor (Zero Hardcoding)
  const containerClasses = `
    group relative flex items-center rounded-md border border-transparent transition-colors duration-200
    ${isContextualAction ? 'min-w-0 gap-3 rounded-md border border-primary/30 bg-primary/10 p-2 text-left text-xs font-semibold text-primary hover:bg-primary hover:text-white' : isRail ? 'mx-auto size-10 justify-center' : 'w-full gap-3 px-3 py-2.5'}
    ${
      isContextualAction
        ? ''
        : isActive
        ? 'border-l-4 border-l-[var(--lpd-color-brand-primary)] bg-[var(--lpd-color-bg-primary-subtle)] text-slate-800 dark:text-white shadow-[inset_4px_0_0_var(--lpd-color-brand-primary)]'
        : isInert
          ? 'grayscale opacity-40 cursor-not-allowed border-transparent'
          : 'text-text-muted cursor-pointer hover:border-primary/20 hover:bg-surface-elevated hover:!text-text-main dark:hover:border-primary/30 dark:hover:bg-surface-dark dark:hover:!text-text-main'
    }
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  // 3. Clases del Texto e Icono
  const contentClasses = `transition-colors duration-300 ${
    isActive ? 'text-slate-800 font-semibold dark:text-white' : 'font-medium group-hover:!text-text-main'
  }`;

  // 4. Formateo del Tooltip Técnico (Historia 8)
  const technicalTooltip = isRail && !revealOnHover ? props.label : undefined;

  return {
    isRail,
    revealOnHover,
    isActive,
    isDisabled,
    isComingSoon,
    isForbidden: status === 'forbidden',
    isInert,
    containerClasses,
    contentClasses,
    technicalTooltip,
    handleClick,
  };
};
