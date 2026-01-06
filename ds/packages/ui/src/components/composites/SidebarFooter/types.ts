import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el cierre semántico SidebarFooter.
 */

export interface SidebarFooterProps {
  /** Indica si el sidebar está en modo contraído */
  isRail?: boolean;
  /** Nombre del usuario para el avatar y texto */
  userName: string;
  /** Rol o subtítulo del usuario */
  userRole?: string;
  /** URL opcional de la imagen de perfil */
  userSrc?: string | null;
  /** Slot opcional para acciones adicionales */
  extraActionsSlot?: ReactNode;
  
  /** Callback para alternar el modo del sidebar */
  onToggleRail: () => void;
  /** Callback para abrir ajustes */
  onSettingsClick?: () => void;
  /** Clase CSS adicional */
  className?: string;
}
