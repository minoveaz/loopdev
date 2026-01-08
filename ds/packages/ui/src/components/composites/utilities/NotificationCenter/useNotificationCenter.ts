import { NotificationCenterProps, NotificationType } from './types';

/**
 * @hook useNotificationCenter
 * @description Lógica para gestionar el resumen de notificaciones y estilos de alerta.
 */
export const useNotificationCenter = (props: NotificationCenterProps) => {
  const { notifications, unreadCount, className = '' } = props;

  // 1. Limitar a las 3 más recientes para el resumen del header
  const recentNotifications = notifications.slice(0, 3);

  // 2. Mapeo de Colores y Estados
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'error': return 'text-danger';
      case 'warning': return 'text-energy-yellow';
      case 'success': return 'text-emerald-500';
      default: return 'text-primary';
    }
  };

  // 3. Clases para el Badge de Alerta
  const badgeClasses = `
    absolute -top-1 -right-1 flex items-center justify-center
    min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black
    bg-danger text-white shadow-lg border border-white dark:border-background-dark
    animate-in zoom-in duration-300
  `.replace(/\s+/g, ' ').trim();

  return {
    notifications,
    recentNotifications,
    unreadCount,
    getNotificationColor,
    badgeClasses,
    isEmpty: notifications.length === 0,
    className
  };
};
