import { NextResponse } from 'next/server';
import {
  CrmCreateManualOpportunityCommandSchema,
  CrmCreateOpportunityFromLeadCommandSchema,
  CrmOpportunityQuerySchema,
} from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { opportunityServiceErrorResponse } from '../_lib/opportunityErrors';
import { createManualOpportunity, listOpportunities } from '@/services/crm/pipeline';
import { createOpportunityFromLead } from '@/services/crm/leads';

export async function GET(request: Request) {
  const parsed = CrmOpportunityQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid CRM opportunity query', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await listOpportunities(parsed.data));
  } catch (error) {
    return opportunityServiceErrorResponse(error, 'Unable to list CRM opportunities');
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object')
    return NextResponse.json({ error: 'Invalid CRM opportunity command', code: 'VALIDATION_ERROR' }, { status: 400 });

  // Keep the existing conversion adapter intact while manual creation gets
  // the additive Pipeline contract endpoint.
  if ('leadId' in body && 'productKey' in body && !('contactId' in body)) {
    const conversion = CrmCreateOpportunityFromLeadCommandSchema.safeParse(body);
    if (!conversion.success)
      return NextResponse.json({ error: 'Invalid CRM lead conversion command', code: 'VALIDATION_ERROR' }, { status: 400 });
    const access = await authorizeCrm(conversion.data.organizationId, 'crm.manage');
    if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
    try {
      const result = await createOpportunityFromLead(conversion.data);
      return NextResponse.json(result.opportunity, { status: result.created ? 201 : 200 });
    } catch (error) {
      return opportunityServiceErrorResponse(error, 'Unable to convert CRM lead to opportunity');
    }
  }

  const manual = CrmCreateManualOpportunityCommandSchema.safeParse({
    ...body,
    idempotencyKey:
      body.idempotencyKey ?? request.headers.get('idempotency-key') ?? undefined,
  });
  if (!manual.success)
    return NextResponse.json(
      { error: 'Invalid manual CRM opportunity command', code: 'VALIDATION_ERROR', details: manual.error.flatten() },
      { status: 400 },
    );
  const access = await authorizeCrm(manual.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    const result = await createManualOpportunity(manual.data);
    return NextResponse.json(result.opportunity, { status: result.created ? 201 : 200 });
  } catch (error) {
    return opportunityServiceErrorResponse(error, 'Unable to create CRM opportunity');
  }
}
