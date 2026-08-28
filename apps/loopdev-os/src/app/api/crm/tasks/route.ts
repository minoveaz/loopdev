import { NextResponse } from 'next/server';
import { CreateTaskCommandSchema, TaskQuerySchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { taskServiceErrorResponse } from '../_lib/taskErrors';
import { createTask, listTasks } from '@/services/crm/tasks';

export async function GET(request: Request) {
  const parsed = TaskQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid CRM task query', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    return NextResponse.json(await listTasks(parsed.data));
  } catch (error) {
    return taskServiceErrorResponse(error, 'Unable to list CRM tasks');
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CreateTaskCommandSchema.safeParse({
    ...(body ?? {}),
    idempotencyKey:
      body?.idempotencyKey ?? request.headers.get('idempotency-key') ?? undefined,
  });
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid CRM task command', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    const result = await createTask({ ...parsed.data, actorUserId: access.userId });
    return NextResponse.json(result.task, { status: result.created ? 201 : 200 });
  } catch (error) {
    return taskServiceErrorResponse(error, 'Unable to create CRM task');
  }
}
