/**
 * @file types.ts
 * @description Contratos de tipado para el átomo UserAvatar.
 */

export type UserAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type UserAvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface UserAvatarProps {
  /** URL de la imagen de perfil */
  src?: string | null;
  /** Nombre completo para generar iniciales */
  name?: string;
  /** Iniciales explícitas (opcional) */
  initials?: string;
  /** Tamaño industrial del componente */
  size?: UserAvatarSize;
  /** Estado de presencia del usuario */
  status?: UserAvatarStatus;
  /** Mostrar u ocultar el pulso de estado */
  withStatus?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
