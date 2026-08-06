import { Divider, NotificationCenter, SystemStatus, ThemeToggle, UserMenu } from '@loopdev/ui';
import type { NotificationItem } from '@/hooks/useNotifications';

interface SuiteHeaderRightProps {
  userName: string;
  userEmail?: string;
  userRole: string;
  systemLabel: string;
  userId?: string;
  notifications: NotificationItem[];
  unreadCount: number;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onLogout: () => void;
  onViewAll?: () => void;
}

export function SuiteHeaderRight({
  userName,
  userEmail,
  userRole,
  systemLabel,
  userId,
  notifications,
  unreadCount,
  onOpenChange,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onClear,
  onLogout,
  onViewAll = () => {},
}: SuiteHeaderRightProps) {
  return (
    <div className="flex items-center gap-4">
      <SystemStatus state="operational" id={userId} label={systemLabel} />
      <Divider orientation="vertical" thickness="technical" className="h-4" />
      <NotificationCenter
        notifications={notifications}
        unreadCount={unreadCount}
        onOpenChange={onOpenChange}
        onMarkAsRead={onMarkAsRead}
        onMarkAllRead={onMarkAllAsRead}
        onRemove={onRemove}
        onClear={onClear}
        onViewAll={onViewAll}
      />
      <ThemeToggle variant="technical" size="md" />
      <UserMenu
        userName={userName}
        userEmail={userEmail}
        userRole={userRole}
        onOpenChange={onOpenChange}
        onLogout={onLogout}
      />
    </div>
  );
}
