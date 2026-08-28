import { NextResponse } from 'next/server';
import { CrmEntityLookupQuerySchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { lookupCrmEntities } from '@/services/crm/operations';

export async function GET(request: Request) {
  const parsed = CrmEntityLookupQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CRM lookup query' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  return NextResponse.json(await lookupCrmEntities(parsed.data));
}
