import { NextResponse } from 'next/server';
import { authorizeCrm } from '../_lib/access';
import { findOrCreateContact } from '@/services/crm/core';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.organizationId || !body?.firstName) return NextResponse.json({ error: 'organizationId and firstName are required' }, { status: 400 });
  const access = await authorizeCrm(body.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await findOrCreateContact(body), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to create CRM contact' }, { status: 500 }); }
}
