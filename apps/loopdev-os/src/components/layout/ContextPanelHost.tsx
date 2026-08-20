'use client';

import {
  Button,
  PlatformContextPanel,
  type PlatformContextPanelMode,
  type NotificationItem,
} from '@loopdev/ui';

type ContextPanelHostProps = {
  mode: PlatformContextPanelMode;
  notifications: NotificationItem[];
  unreadCount: number;
  onClose: () => void;
};

export function ContextPanelHost({
  mode,
  notifications,
  unreadCount,
  onClose,
}: ContextPanelHostProps) {
  return (
    <PlatformContextPanel
      mode={mode}
      notifications={notifications}
      unreadCount={unreadCount}
      onClose={onClose}
    >
      {mode === 'profile' ? (
        <div className="flex flex-col gap-3 overflow-y-auto p-4">
          <div className="border-border-technical flex flex-col gap-1 border-b pb-4">
            <span className="text-text-main text-lg font-semibold">Alex Morgan</span>
            <span className="text-text-muted text-sm">showcase@loopdev.local</span>
            <span className="text-primary text-xs font-semibold">TENANT_ADMIN</span>
          </div>
          {['Profile', 'Account Settings', 'Billing'].map((item) => (
            <Button key={item} type="button" variant="outline" className="justify-start">
              {item}
            </Button>
          ))}
          <div className="border-border-technical border-t pt-3">
            <p className="text-text-muted mb-2 text-xs font-semibold uppercase">Timezone</p>
            {['Auto detect', '(UTC) Coordinated Universal Time', '(UTC-05:00) Eastern Time'].map(
              (timezone) => (
                <Button
                  key={timezone}
                  type="button"
                  variant="ghost"
                  className="block w-full justify-start text-sm"
                >
                  {timezone}
                </Button>
              ),
            )}
          </div>
          <Button type="button" variant="danger" className="justify-start border-t pt-3 text-left">
            Sign Out
          </Button>
        </div>
      ) : null}
    </PlatformContextPanel>
  );
}
