'use client';

import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { ScrollArea } from '../../../atoms';
import type { NotificationItem } from '../NotificationCenter/types';

export interface GlobalNotificationsPanelProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onRemoveNotification?: (id: string) => void;
}

export function GlobalNotificationsPanel({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllRead,
  onRemoveNotification,
}: GlobalNotificationsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const displayedNotifications = useMemo(
    () => notifications.filter((item) => filter === 'all' || !item.read),
    [filter, notifications],
  );

  return (
    <>
      <div className="border-border-technical flex shrink-0 items-center justify-between border-b bg-transparent px-4 pt-3">
        <div className="flex items-center gap-4">
          {(['all', 'unread'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`border-b-2 pb-2 text-xs font-medium capitalize transition-colors ${filter === value ? 'border-primary text-primary' : 'text-text-muted hover:text-accent border-transparent'}`}
            >
              {value}
              {value === 'unread' && unreadCount > 0 && (
                <span className="bg-primary ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={onMarkAllRead} className="text-primary hover:text-accent pb-2 text-[10px]">
            Mark all read
          </button>
        )}
      </div>
      <ScrollArea visibility="auto" className="min-h-0 flex-1 bg-transparent">
        {displayedNotifications.length > 0 ? (
          <div className="flex flex-col">
            {displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-border-technical group flex gap-3 border-b px-4 py-4 text-left transition-colors ${notification.read ? 'hover:bg-accent/10' : 'hover:bg-accent/10 bg-[var(--lpd-color-bg-primary-subtle)]'}`}
              >
                <button
                  type="button"
                  onClick={() => onMarkAsRead?.(notification.id)}
                  className="flex min-w-0 flex-1 gap-3 text-left"
                >
                  <span className={`mt-1 size-2 shrink-0 rounded-full ${notification.type === 'error' ? 'bg-danger' : notification.type === 'warning' ? 'bg-energy' : 'bg-primary'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="text-text-main block truncate text-xs font-semibold dark:text-white">{notification.title}</span>
                    <span className="text-text-muted mt-1 block text-xs leading-relaxed">{notification.description}</span>
                    <span className="text-text-muted/60 mt-2 block font-mono text-[10px] uppercase">{notification.timestamp}</span>
                  </span>
                </button>
                {notification.read && onRemoveNotification && (
                  <button
                    type="button"
                    aria-label={`Remove ${notification.title}`}
                    onClick={() => onRemoveNotification(notification.id)}
                    className="text-text-muted hover:text-danger self-start opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={13} aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-56 flex-col items-center justify-center px-6 text-center">
            <Check size={20} className="text-primary mb-2" aria-hidden="true" />
            <p className="text-text-main text-xs font-semibold dark:text-white">All caught up</p>
          </div>
        )}
      </ScrollArea>
    </>
  );
}
