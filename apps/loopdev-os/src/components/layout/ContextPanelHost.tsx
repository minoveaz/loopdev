'use client';

import {
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

export function ContextPanelHost({ mode, notifications, unreadCount, onClose }: ContextPanelHostProps) {
  return (
    <PlatformContextPanel mode={mode} notifications={notifications} unreadCount={unreadCount} onClose={onClose}>
        {mode === 'profile' ? (
          <div className="flex flex-col gap-3 overflow-y-auto p-4">
            <div className="border-border-technical flex flex-col gap-1 border-b pb-4">
              <span className="text-text-main text-lg font-semibold">Alex Morgan</span>
              <span className="text-text-muted text-sm">showcase@loopdev.local</span>
              <span className="text-primary text-xs font-semibold">TENANT_ADMIN</span>
            </div>
            {['Profile', 'Account Settings', 'Billing'].map((item) => (
              <button key={item} type="button" className="border-border-technical text-text-main rounded-md border px-3 py-3 text-left hover:bg-primary/10 hover:text-primary">
                {item}
              </button>
            ))}
            <div className="border-border-technical border-t pt-3">
              <p className="text-text-muted mb-2 text-xs font-semibold uppercase">Timezone</p>
              {['Auto detect', '(UTC) Coordinated Universal Time', '(UTC-05:00) Eastern Time'].map((timezone) => (
                <button key={timezone} type="button" className="text-text-main block w-full rounded px-3 py-2 text-left text-sm hover:bg-primary/10 hover:text-primary">
                  {timezone}
                </button>
              ))}
            </div>
            <button type="button" className="text-danger border-border-technical border-t pt-3 text-left">Sign Out</button>
          </div>
        ) : null}
    </PlatformContextPanel>
  );
}