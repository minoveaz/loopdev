import { NextResponse } from 'next/server';
import { CrmCreateOpportunityFromLeadCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../_lib/access';
import { leadServiceErrorResponse } from '../../_lib/leadErrors';
import { createOpportunityFromLead } from '@/services/crm/leads';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body) || 'contactId' in body) {
    return NextResponse.json(
      { error: 'Invalid CRM lead conversion command', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }
  const parsed = CrmCreateOpportunityFromLeadCommandSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      {
        error: 'Invalid CRM lead conversion command',
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
    const { opportunity, created } = await createOpportunityFromLead(parsed.data, access.userId);
    return NextResponse.json(opportunity, { status: created ? 201 : 200 });
  } catch (error) {
    return leadServiceErrorResponse(error, 'Unable to convert CRM lead to opportunity');
  }
}
