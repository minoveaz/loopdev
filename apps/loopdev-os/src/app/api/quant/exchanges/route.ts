import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const forbidden = () => NextResponse.json({ error: 'Quant management permission is required' }, { status: 403 });
type ExchangeWithSecret = {
  id: string; name: string; exchange_provider: string; is_active: boolean;
  last_verified_at: string | null; last_error_message: string | null; created_at: string; api_key: string;
};

async function canManageOrganization(organizationId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false, status: 401 as const };

  const { data, error } = await supabase.rpc('has_organization_permission', {
    target_organization_id: organizationId,
    required_permission: 'quant.manage',
  });
  return { allowed: !error && data === true, status: 403 as const };
}

export async function GET(request: Request) {
  const organizationId = new URL(request.url).searchParams.get('organizationId');
  if (!organizationId) return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });

  const access = await canManageOrganization(organizationId);
  if (!access.allowed) return access.status === 401 ? unauthorized() : forbidden();

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from('quant_exchanges')
    .select('id, name, exchange_provider, is_active, last_verified_at, last_error_message, created_at, api_key')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: 'Unable to load exchanges' }, { status: 500 });

  return NextResponse.json(
    ((data ?? []) as ExchangeWithSecret[]).map(({ api_key, ...exchange }) => ({
      ...exchange,
      apiKeyMasked: api_key.length > 8 ? `${api_key.slice(0, 4)}...${api_key.slice(-4)}` : 'Configured',
    })),
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const organizationId = typeof body?.organizationId === 'string' ? body.organizationId : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const provider = typeof body?.provider === 'string' ? body.provider.trim() : '';
  const apiKey = typeof body?.apiKey === 'string' ? body.apiKey.trim() : '';
  const apiSecret = typeof body?.apiSecret === 'string' ? body.apiSecret.trim() : '';
  if (!organizationId || !name || !provider || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'organizationId, name, provider, apiKey and apiSecret are required' }, { status: 400 });
  }

  const access = await canManageOrganization(organizationId);
  if (!access.allowed) return access.status === 401 ? unauthorized() : forbidden();

  const admin = createAdminSupabaseClient();
  const { data: organization, error: organizationError } = await admin
    .from('organizations')
    .select('legacy_tenant_id')
    .eq('id', organizationId)
    .single();
  if (organizationError || !organization?.legacy_tenant_id) {
    return NextResponse.json({ error: 'The organization has no legacy tenant mapping' }, { status: 409 });
  }

  const { data, error } = await admin
    .from('quant_exchanges')
    .insert({ organization_id: organizationId, tenant_id: organization.legacy_tenant_id, name, exchange_provider: provider, api_key: apiKey, api_secret: apiSecret, is_active: true })
    .select('id, name, exchange_provider, is_active, last_verified_at, last_error_message, created_at')
    .single();
  if (error) return NextResponse.json({ error: 'Unable to save the exchange connection' }, { status: 500 });

  return NextResponse.json({ ...data, apiKeyMasked: apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : 'Configured' }, { status: 201 });
}
