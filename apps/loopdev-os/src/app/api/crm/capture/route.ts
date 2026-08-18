import { NextResponse } from 'next/server';
import { CrmCaptureLeadCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { leadServiceErrorResponse } from '../_lib/leadErrors';
import { captureLead } from '@/services/crm/leads';

export async function POST(request: Request) {
  const parsed = CrmCaptureLeadCommandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid lead capture payload', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    const result = await captureLead(parsed.data, access.userId);
    return NextResponse.json(result, { status: result.reused ? 200 : 201 });
  } catch (error) {
    return leadServiceErrorResponse(error, 'Unable to capture CRM lead');
  }
}
