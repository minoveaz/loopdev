import { NextResponse } from 'next/server';
import { CrmLeadQuerySchema, CrmUpdateLeadCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { leadServiceErrorResponse } from '../_lib/leadErrors';
import { listLeads, updateLead } from '@/services/crm/leads';

export async function GET(request: Request) {
  const parsed = CrmLeadQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid CRM lead query', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    return NextResponse.json(await listLeads(parsed.data));
  } catch (error) {
    return leadServiceErrorResponse(error, 'Unable to list CRM leads');
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CrmUpdateLeadCommandSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid CRM lead update', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    );
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    return NextResponse.json(await updateLead(parsed.data));
  } catch (error) {
    return leadServiceErrorResponse(error, 'Unable to update CRM lead');
  }
}
