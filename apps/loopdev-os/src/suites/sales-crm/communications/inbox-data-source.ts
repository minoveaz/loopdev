import { CommunicationInboxModelSchema } from '@loopdev/contracts';
import { COMMUNICATIONS_INBOX_MODEL } from './inbox.fixture';
import type {
  ComposerMode,
  InboxActionResult,
  InboxConversation,
  InboxDataSource,
  InboxModel,
  InboxStatus,
} from './types';

async function loadInbox(organizationId: string): Promise<InboxModel> {
  const response = await fetch(
    `/api/communications/inbox?organizationId=${encodeURIComponent(organizationId)}`,
  );
  if (!response.ok) throw new Error('Unable to load communications inbox');
  const payload = (await response.json()) as { model: unknown };
  return CommunicationInboxModelSchema.parse(payload.model);
}

export const communicationsInboxApiDataSource: InboxDataSource = {
  load: loadInbox,
};

function replaceConversation(conversation: InboxConversation, update: Partial<InboxConversation>) {
  return { conversation: { ...conversation, ...update } } satisfies InboxActionResult;
}

export function createFixtureInboxDataSource(actorLabel: string): InboxDataSource {
  return {
    load: async () => COMMUNICATIONS_INBOX_MODEL,
    assignToSelf: async (conversation) =>
      replaceConversation(conversation, {
        assignedToUserId: crypto.randomUUID(),
        assignedToName: actorLabel,
      }),
    send: async (conversation, mode: ComposerMode, body: string) => {
      const now = new Date().toISOString();
      return replaceConversation(conversation, {
        preview: body,
        lastActivityAt: now,
        updatedAt: now,
        messages: [
          ...conversation.messages,
          {
            id: crypto.randomUUID(),
            organizationId: conversation.organizationId,
            conversationId: conversation.id,
            externalId: null,
            direction: 'outbound',
            status: mode === 'note' ? 'read' : 'sent',
            body,
            templateId: null,
            createdAt: now,
            updatedAt: now,
            kind: mode === 'note' ? 'note' : 'message',
            authorName: mode === 'note' ? `${actorLabel} · Internal note` : actorLabel,
          },
        ],
      });
    },
    changeStatus: async (conversation, status: InboxStatus) =>
      replaceConversation(conversation, { status }),
  };
}
