import { NextResponse } from 'next/server';
import { CrmCreateNoteCommandSchema, CrmNoteQuerySchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { createCrmNote, listCrmNotes } from '@/services/crm/operations';

export async function GET(request: Request) {
  const parsed = CrmNoteQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CRM note query' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  return NextResponse.json(await listCrmNotes(parsed.data));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CrmCreateNoteCommandSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CRM note command' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  return NextResponse.json(await createCrmNote({ ...parsed.data, authorUserId: access.userId }), { status: 201 });
}
