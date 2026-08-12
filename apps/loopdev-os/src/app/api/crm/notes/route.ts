import { NextResponse } from 'next/server';
import { authorizeCrm } from '../_lib/access';
import { createCrmNote } from '@/services/crm/operations';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.organizationId || !body?.body) return NextResponse.json({ error: 'organizationId and body are required' }, { status: 400 });
  const access = await authorizeCrm(body.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await createCrmNote({ ...body, authorUserId: access.userId }), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to create CRM note' }, { status: 500 }); }
}
