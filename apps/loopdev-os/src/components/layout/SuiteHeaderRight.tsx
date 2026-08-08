import { NotificationCenter, ThemeToggle, UserMenu } from '@loopdev/ui';
import type { NotificationItem } from '@/hooks/useNotifications';

interface SuiteHeaderRightProps {
  userName: string;
  userEmail?: string;
  userRole: string;
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
    <div className="flex items-center gap-3">
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
