import { CommunicationInboxModelSchema, CommunicationInboxTemplateSchema } from '@loopdev/contracts';
import { COMMUNICATIONS_INBOX_MODEL, COMMUNICATIONS_INBOX_TEMPLATES } from './inbox.fixture';
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
  loadTemplates,
  assignToSelf: async (conversation) => executeInboxAction(conversation, { action: 'assign' }),
  send: async (conversation, mode, body) =>
    executeInboxAction(conversation, { action: mode === 'note' ? 'note' : 'reply', body }),
  changeStatus: async (conversation, status) =>
    executeInboxAction(conversation, { action: 'status', status }),
  sendTemplate: async (conversation, templateId, templateParameters) =>
    executeInboxAction(conversation, { action: 'template', templateId, templateParameters }),
};

async function loadTemplates(organizationId: string) {
  const response = await fetch(
    `/api/communications/templates?organizationId=${encodeURIComponent(organizationId)}`,
  );
  if (!response.ok) throw new Error('Unable to load communication templates');
  const payload = (await response.json()) as { templates: unknown };
  return CommunicationInboxTemplateSchema.array().parse(payload.templates);
}

async function executeInboxAction(
  conversation: InboxConversation,
  action:
    | { action: 'assign' }
    | { action: 'reply'; body: string }
    | { action: 'note'; body: string }
    | { action: 'template'; templateId: string; templateParameters: Record<string, string> }
    | { action: 'status'; status: InboxStatus },
): Promise<InboxActionResult> {
  const response = await fetch('/api/communications/inbox/actions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      organizationId: conversation.organizationId,
      conversationId: conversation.id,
      ...action,
    }),
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? 'Unable to update communication conversation');
  }

  const model = await loadInbox(conversation.organizationId);
  return { conversation: model.conversations.find(({ id }) => id === conversation.id) };
}

function replaceConversation(conversation: InboxConversation, update: Partial<InboxConversation>) {
  return { conversation: { ...conversation, ...update } } satisfies InboxActionResult;
}

export function createFixtureInboxDataSource(actorLabel: string): InboxDataSource {
  return {
    load: async () => COMMUNICATIONS_INBOX_MODEL,
    loadTemplates: async () => COMMUNICATIONS_INBOX_TEMPLATES,
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
    sendTemplate: async (conversation, templateId, templateParameters) => {
      const template = COMMUNICATIONS_INBOX_TEMPLATES.find(({ id }) => id === templateId);
      const now = new Date().toISOString();
      const body = template
        ? template.body.replace(/{{\s*([^}]+)\s*}}/g, (_, name: string) => templateParameters[name] ?? '')
        : templateId;
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
            status: 'queued',
            body,
            templateId,
            createdAt: now,
            updatedAt: now,
            kind: 'message',
            authorName: actorLabel,
          },
        ],
      });
    },
  };
}
