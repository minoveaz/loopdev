import { NextResponse } from 'next/server';
import { CreateCommunicationMessageCommandSchema } from '@loopdev/contracts';
import { createMessage } from '@/services/communications/core';
import { authorizeCommunications } from '../_lib/access';

export async function POST(request: Request) {
  const parsed = CreateCommunicationMessageCommandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid message payload', details: parsed.error.flatten() }, { status: 400 });
  const access = await authorizeCommunications(parsed.data.organizationId, 'communications.send');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await createMessage(parsed.data), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to create communication message' }, { status: 500 }); }
}
