import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listCommunicationTemplates } from '@/services/communications/core';
import { authorizeCommunications } from '../_lib/access';

const QuerySchema = z.object({ organizationId: z.string().uuid() });

export async function GET(request: Request) {
  const parsed = QuerySchema.safeParse({
    organizationId: new URL(request.url).searchParams.get('organizationId'),
  });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid organization' }, { status: 400 });
  const access = await authorizeCommunications(parsed.data.organizationId, 'communications.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json({ templates: await listCommunicationTemplates(parsed.data.organizationId) });
  } catch {
    return NextResponse.json({ error: 'Unable to list communication templates' }, { status: 500 });
  }
}