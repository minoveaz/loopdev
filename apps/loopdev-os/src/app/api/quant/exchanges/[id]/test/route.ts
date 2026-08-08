import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { authorizeQuantManagement } from '@/services/quant/authorization';
import { testExchangeConnection } from '@/services/quant/exchangeVault';

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

  const result = await testExchangeConnection(id);
  if (result.kind === 'not_configured') return NextResponse.json({ error: 'Quant Core is not configured' }, { status: 503 });
  if (result.kind === 'persistence_error') return NextResponse.json({ error: 'Unable to save the connection test result' }, { status: 500 });
  if (result.kind === 'not_found') return NextResponse.json({ error: 'Exchange not found' }, { status: 404 });
  return NextResponse.json(result);
}
