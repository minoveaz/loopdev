
import React, { useState } from 'react';
import { ErrorBoundary } from '@blueprints/components/functional/ErrorBoundary/index';
import { useNotificationSystem } from '@blueprints/components/functional/NotificationCenter/useNotificationSystem';
import { CenterContainer, CenterHeader, NotificationItem, CenterFooter, EmptyView } from '@blueprints/components/functional/NotificationCenter/components';

export interface NotificationCenterProps {
  className?: string;
  onViewAll?: () => void;
}

const NotificationCenterContent: React.FC<NotificationCenterProps> = ({ className, onViewAll }) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotificationSystem();

  const displayedNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <CenterContainer className={className}>
      <CenterHeader 
        unreadCount={unreadCount} 
        onMarkAllRead={markAllAsRead} 
        filter={filter}
        onFilterChange={setFilter}
      />
      
      <div className="flex flex-col max-h-[320px] overflow-y-auto custom-scrollbar relative min-h-[200px]">
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              item={notification} 
              onRead={markAsRead}
              onRemove={removeNotification}
            />
          ))
        ) : (
          <EmptyView filter={filter} />
        )}
      </div>

      <CenterFooter onClear={clearAll} onViewAll={onViewAll} />
    </CenterContainer>
  );
};

export const NotificationCenter: React.FC<NotificationCenterProps> = (props) => (
  <ErrorBoundary>
    <NotificationCenterContent {...props} />
  </ErrorBoundary>
);
