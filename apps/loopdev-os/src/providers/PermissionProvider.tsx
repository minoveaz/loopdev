'use client';

import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';

type PermissionContextType = {
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
};

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { activeOrganizationId, memberships } = useOrganization();
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const enforcePermissions = memberships.length > 0;

  useEffect(() => {
    let isMounted = true;
    if (!enforcePermissions || !activeOrganizationId) {
      setPermissions({});
      setIsLoading(false);
      return () => { isMounted = false; };
    }

    const loadPermissions = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data: catalog, error: catalogError } = await supabase.from('permissions').select('key');
      if (catalogError) {
        if (isMounted) { setPermissions({}); setIsLoading(false); }
        return;
      }

      const results = await Promise.all(
        (catalog ?? []).map(async ({ key }) => {
          const { data, error } = await supabase.rpc('has_organization_permission', {
            target_organization_id: activeOrganizationId,
            required_permission: key,
          });
          return [key, !error && data === true] as const;
        }),
      );
      if (isMounted) { setPermissions(Object.fromEntries(results)); setIsLoading(false); }
    };

    void loadPermissions();
    return () => { isMounted = false; };
  }, [activeOrganizationId, enforcePermissions]);

  const value = useMemo(() => ({
    isLoading,
    hasPermission: (permission: string) => !enforcePermissions || permissions[permission] === true,
  }), [enforcePermissions, isLoading, permissions]);

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}
