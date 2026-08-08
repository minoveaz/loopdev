import { NextResponse } from 'next/server';
import { CrmCreateLeadCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { createLead, listLeads } from '@/services/crm/core';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const organizationId = params.get('organizationId');
  if (!organizationId) return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
  const access = await authorizeCrm(organizationId, 'crm.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await listLeads(organizationId, params.get('workspaceId') ?? undefined)); }
  catch { return NextResponse.json({ error: 'Unable to load CRM leads' }, { status: 500 }); }
}

export async function POST(request: Request) {
  const parsed = CrmCreateLeadCommandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CRM lead payload', details: parsed.error.flatten() }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await createLead(parsed.data, access.userId), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to create CRM lead' }, { status: 500 }); }
}
