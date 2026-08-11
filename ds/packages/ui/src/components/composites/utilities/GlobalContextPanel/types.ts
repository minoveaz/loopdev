import type { ReactNode } from 'react';
import type { NotificationItem } from '../NotificationCenter/types';

export type GlobalContextPanelMode = 'notifications' | 'assistant' | 'help';

export interface GlobalContextPanelProps {
  mode: GlobalContextPanelMode;
  notifications?: NotificationItem[];
  unreadCount?: number;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onRemoveNotification?: (id: string) => void;
  children?: ReactNode;
  className?: string;
}
