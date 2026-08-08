import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type ExchangeWithSecret = {
  id: string; name: string; exchange_provider: string; is_active: boolean;
  last_verified_at: string | null; last_error_message: string | null; created_at: string; api_key: string;
};

export type CreateExchangeInput = { organizationId: string; name: string; provider: string; apiKey: string; apiSecret: string };

export function maskApiKey(apiKey: string) {
  return apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : 'Configured';
}

export async function listExchangeConnections(organizationId: string) {
  const { data, error } = await createAdminSupabaseClient()
    .from('quant_exchanges')
    .select('id, name, exchange_provider, is_active, last_verified_at, last_error_message, created_at, api_key')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw new Error('Unable to load exchanges');
  return ((data ?? []) as ExchangeWithSecret[]).map(({ api_key, ...exchange }) => ({ ...exchange, apiKeyMasked: maskApiKey(api_key) }));
}

export async function createExchangeConnection(input: CreateExchangeInput) {
  const admin = createAdminSupabaseClient();
  const { data: organization, error: organizationError } = await admin
    .from('organizations').select('legacy_tenant_id').eq('id', input.organizationId).single();
  if (organizationError || !organization?.legacy_tenant_id) throw new Error('ORGANIZATION_MAPPING_MISSING');

  const { data, error } = await admin
    .from('quant_exchanges')
    .insert({ organization_id: input.organizationId, tenant_id: organization.legacy_tenant_id, name: input.name, exchange_provider: input.provider, api_key: input.apiKey, api_secret: input.apiSecret, is_active: true })
    .select('id, name, exchange_provider, is_active, last_verified_at, last_error_message, created_at').single();
  if (error) throw new Error('Unable to save the exchange connection');
  return { ...data, apiKeyMasked: maskApiKey(input.apiKey) };
}

export async function testExchangeConnection(exchangeId: string) {
  const admin = createAdminSupabaseClient();
  const { data: exchange } = await admin
    .from('quant_exchanges')
    .select('id, organization_id, exchange_provider, api_key, api_secret')
    .eq('id', exchangeId)
    .single();
  if (!exchange) return { kind: 'not_found' as const };

  const quantCoreUrl = process.env.QUANT_CORE_URL;
  if (!quantCoreUrl) return { kind: 'not_configured' as const, organizationId: exchange.organization_id };

  let errorMessage: string | null = null;
  let testResult: { success?: boolean; error?: string; message?: string } | null = null;
  try {
    const response = await fetch(`${quantCoreUrl.replace(/\/$/, '')}/exchanges/test`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exchangeId: exchange.exchange_provider, apiKey: exchange.api_key, apiSecret: exchange.api_secret, isPaper: true }),
    });
    testResult = await response.json().catch(() => null);
    if (!response.ok || testResult?.success === false) errorMessage = testResult?.error ?? 'Connection test failed';
  } catch { errorMessage = 'Failed to reach Quant Core'; }

  const { error: updateError } = await admin.from('quant_exchanges')
    .update({ last_verified_at: new Date().toISOString(), is_active: !errorMessage, last_error_message: errorMessage })
    .eq('id', exchangeId);
  if (updateError) return { kind: 'persistence_error' as const, organizationId: exchange.organization_id };
  return { kind: 'complete' as const, organizationId: exchange.organization_id, success: !errorMessage, message: errorMessage ?? 'Connection successful', error: errorMessage, testResult, timestamp: new Date().toISOString() };
}
