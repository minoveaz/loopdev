'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { OrganizationSchema, type Organization, type OrganizationMembership } from '@loopdev/contracts';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ACTIVE_ORGANIZATION_STORAGE_KEY = 'loopdev.activeOrganizationId';

export type OrganizationContextType = {
  organizations: Organization[];
  memberships: OrganizationMembership[];
  activeOrganization: Organization | null;
  activeMembership: OrganizationMembership | null;
  activeOrganizationId: string | null;
  setActiveOrganizationId: (organizationId: string) => void;
  isLoading: boolean;
};

export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user, memberships } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganizationId, setActiveOrganizationIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOrganizations = async () => {
      if (!user || memberships.length === 0) {
        setOrganizations([]);
        setActiveOrganizationIdState(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const supabase = createClient();
      const organizationIds = memberships.map((membership) => membership.organizationId);
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, slug, legacy_tenant_id, is_active, created_at, updated_at')
        .in('id', organizationIds)
        .eq('is_active', true);

      if (!isMounted) return;

      if (error) {
        console.warn('Organizations are not available yet:', error.message);
        setOrganizations([]);
        setActiveOrganizationIdState(null);
        setIsLoading(false);
        return;
      }

      const parsedOrganizations = (data ?? [])
        .map((row) =>
          OrganizationSchema.safeParse({
            id: row.id,
            name: row.name,
            slug: row.slug,
            legacyTenantId: row.legacy_tenant_id,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }),
        )
        .flatMap((result) => (result.success ? [result.data] : []));

      setOrganizations(parsedOrganizations);
      setIsLoading(false);
    };

    void loadOrganizations();
    return () => {
      isMounted = false;
    };
  }, [memberships, user]);

  useEffect(() => {
    if (organizations.length === 0) {
      setActiveOrganizationIdState(null);
      return;
    }

    const storedOrganizationId = window.localStorage.getItem(ACTIVE_ORGANIZATION_STORAGE_KEY);
    const storedIsValid = storedOrganizationId && organizations.some(({ id }) => id === storedOrganizationId);
    const nextOrganizationId = storedIsValid ? storedOrganizationId : organizations[0].id;

    setActiveOrganizationIdState(nextOrganizationId);
    window.localStorage.setItem(ACTIVE_ORGANIZATION_STORAGE_KEY, nextOrganizationId);
  }, [organizations]);

  const setActiveOrganizationId = useCallback(
    (organizationId: string) => {
      if (!organizations.some(({ id }) => id === organizationId)) return;
      setActiveOrganizationIdState(organizationId);
      window.localStorage.setItem(ACTIVE_ORGANIZATION_STORAGE_KEY, organizationId);
    },
    [organizations],
  );

  const activeOrganization = useMemo(
    () => organizations.find(({ id }) => id === activeOrganizationId) ?? null,
    [activeOrganizationId, organizations],
  );
  const activeMembership = useMemo(
    () => memberships.find(({ organizationId }) => organizationId === activeOrganizationId) ?? null,
    [activeOrganizationId, memberships],
  );

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        memberships,
        activeOrganization,
        activeMembership,
        activeOrganizationId,
        setActiveOrganizationId,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
