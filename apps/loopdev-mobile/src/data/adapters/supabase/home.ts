import type {
  ActivityItem,
  HomeDataSource,
  MobileOrganization,
  MobileOrganizationMembership,
  NotificationItem,
  PlatformOverview,
} from '../../contracts/home';
import { createSupabaseMobileClient } from './client';

type OrganizationRow = { id: string; name: string; slug: string; is_active: boolean };
type MembershipRow = {
  organization_id: string;
  user_id: string;
  role: MobileOrganizationMembership['role'];
};
type PermissionRow = { key: string };

export type SupabaseHomeData = {
  organizations: MobileOrganization[];
  memberships: MobileOrganizationMembership[];
  userId: string;
  permissionsByOrganization: Record<string, string[]>;
};

export async function loadSupabaseOrganizations(): Promise<SupabaseHomeData> {
  const supabase = createSupabaseMobileClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('A signed-in Supabase user is required');

  const { data: organizations, error: organizationsError } = (await supabase
    .from('organizations')
    .select('id, name, slug, is_active')
    .eq('is_active', true)) as unknown as { data: OrganizationRow[] | null; error: Error | null };
  if (organizationsError) throw organizationsError;

  const { data: memberships, error: membershipsError } = (await supabase
    .from('organization_memberships')
    .select('organization_id, user_id, role')
    .eq('user_id', authData.user.id)) as unknown as {
    data: MembershipRow[] | null;
    error: Error | null;
  };
  if (membershipsError) throw membershipsError;

  const normalizedOrganizations: MobileOrganization[] = await Promise.all(
    (organizations ?? []).map(async (organization) => {
      const { count } = (await supabase
        .from('organization_memberships')
        .select('user_id', { count: 'exact', head: true })
        .eq('organization_id', organization.id)) as unknown as { count: number | null };
      return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        memberCount: count ?? 0,
        status: organization.is_active ? 'active' : 'paused',
      };
    }),
  );
  const normalizedMemberships = (memberships ?? []).map((membership) => ({
    organizationId: membership.organization_id,
    userId: membership.user_id,
    role: membership.role,
  }));
  const permissionsByOrganization: Record<string, string[]> = {};
  for (const organization of normalizedOrganizations) {
    const { data: permissionKeys } = (await supabase
      .from('permissions')
      .select('key')) as unknown as { data: PermissionRow[] | null };
    const permissions = await Promise.all(
      (permissionKeys ?? []).map(async ({ key }) => {
        const { data } = await (
          supabase.rpc as unknown as (
            name: string,
            args: Record<string, string>,
          ) => Promise<{ data: boolean | null }>
        )('has_organization_permission', {
          target_organization_id: organization.id,
          required_permission: key,
        });
        return data === true ? key : null;
      }),
    );
    permissionsByOrganization[organization.id] = permissions.filter(
      (key): key is string => key !== null,
    );
  }

  return {
    organizations: normalizedOrganizations,
    memberships: normalizedMemberships,
    userId: authData.user.id,
    permissionsByOrganization,
  };
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
    return {
      systemStatus: 'operational',
      activeUsers: 0,
      activeOrganizations: organizations.organizations.length,
      pendingNotifications: 0,
    };
  },
};

export async function signInWithSupabase(email: string, password: string) {
  const supabase = createSupabaseMobileClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw error ?? new Error('Supabase did not return a user');
  return data.user;
}

export async function signOutFromSupabase() {
  const { error } = await createSupabaseMobileClient().auth.signOut();
  if (error) throw error;
}
