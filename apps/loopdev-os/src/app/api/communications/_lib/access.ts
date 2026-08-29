import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { CommunicationPermissionKey } from '@loopdev/contracts';

export async function authorizeCommunications(
  organizationId: string,
  permission: CommunicationPermissionKey,
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false as const, status: 401 as const };
  const { data, error } = await supabase.rpc('has_organization_permission', {
    target_organization_id: organizationId,
    required_permission: permission,
  });
  if (error || data !== true) return { allowed: false as const, status: 403 as const };
  return { allowed: true as const, userId: user.id };
}
