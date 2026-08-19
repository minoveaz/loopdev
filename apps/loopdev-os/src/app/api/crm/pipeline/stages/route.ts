import { NextResponse } from 'next/server';
import { CrmConfigurePipelineStageCommandSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../_lib/access';
import { opportunityServiceErrorResponse } from '../../_lib/opportunityErrors';
import { configurePipelineStage, listPipelineStages } from '@/services/crm/pipeline';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const organizationId = params.get('organizationId');
  if (!organizationId)
    return NextResponse.json({ error: 'organizationId is required', code: 'VALIDATION_ERROR' }, { status: 400 });
  const access = await authorizeCrm(organizationId, 'crm.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await listPipelineStages({
      organizationId,
      workspaceId: params.get('workspaceId') ?? undefined,
    }));
  } catch (error) {
    return opportunityServiceErrorResponse(error, 'Unable to list CRM pipeline stages');
  }
}

export async function POST(request: Request) {
  const parsed = CrmConfigurePipelineStageCommandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid CRM stage configuration', code: 'VALIDATION_ERROR', details: parsed.error.flatten() }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await configurePipelineStage(parsed.data), { status: parsed.data.stageId ? 200 : 201 });
  } catch (error) {
    return opportunityServiceErrorResponse(error, 'Unable to configure CRM pipeline stage');
  }
}
