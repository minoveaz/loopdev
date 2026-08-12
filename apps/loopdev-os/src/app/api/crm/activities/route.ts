import { NextResponse } from 'next/server';
import { authorizeCrm } from '../_lib/access';
import { createCrmActivity } from '@/services/crm/operations';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.organizationId || !body?.leadId || !body?.type || !body?.summary) return NextResponse.json({ error: 'organizationId, leadId, type and summary are required' }, { status: 400 });
  const access = await authorizeCrm(body.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await createCrmActivity({ ...body, actorUserId: access.userId }), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to create CRM activity' }, { status: 500 }); }
}
