import type { HomeDataSource, PlatformOverview } from '../../contracts/home';
import type { ActivityItem, NotificationItem, Organization } from '../fixtures/home';
import { createSupabaseMobileClient } from './client';

export type OrganizationMembership = {
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'agent' | 'viewer';
};

export type SupabaseHomeData = {
  organizations: Organization[];
  memberships: OrganizationMembership[];
  userId: string;
  permissionsByOrganization: Record<string, string[]>;
};

export async function loadSupabaseOrganizations(): Promise<SupabaseHomeData> {
  const supabase = createSupabaseMobileClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('A signed-in Supabase user is required');

  const { data: organizations, error: organizationsError } = await supabase
    .from('organizations')
    .select('id, name, slug, is_active')
    .eq('is_active', true);
  if (organizationsError) throw organizationsError;

  const { data: memberships, error: membershipsError } = await supabase
    .from('organization_memberships')
    .select('organization_id, user_id, role')
    .eq('user_id', authData.user.id);
  if (membershipsError) throw membershipsError;

  const normalizedOrganizations: Organization[] = (organizations ?? []).map((organization) => ({
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    memberCount: 0,
    status: 'active',
  }));
  const normalizedMemberships = (memberships ?? []).map((membership) => ({
    organizationId: membership.organization_id,
    userId: membership.user_id,
    role: membership.role,
  }));
  const permissionsByOrganization: Record<string, string[]> = {};
  for (const organization of normalizedOrganizations) {
    const { data: permissionKeys } = await supabase.from('permissions').select('key');
    const permissions = await Promise.all((permissionKeys ?? []).map(async ({ key }) => {
      const { data } = await supabase.rpc('has_organization_permission', {
        target_organization_id: organization.id,
        required_permission: key,
      });
      return data === true ? key : null;
    }));
    permissionsByOrganization[organization.id] = permissions.filter((key): key is string => key !== null);
  }

  return { organizations: normalizedOrganizations, memberships: normalizedMemberships, userId: authData.user.id, permissionsByOrganization };
}

export const supabaseHomeDataSource: HomeDataSource = {
  async getOrganizations() {
    return (await loadSupabaseOrganizations()).organizations;
  },
  async getActivity(): Promise<ActivityItem[]> {
    return [];
  },
  async getNotifications(): Promise<NotificationItem[]> {
    return [];
  },
  async getPlatformOverview(): Promise<PlatformOverview> {
    const organizations = await loadSupabaseOrganizations();
    return { systemStatus: 'operational', activeUsers: 0, activeOrganizations: organizations.organizations.length, pendingNotifications: 0 };
  },
};