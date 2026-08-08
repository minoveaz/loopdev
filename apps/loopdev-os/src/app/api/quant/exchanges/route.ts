import { NextResponse } from 'next/server';
import { authorizeQuantManagement } from '@/services/quant/authorization';
import { createExchangeConnection, listExchangeConnections } from '@/services/quant/exchangeVault';

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const forbidden = () => NextResponse.json({ error: 'Quant management permission is required' }, { status: 403 });

export async function GET(request: Request) {
  const organizationId = new URL(request.url).searchParams.get('organizationId');
  if (!organizationId) return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });

  const access = await authorizeQuantManagement(organizationId);
  if (!access.allowed) return access.status === 401 ? unauthorized() : forbidden();

  try { return NextResponse.json(await listExchangeConnections(organizationId)); }
  catch { return NextResponse.json({ error: 'Unable to load exchanges' }, { status: 500 }); }
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

  const access = await authorizeQuantManagement(organizationId);
  if (!access.allowed) return access.status === 401 ? unauthorized() : forbidden();

  try { return NextResponse.json(await createExchangeConnection({ organizationId, name, provider, apiKey, apiSecret }), { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'ORGANIZATION_MAPPING_MISSING' ? 'The organization has no legacy tenant mapping' : 'Unable to save the exchange connection' }, { status: error instanceof Error && error.message === 'ORGANIZATION_MAPPING_MISSING' ? 409 : 500 }); }
}
