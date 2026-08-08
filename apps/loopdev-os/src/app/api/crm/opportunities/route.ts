import { NextResponse } from 'next/server';
import { authorizeCrm } from '../_lib/access';
import { createOpportunity } from '@/services/crm/core';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.organizationId || !body?.leadId || !body?.name) return NextResponse.json({ error: 'organizationId, leadId and name are required' }, { status: 400 });
  const access = await authorizeCrm(body.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await createOpportunity(body), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to create CRM opportunity' }, { status: 500 }); }
}
