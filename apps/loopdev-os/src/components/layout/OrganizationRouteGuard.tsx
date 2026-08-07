'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useOrganization } from '@/hooks/useOrganization';

export function OrganizationRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { memberships, activeOrganizationId, isLoading } = useOrganization();

  const isFrontendPreview = pathname.startsWith('/frontend-preview');
  const requiresOrganization =
    pathname !== '/login' && pathname !== '/launchpad' && !isFrontendPreview;
  const isBlocked = requiresOrganization && !isLoading && memberships.length > 0 && !activeOrganizationId;

  useEffect(() => {
    if (isBlocked) router.replace('/launchpad');
  }, [isBlocked, router]);

  if (isBlocked) {
    return (
      <main className="bg-shell-canvas flex min-h-screen items-center justify-center p-6 text-sm text-slate-500">
        Select an organization to continue.
      </main>
    );
  }

  return children;
}
