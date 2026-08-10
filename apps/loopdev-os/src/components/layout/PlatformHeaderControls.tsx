'use client';

import type { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import {
  BrandLogo,
  NotificationCenter,
  type NotificationItem,
  ThemeToggle,
} from '@loopdev/ui';

interface PlatformHeaderActionButtonProps {
  label: string;
  title: string;
  onClick?: () => void;
  children: ReactNode;
}

export function PlatformHeaderActionButton({
  label,
  title,
  onClick,
  children,
}: PlatformHeaderActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      className="text-text-muted hover:border-accent/50 hover:text-accent focus-visible:border-accent/50 focus-visible:ring-primary group flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/50 transition-all duration-300 hover:-translate-y-px hover:bg-[linear-gradient(to_right,rgba(0,95,115,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,95,115,0.05)_1px,transparent_1px)] hover:bg-[length:12px_12px] focus-visible:bg-[linear-gradient(to_right,rgba(0,95,115,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,95,115,0.05)_1px,transparent_1px)] focus-visible:bg-[length:12px_12px] focus-visible:outline-none focus-visible:ring-2 dark:border-white/10 dark:bg-black/20 dark:hover:bg-[linear-gradient(to_right,rgba(0,95,115,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,95,115,0.08)_1px,transparent_1px)] dark:focus-visible:bg-[linear-gradient(to_right,rgba(0,95,115,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,95,115,0.08)_1px,transparent_1px)]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface PlatformHeaderControlsProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onOpenHelp?: () => void;
  onOpenAI?: () => void;
  onViewAllNotifications?: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onRemoveNotification?: (id: string) => void;
  onClearNotifications?: () => void;
}

export function PlatformHeaderControls({
  notifications,
  unreadCount,
  onOpenHelp,
  onOpenAI,
  onViewAllNotifications = () => undefined,
  onMarkAsRead = () => undefined,
  onMarkAllRead = () => undefined,
  onRemoveNotification = () => undefined,
  onClearNotifications = () => undefined,
}: PlatformHeaderControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <ThemeToggle variant="technical" size="md" />
      <PlatformHeaderActionButton
        label="Open help center"
        title="Help center"
        onClick={onOpenHelp}
      >
        <CircleHelp size={16} aria-hidden="true" />
      </PlatformHeaderActionButton>
      <NotificationCenter
        notifications={notifications}
        unreadCount={unreadCount}
        onViewAll={onViewAllNotifications}
        onMarkAsRead={onMarkAsRead}
        onMarkAllRead={onMarkAllRead}
        onRemove={onRemoveNotification}
        onClear={onClearNotifications}
      />
      <PlatformHeaderActionButton
        label="Open AI assistant"
        title="AI assistant"
        onClick={onOpenAI}
      >
        <BrandLogo variant="isotype" surface="plain" size="xs" className="shrink-0" />
      </PlatformHeaderActionButton>
    </div>
  );
}