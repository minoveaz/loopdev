import type {
  OrganizationMembershipSummary,
  OrganizationSummary,
  PlatformActivityItem,
  PlatformHomeDataSource,
  PlatformNotificationItem,
  PlatformSuiteSummary,
  PlatformOverview,
} from '@loopdev/contracts';
import { createSupabaseMobileClient } from './client';

type OrganizationRow = { id: string; name: string; slug: string; is_active: boolean };
type MembershipRow = {
  organization_id: string;
  user_id: string;
  role: OrganizationMembershipSummary['role'];
};
type PermissionRow = { key: string };
type WorkspaceRow = { id: string; suite_key: PlatformSuiteSummary['suiteKey']; name: string; slug: string; status: PlatformSuiteSummary['status'] };

export type SupabaseHomeData = {
  organizations: OrganizationSummary[];
  memberships: OrganizationMembershipSummary[];
  userId: string;
  permissionsByOrganization: Record<string, string[]>;
};

export async function loadSupabaseOrganizations(): Promise<SupabaseHomeData> {
  const supabase = createSupabaseMobileClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('A signed-in Supabase user is required');

  const { data: isPlatformAdministrator, error: administratorError } = (await supabase.rpc(
    'is_platform_administrator',
  )) as unknown as { data: boolean | null; error: Error | null };
  if (administratorError) throw administratorError;

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

  const membershipOrganizationIds = [...new Set((memberships ?? []).map(({ organization_id }) => organization_id))];
  if (!isPlatformAdministrator && membershipOrganizationIds.length === 0) {
    return {
      organizations: [],
      memberships: [],
      userId: authData.user.id,
      permissionsByOrganization: {},
    };
  }
  const visibleOrganizations = isPlatformAdministrator
    ? organizations ?? []
    : (organizations ?? []).filter(({ id }) => membershipOrganizationIds.includes(id));
  const normalizedMemberships = (memberships ?? []).map((membership) => ({
    organizationId: membership.organization_id,
    userId: membership.user_id,
    role: membership.role,
  }));

  const normalizedOrganizations: OrganizationSummary[] = await Promise.all(
    visibleOrganizations.map(async (organization) => {
      const { count } = (await supabase
        .from('organization_memberships')
        .select('user_id', { count: 'exact', head: true })
        .eq('organization_id', organization.id)) as unknown as { count: number | null };
      return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        role: normalizedMemberships.find(({ organizationId }) => organizationId === organization.id)?.role,
        memberCount: count ?? 0,
        status: organization.is_active ? 'active' : 'paused',
      };
    }),
  );
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

export const supabaseHomeDataSource: PlatformHomeDataSource = {
  async getOrganizations() {
    return (await loadSupabaseOrganizations()).organizations;
  },
  async getSuites(organizationId?: string): Promise<PlatformSuiteSummary[]> {
    if (!organizationId) return [];
    const { data, error } = (await createSupabaseMobileClient()
      .from('workspaces')
      .select('id, suite_key, name, slug, status')
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .order('name')) as unknown as { data: WorkspaceRow[] | null; error: Error | null };
    if (error) throw error;
    return (data ?? []).map(({ id, suite_key, name, slug, status }) => ({ id, suiteKey: suite_key, name, slug, status }));
  },
  async getActivity(_organizationId?: string): Promise<PlatformActivityItem[]> {
    return [];
  },
  async getNotifications(_organizationId?: string): Promise<PlatformNotificationItem[]> {
    return [];
  },
  async getPlatformOverview(_organizationId?: string): Promise<PlatformOverview> {
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
