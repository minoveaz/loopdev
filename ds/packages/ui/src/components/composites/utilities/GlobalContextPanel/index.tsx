'use client';

import React from 'react';
import { Bot, CircleHelp, Inbox, X } from 'lucide-react';
import { LpdText } from '../../../atoms';
import { GlobalAIAssistantPanel } from './GlobalAIAssistantPanel';
import { GlobalHelpPanel } from './GlobalHelpPanel';
import { GlobalNotificationsPanel } from './GlobalNotificationsPanel';
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
  return (
    <aside
      aria-label={MODE_LABELS[mode]}
      className={`border-border-technical bg-shell-canvas flex h-full w-full flex-col border-l ${className}`}
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
        <GlobalNotificationsPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={onMarkAsRead}
          onMarkAllRead={onMarkAllRead}
          onRemoveNotification={onRemoveNotification}
        />
      )}

      {mode === 'assistant' && (
        <GlobalAIAssistantPanel>{children}</GlobalAIAssistantPanel>
      )}

      {mode === 'help' && (
        <GlobalHelpPanel>{children}</GlobalHelpPanel>
      )}
    </aside>
  );
};

export type { GlobalContextPanelMode, GlobalContextPanelProps } from './types';
export { GlobalAIAssistantPanel } from './GlobalAIAssistantPanel';
export type { GlobalAIAssistantPanelProps } from './GlobalAIAssistantPanel';
export { GlobalHelpPanel } from './GlobalHelpPanel';
export type { GlobalHelpPanelProps } from './GlobalHelpPanel';
export { GlobalNotificationsPanel } from './GlobalNotificationsPanel';
export type { GlobalNotificationsPanelProps } from './GlobalNotificationsPanel';
