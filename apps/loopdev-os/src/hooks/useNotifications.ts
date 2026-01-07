'use client';

import { useState, useMemo } from 'react';
import { NotificationItem } from '@loopdev/ui';

/**
 * @hook useNotifications
 * @description Gestión de estado y lógica de negocio para las alertas del sistema.
 */
export const useNotifications = (initialData: NotificationItem[] = []) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialData);

  // 1. Telemetría: Cálculo de no leídas
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
  [notifications]);

  // 2. Acción: Marcar una como leída
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // 3. Acción: Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 4. Acción: Eliminar una notificación específica
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // 5. Acción: Limpiar historial
  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };
};
