import { NextResponse } from 'next/server';
import { TimelineQuerySchema } from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { taskServiceErrorResponse } from '../_lib/taskErrors';
import { listTimeline } from '@/services/crm/tasks';

export async function GET(request: Request) {
  const parsed = TimelineQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid CRM timeline query', code: 'VALIDATION_ERROR' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed)
    return NextResponse.json(
      { error: 'Unauthorized', code: access.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
      { status: access.status },
    );
  try {
    return NextResponse.json(await listTimeline(parsed.data));
  } catch (error) {
    return taskServiceErrorResponse(error, 'Unable to list CRM timeline');
  }
}
