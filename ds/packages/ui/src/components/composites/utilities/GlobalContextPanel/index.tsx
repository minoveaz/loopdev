'use client';

import React, { useMemo, useState } from 'react';
import { Bot, Check, CircleHelp, Inbox, X } from 'lucide-react';
import { LpdText, ScrollArea } from '../../../atoms';
import type { GlobalContextPanelMode, GlobalContextPanelProps } from './types';

const MODE_LABELS: Record<GlobalContextPanelMode, string> = {
  notifications: 'Notifications',
  assistant: 'AI Assistant',
  help: 'Help & Support',
};

export const GlobalContextPanel: React.FC<GlobalContextPanelProps> = ({
  mode,
  notifications = [],
  unreadCount = 0,
  onClose,
  onMarkAsRead,
  onMarkAllRead,
  onRemoveNotification,
  children,
  className = '',
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const displayedNotifications = useMemo(
    () => notifications.filter((item) => filter === 'all' || !item.read),
    [filter, notifications],
  );

  return (
    <aside
      aria-label={MODE_LABELS[mode]}
      className={`border-border-technical dark:bg-surface-elevated flex h-full w-full flex-col border-l bg-white ${className}`}
    >
      <header className="border-border-technical flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex min-w-0 items-center gap-2">
          {mode === 'notifications' && <Inbox size={16} className="text-primary" aria-hidden="true" />}
          {mode === 'assistant' && <Bot size={16} className="text-primary" aria-hidden="true" />}
          {mode === 'help' && <CircleHelp size={16} className="text-primary" aria-hidden="true" />}
          <LpdText size="sm" weight="bold" className="text-text-main truncate dark:text-white">
            {MODE_LABELS[mode]}
          </LpdText>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close context panel"
          className="text-text-muted hover:bg-accent/10 hover:text-accent rounded-md p-1.5 transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </header>

      {mode === 'notifications' && (
        <>
          <div className="border-border-technical flex shrink-0 items-center justify-between border-b px-4 pt-3">
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
          <ScrollArea visibility="auto" className="min-h-0 flex-1">
            {displayedNotifications.length > 0 ? (
              <div className="flex flex-col">
                {displayedNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => onMarkAsRead?.(notification.id)}
                    className={`border-border-technical group flex gap-3 border-b px-4 py-4 text-left transition-colors ${notification.read ? 'hover:bg-accent/10' : 'hover:bg-accent/10 bg-[var(--lpd-color-bg-primary-subtle)]'}`}
                  >
                    <span className={`mt-1 size-2 shrink-0 rounded-full ${notification.type === 'error' ? 'bg-danger' : notification.type === 'warning' ? 'bg-energy' : 'bg-primary'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-text-main truncate text-xs font-semibold dark:text-white">{notification.title}</span>
                        {notification.read && onRemoveNotification && (
                          <span
                            role="button"
                            aria-label={`Remove ${notification.title}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              onRemoveNotification(notification.id);
                            }}
                            className="text-text-muted hover:text-danger opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X size={13} aria-hidden="true" />
                          </span>
                        )}
                      </span>
                      <span className="text-text-muted mt-1 block text-xs leading-relaxed">{notification.description}</span>
                      <span className="text-text-muted/60 mt-2 block font-mono text-[10px] uppercase">{notification.timestamp}</span>
                    </span>
                  </button>
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
      )}

      {mode === 'assistant' && (
        <div className="flex min-h-0 flex-1 flex-col">
          <ScrollArea visibility="auto" className="min-h-0 flex-1">
            {children ?? (
              <div className="flex min-h-full flex-col items-center justify-center px-8 py-12 text-center">
                <Bot size={28} className="text-primary mb-3" aria-hidden="true" />
                <p className="text-text-main text-sm font-semibold dark:text-white">How can I help?</p>
                <p className="text-text-muted mt-1 text-xs leading-relaxed">Ask about your workspace, data, or the current suite.</p>
              </div>
            )}
          </ScrollArea>
          <div className="border-border-technical shrink-0 border-t p-3">
            <div className="border-border-technical text-text-muted rounded-md border px-3 py-2 text-xs">Ask LoopDev AI...</div>
          </div>
        </div>
      )}

      {mode === 'help' && (
        <ScrollArea visibility="auto" className="min-h-0 flex-1">
          {children ?? (
            <div className="flex flex-col gap-2 p-4">
              {['Documentation', 'Contact support', 'System status', 'Community'].map((item) => (
                <button key={item} type="button" className="border-border-technical text-text-main hover:bg-accent/10 hover:text-accent flex items-center justify-between rounded-md border px-3 py-3 text-left text-xs transition-colors dark:text-white">
                  {item}
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </aside>
  );
};

export type { GlobalContextPanelMode, GlobalContextPanelProps } from './types';
