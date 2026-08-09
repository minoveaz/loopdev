import { NextResponse } from 'next/server';
import { CrmCaptureLeadCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { captureLead } from '@/services/crm/core';

export async function POST(request: Request) {
  const parsed = CrmCaptureLeadCommandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid lead capture payload', details: parsed.error.flatten() }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await captureLead(parsed.data, access.userId), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to capture CRM lead' }, { status: 500 }); }
}
