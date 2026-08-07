import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await createServerSupabaseClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminSupabaseClient();
  const { data: exchange } = await admin
    .from('quant_exchanges')
    .select('id, organization_id, exchange_provider, api_key, api_secret')
    .eq('id', id)
    .single();
  if (!exchange) return NextResponse.json({ error: 'Exchange not found' }, { status: 404 });

  const { data: canManage, error: permissionError } = await session.rpc('has_organization_permission', {
    target_organization_id: exchange.organization_id,
    required_permission: 'quant.manage',
  });
  if (permissionError || canManage !== true) {
    return NextResponse.json({ error: 'Quant management permission is required' }, { status: 403 });
  }

  const quantCoreUrl = process.env.QUANT_CORE_URL;
  if (!quantCoreUrl) return NextResponse.json({ error: 'Quant Core is not configured' }, { status: 503 });

  let errorMessage: string | null = null;
  let testResult: { success?: boolean; error?: string; message?: string } | null = null;
  try {
    const response = await fetch(`${quantCoreUrl.replace(/\/$/, '')}/exchanges/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exchangeId: exchange.exchange_provider, apiKey: exchange.api_key, apiSecret: exchange.api_secret, isPaper: true }),
    });
    testResult = await response.json().catch(() => null);
    if (!response.ok || testResult?.success === false) errorMessage = testResult?.error ?? 'Connection test failed';
  } catch {
    errorMessage = 'Failed to reach Quant Core';
  }

  const { error: updateError } = await admin
    .from('quant_exchanges')
    .update({ last_verified_at: new Date().toISOString(), is_active: !errorMessage, last_error_message: errorMessage })
    .eq('id', id);
  if (updateError) return NextResponse.json({ error: 'Unable to save the connection test result' }, { status: 500 });

  return NextResponse.json({ success: !errorMessage, message: errorMessage ?? 'Connection successful', error: errorMessage, testResult, timestamp: new Date().toISOString() });
}
