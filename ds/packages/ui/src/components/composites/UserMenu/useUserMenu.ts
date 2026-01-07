import { UserMenuProps } from './types';

/**
 * @hook useUserMenu
 * @description Lógica para gestionar la identidad y estados del menú de usuario.
 */
export const useUserMenu = (props: UserMenuProps) => {
  const { userName, userEmail, userRole = 'USER', className = '' } = props;

  // 1. Formateo de Identidad
  // Truncamos el email si es demasiado largo para el header del menú
  const displayEmail = userEmail && userEmail.length > 24 
    ? `${userEmail.substring(0, 20)}...` 
    : userEmail;

  // 2. Formateo de Rol Técnico (Historia 4)
  const formattedRole = userRole.toUpperCase().replace(' ', '_');

  // 3. Composición de Clases del Header del Menú
  const headerClasses = `
    px-3 py-3 border-b border-black/5 dark:border-white/5 flex flex-col gap-0.5
  `.replace(/\s+/g, ' ').trim();

  return {
    userName,
    displayEmail,
    formattedRole,
    headerClasses,
    className
  };
};
