import { NextResponse } from 'next/server';
import { CreateCommunicationInternalNoteCommandSchema } from '@loopdev/contracts';
import { createInternalNote } from '@/services/communications/core';
import { authorizeCommunications } from '../_lib/access';

export async function POST(request: Request) {
  const parsed = CreateCommunicationInternalNoteCommandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid note payload', details: parsed.error.flatten() }, { status: 400 });
  const access = await authorizeCommunications(parsed.data.organizationId, 'communications.note');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await createInternalNote({ ...parsed.data, authorId: access.userId }), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to create communication note' }, { status: 500 }); }
}
