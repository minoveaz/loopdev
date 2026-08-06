import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el centro de notificaciones global.
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  /** ID único de la notificación */
  id: string;
  /** Título corto */
  title: string;
  /** Mensaje descriptivo */
  description: string;
  /** Marca de tiempo (ej: 2m ago) */
  timestamp: string;
  /** Tipo de alerta */
  type: NotificationType;
  /** Indica si ya ha sido leída */
  read?: boolean;
}

export interface NotificationCenterProps {
  /** Lista de notificaciones recientes */
  notifications: NotificationItem[];
  /** Número total de no leídas */
  unreadCount: number;
  /** Callback para marcar una como leída */
  onMarkAsRead?: (id: string) => void;
  /** Callback para marcar todas como leídas */
  onMarkAllRead?: () => void;
  /** Callback para eliminar una notificación */
  onRemove?: (id: string) => void;
  /** Callback para limpiar la lista */
  onClear?: () => void;
  /** Callback para abrir el panel completo */
  onViewAll: () => void;
  /** Callback al cambiar el estado de apertura */
  onOpenChange?: (open: boolean) => void;
  /** Clase CSS adicional */
  className?: string;
}
