'use client';

import { startTransition, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { canAccessSuiteRoute, resolveAccessState } from '@/core/access/accessState';
import type { SuiteKey } from '@loopdev/contracts';

const suiteByPermission: Record<string, SuiteKey> = {
  'marketing.read': 'marketing',
  'crm.read': 'crm',
  'health.read': 'health',
  'quant.read': 'quant',
  'finance.read': 'finance',
  'operations.read': 'operations',
  'communications.read': 'communications',
};

export function SuitePermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [hasRenderedSuite, setHasRenderedSuite] = useState(false);
  const { hasPermission, isLoading } = useOrganizationPermissions([permission]);
  const { isSuiteEnabled, isLoading: isLoadingWorkspaces } = useWorkspace();
  const { activeOrganization, isLoading: isLoadingOrganization } = useOrganization();
  const { user, memberships, isPlatformAdministrator, isLoading: isAuthLoading } = useAuth();
  const suiteKey = suiteByPermission[permission];
  const accessState = resolveAccessState({
    isAuthLoading,
    hasSession: Boolean(user),
    isPlatformAdministrator,
    membershipStatuses: memberships.map((membership) => membership.status),
  });
  const isPlatformScope = isPlatformAdministrator && activeOrganization?.slug === 'loopdev';
  const isDenied =
    accessState === 'authorized' &&
    Boolean(activeOrganization) &&
    !isPlatformScope &&
    !isLoading &&
    !isLoadingWorkspaces &&
    !isLoadingOrganization &&
    !isAuthLoading &&
    !canAccessSuiteRoute({
      accessState,
      hasPermission: hasPermission(permission),
      isSuiteEnabled: suiteKey ? isSuiteEnabled(suiteKey) : false,
    });

  useEffect(() => {
    if (isDenied) router.replace('/launchpad');
  }, [isDenied, router]);

  const isInitialLoading =
    !hasRenderedSuite &&
    (isLoading || isLoadingWorkspaces || isLoadingOrganization || accessState === 'loading');

  useEffect(() => {
    if (!isDenied && !isInitialLoading) {
      startTransition(() => setHasRenderedSuite(true));
    }
  }, [isDenied, isInitialLoading]);

  if (isInitialLoading) {
    return (
      <main className="bg-shell-canvas flex min-h-screen items-center justify-center p-6 text-sm text-slate-500">
        Checking work context…
      </main>
    );
  }

  return children;
}
