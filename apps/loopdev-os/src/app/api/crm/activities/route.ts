import { NextResponse } from 'next/server';
import { CrmActivityQuerySchema, CrmCreateActivityCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { createCrmActivity, listCrmActivities } from '@/services/crm/operations';

export async function GET(request: Request) {
  const parsed = CrmActivityQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CRM activity query' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  return NextResponse.json(await listCrmActivities(parsed.data));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CrmCreateActivityCommandSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CRM activity command' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  return NextResponse.json(await createCrmActivity({ ...parsed.data, actorUserId: access.userId }), { status: 201 });
}
