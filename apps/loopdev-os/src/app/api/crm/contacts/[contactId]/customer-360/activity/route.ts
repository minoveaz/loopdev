import { NextResponse } from 'next/server';
import { Customer360ActivityQuerySchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../../../_lib/access';
import {
  customer360ErrorResponse,
  unauthorizedCustomer360Response,
} from '../../../../_lib/customer360Errors';
import { listCustomer360Activity } from '@/services/crm/customer360';

type Context = { params: Promise<{ contactId: string }> };

export async function GET(request: Request, context: Context) {
  const { contactId } = await context.params;
  const query = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = Customer360ActivityQuerySchema.safeParse({ ...query, contactId });
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid Customer 360 activity query', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.tenantId, 'crm.read');
  if (!access.allowed) return unauthorizedCustomer360Response(access.status);
  try {
    return NextResponse.json(await listCustomer360Activity(parsed.data));
  } catch (error) {
    return customer360ErrorResponse(error, 'Unable to load Customer 360 activity');
  }
}
