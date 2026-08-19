import { NextResponse } from 'next/server';
import { CrmMoveLeadStatusCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../_lib/access';
import { leadServiceErrorResponse } from '../../_lib/leadErrors';
import { moveLeadStatus } from '@/services/crm/leads';

export async function POST(request: Request) {
  const parsed = CrmMoveLeadStatusCommandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      {
        error: 'Invalid CRM lead status command',
        code: 'VALIDATION_ERROR',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    return NextResponse.json(await moveLeadStatus(parsed.data, access.userId));
  } catch (error) {
    return leadServiceErrorResponse(error, 'Unable to move CRM lead status');
  }
}
