import { NextResponse } from 'next/server';
import {
  CrmUpdateOpportunityCommandSchema,
  CrmGetOpportunityQuerySchema,
} from '@loopdev/contracts';
import { authorizeCrm } from '../../_lib/access';
import { opportunityServiceErrorResponse } from '../../_lib/opportunityErrors';
import { getOpportunity, updateOpportunity } from '@/services/crm/pipeline';

type Context = { params: Promise<{ opportunityId: string }> };

export async function GET(request: Request, context: Context) {
  const { opportunityId } = await context.params;
  const parsed = CrmGetOpportunityQuerySchema.safeParse({
    organizationId: new URL(request.url).searchParams.get('organizationId'),
    opportunityId,
  });
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid CRM opportunity query', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed)
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    const opportunity = await getOpportunity(parsed.data.organizationId, opportunityId);
    if (!opportunity)
      return NextResponse.json(
        { error: 'CRM opportunity not found', code: 'NOT_FOUND' },
        { status: 404 },
      );
    return NextResponse.json(opportunity);
  } catch (error) {
    return opportunityServiceErrorResponse(error, 'Unable to load CRM opportunity');
  }
}

export async function PATCH(request: Request, context: Context) {
  const { opportunityId } = await context.params;
  const parsed = CrmUpdateOpportunityCommandSchema.safeParse({
    ...(await request.json().catch(() => null)),
    opportunityId,
  });
  if (!parsed.success)
    return NextResponse.json(
      {
        error: 'Invalid CRM opportunity update',
        code: 'VALIDATION_ERROR',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await updateOpportunity(parsed.data, access.userId));
  } catch (error) {
    return opportunityServiceErrorResponse(error, 'Unable to update CRM opportunity');
  }
}
