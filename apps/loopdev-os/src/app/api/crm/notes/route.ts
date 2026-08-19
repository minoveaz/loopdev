import { NextResponse } from 'next/server';
import {
  CreateNoteCommandSchema,
  CrmCreateNoteCommandSchema,
  CrmNoteQuerySchema,
} from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { taskServiceErrorResponse } from '../_lib/taskErrors';
import { createCrmNote, listCrmNotes } from '@/services/crm/operations';
import { createNote } from '@/services/crm/tasks';

export async function GET(request: Request) {
  const parsed = CrmNoteQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CRM note query' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  return NextResponse.json(await listCrmNotes(parsed.data));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (body?.relationType && body?.relationId) {
    const parsed = CreateNoteCommandSchema.safeParse({
      ...body,
      idempotencyKey:
        body.idempotencyKey ?? request.headers.get('idempotency-key') ?? undefined,
    });
    if (!parsed.success)
      return NextResponse.json({ error: 'Invalid CRM note command', code: 'VALIDATION_ERROR' }, { status: 400 });
    const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
    if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
    try {
      const result = await createNote({ ...parsed.data, actorUserId: access.userId });
      return NextResponse.json(result.note, { status: result.created ? 201 : 200 });
    } catch (error) {
      return taskServiceErrorResponse(error, 'Unable to create CRM note');
    }
  }
  const parsed = CrmCreateNoteCommandSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CRM note command' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  return NextResponse.json(await createCrmNote({ ...parsed.data, authorUserId: access.userId }), { status: 201 });
}
