import { NextResponse } from 'next/server';
import { CommunicationInboxActionSchema } from '@loopdev/contracts';
import { authorizeCommunications } from '../../_lib/access';
import {
  assignConversationToSelf,
  changeConversationStatus,
  createInternalNote,
  sendWhatsAppConversationTemplate,
  sendWhatsAppConversationText,
} from '@/services/communications/core';

const permissionByAction = {
  assign: 'communications.assign',
  reply: 'communications.reply',
  note: 'communications.note',
  template: 'communications.reply',
  status: 'communications.lifecycle',
} as const;

function errorStatus(message: string) {
  if (message.includes('window has expired')) return 409;
  if (message.includes('does not belong')) return 404;
  return 500;
}

export async function POST(request: Request) {
  const parsed = CommunicationInboxActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid communications action payload' }, { status: 400 });
  }

  const access = await authorizeCommunications(
    parsed.data.organizationId,
    permissionByAction[parsed.data.action],
  );
  if (!access.allowed)
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });

  try {
    switch (parsed.data.action) {
      case 'assign':
        return NextResponse.json(
          await assignConversationToSelf({
            organizationId: parsed.data.organizationId,
            conversationId: parsed.data.conversationId,
            userId: access.userId,
          }),
        );
      case 'reply':
        return NextResponse.json(
          await sendWhatsAppConversationText({
            organizationId: parsed.data.organizationId,
            conversationId: parsed.data.conversationId,
            body: parsed.data.body,
          }),
        );
      case 'note':
        return NextResponse.json(
          await createInternalNote({
            organizationId: parsed.data.organizationId,
            conversationId: parsed.data.conversationId,
            body: parsed.data.body,
            authorId: access.userId,
          }),
          { status: 201 },
        );
      case 'template':
        return NextResponse.json(
          await sendWhatsAppConversationTemplate({
            organizationId: parsed.data.organizationId,
            conversationId: parsed.data.conversationId,
            templateId: parsed.data.templateId,
            templateParameters: parsed.data.templateParameters,
          }),
        );
      case 'status':
        return NextResponse.json(
          await changeConversationStatus({
            organizationId: parsed.data.organizationId,
            conversationId: parsed.data.conversationId,
            status: parsed.data.status,
          }),
        );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to update communication conversation';
    return NextResponse.json({ error: message }, { status: errorStatus(message) });
  }
}
