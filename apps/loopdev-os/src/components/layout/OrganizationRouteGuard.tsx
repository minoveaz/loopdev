'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
      <main className="bg-shell-canvas flex min-h-screen items-center justify-center p-6 text-sm text-slate-500">
        Checking your secure workspace access…
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
