'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogoSpinner } from '@loopdev/ui';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { canAccessOrganizationRoute, resolveAccessState } from '@/core/access/accessState';
import { AccessStatePanel } from './AccessStatePanel';

export function OrganizationRouteGuard({ children }: { children: ReactNode }) {
  const hasMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const pathname = usePathname();
  const router = useRouter();
  const { activeOrganizationId, isLoading: isOrganizationLoading } = useOrganization();
  const { user, memberships, isPlatformAdministrator, isLoading: isAuthLoading } = useAuth();

  const requiresOrganization =
    pathname !== '/login' &&
    pathname !== '/launchpad' &&
    pathname !== '/shell-showcase' &&
    !pathname.startsWith('/auth/');
  const accessState = resolveAccessState({
    isAuthLoading,
    hasSession: Boolean(user),
    isPlatformAdministrator,
    membershipStatuses: memberships.map((membership) => membership.status),
  });
  const hasActiveOrganization = Boolean(activeOrganizationId);
  const isBlocked =
    requiresOrganization &&
    !isAuthLoading &&
    (!canAccessOrganizationRoute(accessState) ||
      (!isPlatformAdministrator && !isOrganizationLoading && !hasActiveOrganization));

  useEffect(() => {
    if (isBlocked && accessState !== 'session-expired') router.replace('/launchpad');
  }, [accessState, isBlocked, router]);

  if (requiresOrganization && (!hasMounted || accessState === 'loading')) {
    return (
      <main
        className="bg-shell-canvas flex min-h-screen flex-col items-center justify-center gap-4 p-6"
        role="status"
        aria-live="polite"
        aria-label="Checking your secure workspace access"
      >
        <LogoSpinner size={48} />
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Checking your secure workspace access…
        </span>
      </main>
    );
  }

  if (isBlocked) {
    if (accessState === 'session-expired') return <AccessStatePanel state={accessState} />;
    if (accessState === 'authorized') return <AccessStatePanel state="no-organization-access" />;
    return (
      <AccessStatePanel
        state={accessState === 'loading' ? 'no-organization-access' : accessState}
      />
    );
  }

  return children;
}
