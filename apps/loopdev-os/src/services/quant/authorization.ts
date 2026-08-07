import { createServerSupabaseClient } from '@/lib/supabase/server';

export type QuantAuthorization =
  | { allowed: true; userId: string }
  | { allowed: false; status: 401 | 403 };

export async function authorizeQuantManagement(organizationId: string): Promise<QuantAuthorization> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false, status: 401 };

  const { data, error } = await supabase.rpc('has_organization_permission', {
    target_organization_id: organizationId,
    required_permission: 'quant.manage',
  });

  return !error && data === true ? { allowed: true, userId: user.id } : { allowed: false, status: 403 };
}
