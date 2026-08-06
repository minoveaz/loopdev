'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';

export function SuitePermissionGuard({ permission, children }: { permission: string; children: ReactNode }) {
  const router = useRouter();
  const { hasPermission, isLoading } = useOrganizationPermissions([permission]);
  const isDenied = !isLoading && !hasPermission(permission);

  useEffect(() => {
    if (isDenied) router.replace('/launchpad');
  }, [isDenied, router]);

  if (isLoading || isDenied) {
    return (
      <main className="bg-shell-canvas flex min-h-screen items-center justify-center p-6 text-sm text-slate-500">
        {isLoading ? 'Checking organization permissions…' : 'You do not have access to this suite.'}
      </main>
    );
  }

  return children;
}
