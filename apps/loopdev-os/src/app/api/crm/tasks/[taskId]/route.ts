import { NextResponse } from 'next/server';
import { TaskQuerySchema, UpdateTaskCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../_lib/access';
import { taskServiceErrorResponse } from '../../_lib/taskErrors';
import { getTask, updateTask } from '@/services/crm/tasks';

type Context = { params: Promise<{ taskId: string }> };

export async function GET(request: Request, context: Context) {
  const { taskId } = await context.params;
  const organizationId = new URL(request.url).searchParams.get('organizationId');
  const parsed = TaskQuerySchema.pick({ organizationId: true }).safeParse({ organizationId });
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid CRM task query', code: 'VALIDATION_ERROR' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    const task = await getTask(parsed.data.organizationId, taskId);
    if (!task) return NextResponse.json({ error: 'CRM task was not found', code: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    return taskServiceErrorResponse(error, 'Unable to load CRM task');
  }
}

export async function PATCH(request: Request, context: Context) {
  const { taskId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = UpdateTaskCommandSchema.safeParse({
    ...(body ?? {}),
    taskId,
    idempotencyKey:
      body?.idempotencyKey ?? request.headers.get('idempotency-key') ?? undefined,
  });
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid CRM task update', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    return NextResponse.json(await updateTask({ ...parsed.data, actorUserId: access.userId }));
  } catch (error) {
    return taskServiceErrorResponse(error, 'Unable to update CRM task');
  }
}
