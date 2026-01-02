
import { useState, useCallback } from 'react';
import { type Notification, INITIAL_NOTIFICATIONS } from '@blueprints/components/functional/NotificationCenter/utils';

export const useNotificationSystem = (initialData: Notification[] = INITIAL_NOTIFICATIONS) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialData);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'isRead'>) => {
    const newNote: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      isRead: false
    };
    setNotifications(prev => [newNote, ...prev]);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    addNotification
  };
};
