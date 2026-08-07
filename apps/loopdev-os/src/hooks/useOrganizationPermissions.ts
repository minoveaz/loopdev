'use client';

import { usePermissions } from '@/hooks/usePermissions';

export function useOrganizationPermissions(requiredPermissions: string[]) {
  const { isLoading, hasPermission } = usePermissions();
  return { isLoading, hasPermission: (permission: string) => requiredPermissions.includes(permission) && hasPermission(permission) };
}
