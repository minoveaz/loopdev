'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';

type PermissionState = Record<string, boolean>;
type PermissionResult = readonly [string, boolean];

export function useOrganizationPermissions(requiredPermissions: string[]) {
  const { activeOrganizationId, memberships } = useOrganization();
  const [permissions, setPermissions] = useState<PermissionState>({});
  const [isLoading, setIsLoading] = useState(false);
  const permissionKey = useMemo(() => requiredPermissions.slice().sort().join('|'), [requiredPermissions]);
  const enforcePermissions = memberships.length > 0;

  useEffect(() => {
    let isMounted = true;

    if (!enforcePermissions || !activeOrganizationId || requiredPermissions.length === 0) {
      return () => {
        isMounted = false;
      };
    }

    const loadPermissions = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const results = await Promise.all(
        requiredPermissions.map(async (permission): Promise<PermissionResult> => {
          const { data, error } = await supabase.rpc('has_organization_permission', {
            target_organization_id: activeOrganizationId,
            required_permission: permission,
          });

          return [permission, !error && data === true] as const;
        }),
      );

      if (isMounted) {
        setPermissions(Object.fromEntries(results));
        setIsLoading(false);
      }
    };

    void loadPermissions();

    return () => {
      isMounted = false;
    };
  }, [activeOrganizationId, enforcePermissions, permissionKey]);

  return {
    isLoading,
    hasPermission: (permission: string) => !enforcePermissions || permissions[permission] === true,
  };
}
