import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { authorizeQuantManagement } from '@/services/quant/authorization';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminSupabaseClient();
  const { data: exchange } = await admin
    .from('quant_exchanges')
    .select('id, organization_id, exchange_provider, api_key, api_secret')
    .eq('id', id)
    .single();
  if (!exchange) return NextResponse.json({ error: 'Exchange not found' }, { status: 404 });

  const access = await authorizeQuantManagement(exchange.organization_id);
  if (!access.allowed) return NextResponse.json({ error: access.status === 401 ? 'Unauthorized' : 'Quant management permission is required' }, { status: access.status });

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
