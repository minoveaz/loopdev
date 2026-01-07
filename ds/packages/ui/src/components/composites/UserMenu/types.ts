import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el menú de perfil de usuario UserMenu.
 */

export interface UserMenuProps {
  /** Nombre completo o identificador del usuario */
  userName: string;
  /** Correo electrónico */
  userEmail?: string;
  /** Rol técnico del usuario (ej: Admin, Editor) */
  userRole?: string;
  /** URL opcional de la foto de perfil */
  userSrc?: string | null;
  /** Indica si está en modo Rail (para adaptar el trigger) */
  isRail?: boolean;
  
  /** Callback para cerrar sesión */
  onLogout: () => void;
  /** Callback para ir a los ajustes de perfil */
  onProfileClick?: () => void;
  /** Callback para ir a facturación */
  onBillingClick?: () => void;
  
  /** Clase CSS adicional */
  className?: string;
}
