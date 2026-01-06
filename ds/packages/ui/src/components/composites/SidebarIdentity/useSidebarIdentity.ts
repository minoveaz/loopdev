import { SidebarIdentityProps } from './types';

/**
 * @hook useSidebarIdentity
 * @description Lógica para gestionar la densidad y los estilos de la cabecera de identidad.
 */
export const useSidebarIdentity = (props: SidebarIdentityProps) => {
  const { isRail = false, className = '', onClick } = props;

  // 1. Gestión de Padding Dinámico (Historia de Estrés #2)
  const containerClasses = `
    shrink-0 flex flex-col gap-6 transition-all duration-300
    ${isRail ? 'p-2 py-8 items-center' : 'p-6'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Lógica de Alineación de Logo
  const logoWrapperClasses = `
    flex items-center group/identity
    ${isRail ? 'justify-center' : 'gap-4'}
    ${onClick ? 'cursor-pointer' : ''}
  `.replace(/\s+/g, ' ').trim();

  return {
    containerClasses,
    logoWrapperClasses,
    handleOnClick: onClick
  };
};
