import { NextResponse } from 'next/server';
import { ReopenTaskCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../../_lib/access';
import { taskServiceErrorResponse } from '../../../_lib/taskErrors';
import { reopenTask } from '@/services/crm/tasks';

type Context = { params: Promise<{ taskId: string }> };

export async function POST(request: Request, context: Context) {
  const { taskId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = ReopenTaskCommandSchema.safeParse({
    ...(body ?? {}),
    taskId,
    idempotencyKey:
      body?.idempotencyKey ?? request.headers.get('idempotency-key') ?? undefined,
  });
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid CRM task reopen command', code: 'VALIDATION_ERROR' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    return NextResponse.json(await reopenTask({ ...parsed.data, actorUserId: access.userId }));
  } catch (error) {
    return taskServiceErrorResponse(error, 'Unable to reopen CRM task');
  }
}
