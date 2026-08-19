import { NextResponse } from 'next/server';
import { UpdateNoteCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../_lib/access';
import { taskServiceErrorResponse } from '../../_lib/taskErrors';
import { updateNote } from '@/services/crm/tasks';

type Context = { params: Promise<{ noteId: string }> };

export async function PATCH(request: Request, context: Context) {
  const { noteId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = UpdateNoteCommandSchema.safeParse({
    ...(body ?? {}),
    noteId,
    idempotencyKey:
      body?.idempotencyKey ?? request.headers.get('idempotency-key') ?? undefined,
  });
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid CRM note update', code: 'VALIDATION_ERROR' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    return NextResponse.json(await updateNote({ ...parsed.data, actorUserId: access.userId }));
  } catch (error) {
    return taskServiceErrorResponse(error, 'Unable to update CRM note');
  }
}
