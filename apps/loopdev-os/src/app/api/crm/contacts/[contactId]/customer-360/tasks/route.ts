import { NextResponse } from 'next/server';
import { CreateContextTaskCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../../../_lib/access';
import {
  customer360ErrorResponse,
  unauthorizedCustomer360Response,
} from '../../../../_lib/customer360Errors';
import { createContextTask } from '@/services/crm/customer360';

type Context = { params: Promise<{ contactId: string }> };

export async function POST(request: Request, context: Context) {
  const { contactId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = CreateContextTaskCommandSchema.safeParse({
    ...(body ?? {}),
    contactId,
    tenantId: body?.tenantId ?? body?.organizationId,
    idempotencyKey: body?.idempotencyKey ?? request.headers.get('idempotency-key') ?? undefined,
  });
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid Customer 360 task command', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.tenantId, 'crm.manage');
  if (!access.allowed) return unauthorizedCustomer360Response(access.status);
  try {
    const result = await createContextTask({ ...parsed.data, actorUserId: access.userId });
    return NextResponse.json(result.task, { status: result.created ? 201 : 200 });
  } catch (error) {
    return customer360ErrorResponse(error, 'Unable to create Customer 360 task');
  }
}
