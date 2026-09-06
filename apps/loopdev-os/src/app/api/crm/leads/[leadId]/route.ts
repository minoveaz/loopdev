import { NextResponse } from 'next/server';
import { CrmLeadQuerySchema, CrmLeadSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../_lib/access';
import { leadServiceErrorResponse } from '../../_lib/leadErrors';
import { getLead } from '@/services/crm/leads';

type Context = { params: Promise<{ leadId: string }> };

export async function GET(request: Request, context: Context) {
  const { leadId } = await context.params;
  const query = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = CrmLeadQuerySchema.pick({ organizationId: true }).safeParse({
    organizationId: query.organizationId,
  });
  const parsedLeadId = CrmLeadSchema.shape.id.safeParse(leadId);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid CRM lead query',
        code: 'VALIDATION_ERROR',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }
  if (!parsedLeadId.success) {
    return NextResponse.json(
      {
        error: 'Invalid CRM lead id',
        code: 'VALIDATION_ERROR',
        details: parsedLeadId.error.flatten(),
      },
      { status: 400 },
    );
  }
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  }
  try {
    const lead = await getLead(parsed.data.organizationId, leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found', code: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error) {
    return leadServiceErrorResponse(error, 'Unable to load CRM lead');
  }
}
