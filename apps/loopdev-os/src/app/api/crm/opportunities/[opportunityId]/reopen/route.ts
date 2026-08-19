import { NextResponse } from 'next/server';
import { CrmReopenOpportunityCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../../_lib/access';
import { opportunityServiceErrorResponse } from '../../../_lib/opportunityErrors';
import { reopenOpportunity } from '@/services/crm/pipeline';

type Context = { params: Promise<{ opportunityId: string }> };

export async function POST(request: Request, context: Context) {
  const { opportunityId } = await context.params;
  const parsed = CrmReopenOpportunityCommandSchema.safeParse({
    ...(await request.json().catch(() => null)),
    opportunityId,
  });
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid CRM reopen command', code: 'VALIDATION_ERROR', details: parsed.error.flatten() }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await reopenOpportunity(parsed.data));
  } catch (error) {
    return opportunityServiceErrorResponse(error, 'Unable to reopen CRM opportunity');
  }
}
