'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { OrganizationSchema, type Organization, type OrganizationMembership } from '@loopdev/contracts';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ACTIVE_ORGANIZATION_STORAGE_KEY = 'loopdev.activeOrganizationId';
const normalizeTimestamp = (value: unknown) => Array.isArray(value) ? String(value[0]) : String(value);

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
  const { user, memberships, isPlatformAdministrator } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganizationId, setActiveOrganizationIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOrganizations = async () => {
      if (!user) {
        setOrganizations([]);
        setActiveOrganizationIdState(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const supabase = createClient();
      const activeMemberships = memberships.filter((membership) => membership.status === 'active');
      const organizationIds = activeMemberships.map((membership) => membership.organizationId);
      let query = supabase
        .from('organizations')
        .select('id, name, slug, legacy_tenant_id, is_active, created_at, updated_at')
        .eq('is_active', true);
      if (!isPlatformAdministrator && organizationIds.length > 0) query = query.in('id', organizationIds);
      const { data, error } = await query;

      if (!isMounted) return;

      if (error) {
        console.warn('Organizations are not available yet:', error.message);
        setOrganizations([]);
        setActiveOrganizationIdState(null);
        setIsLoading(false);
        return;
      }

      const parsedOrganizations = (data ?? [])
        .map((row) => {
          const organization = {
            id: row.id,
            name: row.name,
            slug: row.slug,
            legacyTenantId: row.legacy_tenant_id,
            isActive: row.is_active,
            createdAt: normalizeTimestamp(row.created_at),
            updatedAt: normalizeTimestamp(row.updated_at),
          };
          const result = OrganizationSchema.safeParse(organization);
          if (result.success) return result.data;
          console.warn('Organization schema mismatch:', result.error.flatten().fieldErrors);
          return organization as Organization;
        });

      const preferredOrganization = parsedOrganizations.find(({ slug }) => slug === 'loopdev');
      setOrganizations(parsedOrganizations);
      if (preferredOrganization && !window.localStorage.getItem(ACTIVE_ORGANIZATION_STORAGE_KEY)) {
        setActiveOrganizationIdState(preferredOrganization.id);
        window.localStorage.setItem(ACTIVE_ORGANIZATION_STORAGE_KEY, preferredOrganization.id);
      }
      setIsLoading(false);
    };

    void loadOrganizations();
    return () => {
      isMounted = false;
    };
  }, [isPlatformAdministrator, memberships, user]);

  useEffect(() => {
    if (activeOrganizationId) {
      window.localStorage.setItem(ACTIVE_ORGANIZATION_STORAGE_KEY, activeOrganizationId);
    }
  }, [activeOrganizationId]);

  const resolvedActiveOrganizationId = useMemo(() => {
    if (organizations.length === 0) return null;
    if (activeOrganizationId && organizations.some(({ id }) => id === activeOrganizationId)) {
      return activeOrganizationId;
    }

    const storedOrganizationId = window.localStorage.getItem(ACTIVE_ORGANIZATION_STORAGE_KEY);
    if (storedOrganizationId && organizations.some(({ id }) => id === storedOrganizationId)) {
      return storedOrganizationId;
    }

    return organizations[0].id;
  }, [activeOrganizationId, organizations]);

  const setActiveOrganizationId = useCallback(
    (organizationId: string) => {
      if (!organizations.some(({ id }) => id === organizationId)) return;
      setActiveOrganizationIdState(organizationId);
      window.localStorage.setItem(ACTIVE_ORGANIZATION_STORAGE_KEY, organizationId);
    },
    [organizations],
  );

  const activeOrganization = useMemo(
    () => organizations.find(({ id }) => id === resolvedActiveOrganizationId) ?? null,
    [resolvedActiveOrganizationId, organizations],
  );
  const activeMembership = useMemo(
    () => memberships.find(({ organizationId, status }) => organizationId === resolvedActiveOrganizationId && status === 'active') ?? null,
    [resolvedActiveOrganizationId, memberships],
  );

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        memberships,
        activeOrganization,
        activeMembership,
        activeOrganizationId: resolvedActiveOrganizationId,
        setActiveOrganizationId,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
