import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizeCommunications } from '../../_lib/access';
import { sendWhatsAppConversationText } from '@/services/communications/core';

const SendWhatsAppTextSchema = z.object({
  organizationId: z.string().uuid(),
  conversationId: z.string().uuid(),
  body: z.string().trim().min(1).max(4096),
});

export async function POST(request: Request) {
  const parsed = SendWhatsAppTextSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid WhatsApp message payload' }, { status: 400 });
  const access = await authorizeCommunications(parsed.data.organizationId, 'communications.reply');
  if (!access.allowed)
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await sendWhatsAppConversationText(parsed.data), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send WhatsApp message';
    const status = message.includes('window has expired') ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
