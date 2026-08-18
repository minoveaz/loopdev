import { NextResponse } from 'next/server';
import { CrmMoveOpportunityStageCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../../_lib/access';
import { opportunityServiceErrorResponse } from '../../../_lib/opportunityErrors';
import { moveOpportunityStage } from '@/services/crm/pipeline';

type Context = { params: Promise<{ opportunityId: string }> };

export async function PATCH(request: Request, context: Context) {
  const { opportunityId } = await context.params;
  const parsed = CrmMoveOpportunityStageCommandSchema.safeParse({
    ...(await request.json().catch(() => null)),
    opportunityId,
  });
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid CRM stage move', code: 'VALIDATION_ERROR', details: parsed.error.flatten() }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await moveOpportunityStage(parsed.data));
  } catch (error) {
    return opportunityServiceErrorResponse(error, 'Unable to move CRM opportunity stage');
  }
}
