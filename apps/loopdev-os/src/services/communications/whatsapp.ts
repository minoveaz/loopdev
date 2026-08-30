import type { MessagingProvider } from '@loopdev/contracts';

export type WhatsAppInboundEvent =
  | {
      kind: 'message';
      externalMessageId: string;
      phoneNumberId: string | null;
      fromPhone: string;
      senderName: string;
      messageType: 'text' | 'image' | 'document' | 'audio' | 'video' | 'location' | 'interactive';
      body: string | null;
      media: { providerMediaId: string; mimeType: string | null; fileName: string | null; caption: string | null } | null;
      referral: Record<string, unknown> | null;
      providerTimestamp: string;
      raw: Record<string, unknown>;
    }
  | {
      kind: 'status';
      externalMessageId: string;
      phoneNumberId: string | null;
      status: 'sent' | 'delivered' | 'read' | 'failed';
      providerTimestamp: string;
      raw: Record<string, unknown>;
    };

const messageTypes = new Set(['text', 'image', 'document', 'audio', 'video', 'location', 'interactive']);
const statuses = new Set(['sent', 'delivered', 'read', 'failed']);
type WhatsAppMessageType = 'text' | 'image' | 'document' | 'audio' | 'video' | 'location' | 'interactive';
type WhatsAppStatus = 'sent' | 'delivered' | 'read' | 'failed';

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject => typeof value === 'object' && value !== null;
const objectValue = (value: unknown): JsonObject | null => isObject(value) ? value : null;

const stringValue = (value: unknown) => typeof value === 'string' ? value : null;

export function normalizeWhatsAppPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) throw new Error('WhatsApp phone must contain digits');
  return `+${digits}`;
}

export type WhatsAppOutboundResult = {
  providerMessageId: string;
  status: 'accepted';
};

export type WhatsAppCloudCredentials = {
  phoneNumberId: string;
  accessToken: string;
  graphApiVersion?: string;
};

export type WhatsAppTemplateRecord = {
  id: string;
  name: string;
  language: string;
  category: 'authentication' | 'marketing' | 'utility';
  status: 'draft' | 'approved' | 'rejected' | 'archived';
  body: string;
  parameterNames: string[];
};

export class WhatsAppProviderError extends Error {
  constructor(
    readonly code: 'PROVIDER_REJECTED' | 'PROVIDER_RATE_LIMITED' | 'PROVIDER_UNAVAILABLE',
    message: string,
  ) {
    super(message);
  }
}

export async function sendWhatsAppText(input: {
  phoneNumberId: string;
  accessToken: string;
  to: string;
  body: string;
  graphApiVersion?: string;
}): Promise<WhatsAppOutboundResult> {
  const response = await fetch(
    `https://graph.facebook.com/${input.graphApiVersion ?? 'v20.0'}/${input.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizeWhatsAppPhone(input.to).replace('+', ''),
        type: 'text',
        text: { body: input.body },
      }),
    },
  );
  const payload = await response.json().catch(() => null) as { messages?: Array<{ id?: string }>; error?: { message?: string } } | null;
  if (!response.ok || !payload?.messages?.[0]?.id) {
    throwWhatsAppProviderError(response.status, payload?.error?.message);
  }
  return { providerMessageId: payload.messages[0].id, status: 'accepted' };
}

export async function sendWhatsAppTemplate(input: {
  phoneNumberId: string;
  accessToken: string;
  to: string;
  templateName: string;
  language: string;
  parameters: string[];
  graphApiVersion?: string;
}): Promise<WhatsAppOutboundResult> {
  const response = await fetch(
    `https://graph.facebook.com/${input.graphApiVersion ?? 'v20.0'}/${input.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizeWhatsAppPhone(input.to).replace('+', ''),
        type: 'template',
        template: {
          name: input.templateName,
          language: { code: input.language },
          components: input.parameters.length
            ? [{ type: 'body', parameters: input.parameters.map((text) => ({ type: 'text', text })) }]
            : [],
        },
      }),
    },
  );
  const payload = await response.json().catch(() => null) as { messages?: Array<{ id?: string }>; error?: { message?: string } } | null;
  if (!response.ok || !payload?.messages?.[0]?.id) {
    throwWhatsAppProviderError(response.status, payload?.error?.message);
  }
  return { providerMessageId: payload.messages[0].id, status: 'accepted' };
}

export function createWhatsAppCloudProvider(resolveCredentials: (accountId: string) => Promise<WhatsAppCloudCredentials>): MessagingProvider {
  return {
    async sendText(input) {
      const credentials = await resolveCredentials(input.accountId);
      const result = await sendWhatsAppText({
        ...credentials,
        to: input.recipient,
        body: input.body,
      });
      return { providerMessageId: result.providerMessageId };
    },
    async sendTemplate(input) {
      const credentials = await resolveCredentials(input.accountId);
      const result = await sendWhatsAppTemplate({
        ...credentials,
        to: input.recipient,
        templateName: input.templateId,
        language: 'es',
        parameters: resolveWhatsAppTemplateParameters(input.parameterNames, input.parameters),
      });
      return { providerMessageId: result.providerMessageId };
    },
  };
}

