'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { 
  TechnicalDropdown, 
  ScrollArea
} from '../../atoms';
import { NotificationCenterProps } from './types';
import { useNotificationCenter } from './useNotificationCenter';
import { 
  CenterHeader, 
  NotificationCard, 
  CenterFooter, 
  EmptyView 
} from './components';

/**
 * @component NotificationCenter
 * @description Centro de alertas y eventos del sistema. 
 * Réplica exacta del Laboratory System utilizando tokens institucionales.
 * @category Composites
 * @phase 1
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = (props) => {
  const { onViewAll, onMarkAsRead, onMarkAllRead, onClear, onRemove, onOpenChange } = props;
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isOpen, setIsOpen] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    badgeClasses, 
    isEmpty 
  } = useNotificationCenter(props);

  // Lógica de filtrado para la vista previa
  const displayedNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <TechnicalDropdown 
      align="end" 
      open={isOpen}
      onOpenChange={handleOpenChange}
      className="w-full max-w-sm p-0 overflow-hidden bg-white dark:bg-surface-elevated shadow-2xl border-none" 
      trigger={
        <button className="relative p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all group" aria-label="Abrir centro de notificaciones">
          <Bell size={18} className="text-text-muted group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <div className={badgeClasses}>
              {unreadCount > 99 ? '+99' : unreadCount}
            </div>
          )}
        </button>
      }
    >
      <div className="flex flex-col w-[320px]">
        {/* 1. Cabecera con Tabs */}
        <CenterHeader 
          unreadCount={unreadCount}
          filter={filter}
          onFilterChange={setFilter}
          onMarkAllRead={() => onMarkAllRead?.()}
        />

        {/* 2. Área de Contenido Scrollable */}
        <ScrollArea visibility="auto" className="max-h-[320px] min-h-[200px] bg-white dark:bg-surface-elevated">
          {displayedNotifications.length > 0 ? (
            <div className="flex flex-col">
              {displayedNotifications.map((notif) => (
                <NotificationCard 
                  key={notif.id} 
                  item={notif} 
                  onRead={(id) => onMarkAsRead?.(id)}
                  onRemove={(id) => onRemove?.(id)}
                />
              ))}
            </div>
          ) : (
            <EmptyView filter={filter} />
          )}
        </ScrollArea>

        {/* 3. Pie de Página */}
        <CenterFooter 
          onViewAll={onViewAll}
          onClear={() => onClear?.()}
        />
      </div>
    </TechnicalDropdown>
  );
};
