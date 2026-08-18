import type { ReactNode } from 'react';
import type { NotificationItem } from '../NotificationCenter/types';

export type PlatformContextPanelMode = 'notifications' | 'assistant' | 'help' | 'profile';

export interface PlatformContextPanelProps {
  mode: PlatformContextPanelMode;
  notifications?: NotificationItem[];
  unreadCount?: number;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onRemoveNotification?: (id: string) => void;
  children?: ReactNode;
  className?: string;
}
