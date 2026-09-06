'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, LogOut } from 'lucide-react';
import {
  Button,
  PlatformContextPanel,
  type PlatformContextPanelMode,
  type NotificationItem,
} from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';

type ContextPanelHostProps = {
  mode: PlatformContextPanelMode;
  notifications: NotificationItem[];
  unreadCount: number;
  onClose: () => void;
  user?: {
    name?: string;
    email?: string;
    role?: string;
    tenantName?: string;
  };
};

export function ContextPanelHost({
  mode,
  notifications,
  unreadCount,
  onClose,
  user: userProp,
}: ContextPanelHostProps) {
  const router = useRouter();
  const { user: authUser, isPlatformAdministrator, signOut } = useAuth();
  const { activeOrganization, activeMembership } = useOrganization();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName =
    userProp?.name ||
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.email?.split('@')[0] ||
    (authUser ? 'Authenticated User' : 'Alex Morgan');
  const email = userProp?.email || authUser?.email || 'showcase@loopdev.local';
  const role =
    userProp?.role ||
    activeMembership?.role ||
    (isPlatformAdministrator ? 'PLATFORM_OWNER' : authUser ? 'MEMBER' : 'TENANT_ADMIN');
  const tenantName =
    userProp?.tenantName ||
    activeOrganization?.name ||
    (authUser ? undefined : 'Showcase Workspace');

  let detectedTimezone = 'UTC';
  try {
    detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    detectedTimezone = 'UTC';
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      onClose();
      router.push('/login');
    } catch (err) {
      console.error('Sign out error:', err);
      setIsSigningOut(false);
    }
  };

  return (
    <PlatformContextPanel
      mode={mode}
      notifications={notifications}
      unreadCount={unreadCount}
      onClose={onClose}
    >
      {mode === 'profile' ? (
        <div className="flex flex-col gap-4 overflow-y-auto p-4">
          <div className="border-border-technical flex flex-col gap-1.5 border-b pb-4">
            <span className="text-text-main text-lg font-bold dark:text-white">{displayName}</span>
            <span className="text-text-muted text-xs truncate">{email}</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="border-primary/20 bg-primary/10 text-primary flex shrink-0 items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {role}
              </span>
              {tenantName && (
                <span className="border-border-technical bg-background-subtle text-text-muted flex shrink-0 items-center rounded border px-2 py-0.5 text-[10px] font-medium truncate max-w-[180px]">
                  {tenantName}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Preferences & Settings
            </span>
            {['Profile', 'Account Settings', 'Billing'].map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                className="justify-between text-xs opacity-75 cursor-default hover:bg-transparent"
              >
                <span>{item}</span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted/60">
                  Placeholder
                </span>
              </Button>
            ))}
          </div>

          <div className="border-border-technical border-t pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                Timezone
              </span>
              <span className="border-border-technical bg-background-subtle text-primary flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-medium">
                <Globe size={10} aria-hidden="true" />
                Auto-detected
              </span>
            </div>
            <div className="rounded-md border border-border-technical bg-background-subtle p-2.5 text-xs text-text-main dark:text-slate-200">
              <p className="font-mono text-xs">{detectedTimezone}</p>
            </div>
          </div>

          <div className="border-border-technical border-t pt-4">
            <Button
              type="button"
              variant="danger"
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="w-full justify-center gap-2 text-xs font-semibold"
            >
              <LogOut size={14} aria-hidden="true" />
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      ) : null}
    </PlatformContextPanel>
  );
}