export function resolveWhatsAppTemplateParameters(parameterNames: string[], parameters: Record<string, string>): string[] {
  const expected = new Set(parameterNames);
  if (expected.size !== parameterNames.length || Object.keys(parameters).length !== expected.size || Object.keys(parameters).some((name) => !expected.has(name))) {
    throw new WhatsAppProviderError('PROVIDER_REJECTED', 'WhatsApp template parameters do not match the approved template');
  }
  return parameterNames.map((name) => parameters[name]);
}

export function normalizeWhatsAppTemplate(value: unknown): WhatsAppTemplateRecord | null {
  const template = objectValue(value);
  const id = stringValue(template?.id);
  const name = stringValue(template?.name);
  const language = stringValue(template?.language);
  const category = stringValue(template?.category)?.toLowerCase();
  const status = stringValue(template?.status)?.toLowerCase();
  if (!id || !name || !language || !category || !status || !['authentication', 'marketing', 'utility'].includes(category)) return null;
  const components = Array.isArray(template?.components) ? template.components.filter(isObject) : [];
  const body = components.find((component) => stringValue(component.type)?.toLowerCase() === 'body');
  const bodyText = stringValue(body?.text);
  if (!bodyText || !['draft', 'approved', 'rejected', 'archived'].includes(status)) return null;
  const parameterNames = [...bodyText.matchAll(/{{\s*([\w.-]+)\s*}}/g)].map((match) => match[1]);
  return { id, name, language, category: category as WhatsAppTemplateRecord['category'], status: status as WhatsAppTemplateRecord['status'], body: bodyText, parameterNames };
}

function throwWhatsAppProviderError(status: number, message?: string): never {
  if (status === 429) throw new WhatsAppProviderError('PROVIDER_RATE_LIMITED', message ?? 'WhatsApp provider rate limit reached');
  if (status >= 500) throw new WhatsAppProviderError('PROVIDER_UNAVAILABLE', message ?? 'WhatsApp provider is unavailable');
  throw new WhatsAppProviderError('PROVIDER_REJECTED', message ?? 'WhatsApp provider rejected the message');
}

function timestamp(value: unknown) {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? new Date(seconds * 1000).toISOString() : new Date().toISOString();
}

function messageBody(message: JsonObject) {
  const type = stringValue(message.type);
  const content = objectValue(message[type ?? '']);
  if (type === 'text') return content ? stringValue(content.body) : null;
  if (type === 'interactive') {
    const buttonReply = isObject(content?.button_reply) ? stringValue(content.button_reply.title) : null;
    const listReply = isObject(content?.list_reply) ? stringValue(content.list_reply.title) : null;
    return buttonReply ?? listReply;
  }
  if (type === 'location') return content ? stringValue(content.name) ?? stringValue(content.address) : null;
  return content ? stringValue(content.caption) : null;
}

function mediaFor(message: JsonObject) {
  const type = stringValue(message.type);
  const media = objectValue(message[type ?? '']);
  const providerMediaId = media ? stringValue(media.id) : null;
  if (!providerMediaId || !['image', 'document', 'audio', 'video'].includes(type ?? '')) return null;
  return { providerMediaId, mimeType: stringValue(media?.mime_type), fileName: stringValue(media?.filename), caption: stringValue(media?.caption) };
}

export function parseWhatsAppWebhook(payload: unknown): WhatsAppInboundEvent[] {
  const root = isObject(payload) ? payload : null;
  if (!root || root.object !== 'whatsapp_business_account') return [];
  const events: WhatsAppInboundEvent[] = [];
  for (const entry of Array.isArray(root.entry) ? root.entry.filter(isObject) : []) {
    for (const change of Array.isArray(entry.changes) ? entry.changes.filter(isObject) : []) {
      const value = isObject(change.value) ? change.value : null;
      if (!value) continue;
      const metadata = isObject(value.metadata) ? value.metadata : null;
      const phoneNumberId = stringValue(metadata?.phone_number_id);
      const contacts = Array.isArray(value.contacts) ? value.contacts : [];
      const firstContact = isObject(contacts[0]) ? contacts[0] : null;
      const profile = isObject(firstContact?.profile) ? firstContact.profile : null;
      const senderName = stringValue(profile?.name) ?? 'Cliente WhatsApp';
      for (const status of Array.isArray(value.statuses) ? value.statuses.filter(isObject) : []) {
        const id = stringValue(status.id);
        const statusValue = stringValue(status.status);
        if (!id || !statusValue || !statuses.has(statusValue)) continue;
        events.push({ kind: 'status', externalMessageId: id, phoneNumberId, status: statusValue as WhatsAppStatus, providerTimestamp: timestamp(status.timestamp), raw: status });
      }
      for (const message of Array.isArray(value.messages) ? value.messages.filter(isObject) : []) {
        const id = stringValue(message.id);
        const from = stringValue(message.from);
        const type = stringValue(message.type);
        if (!id || !from || !type) continue;
        const messageType = messageTypes.has(type) ? type : 'text';
        events.push({ kind: 'message', externalMessageId: id, phoneNumberId, fromPhone: normalizeWhatsAppPhone(from), senderName, messageType: messageType as WhatsAppMessageType, body: messageBody(message), media: mediaFor(message), referral: isObject(message.referral) ? message.referral : null, providerTimestamp: timestamp(message.timestamp), raw: message });
      }
    }
  }
  return events;
}
