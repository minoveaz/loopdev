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

export function normalizeWhatsAppPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) throw new Error('WhatsApp phone must contain digits');
  return `+${digits}`;
}

function timestamp(value: unknown) {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? new Date(seconds * 1000).toISOString() : new Date().toISOString();
}

function messageBody(message: Record<string, any>) {
  if (message.type === 'text') return message.text?.body ?? null;
  if (message.type === 'interactive') return message.interactive?.button_reply?.title ?? message.interactive?.list_reply?.title ?? null;
  if (message.type === 'location') return message.location?.name ?? message.location?.address ?? null;
  return message[message.type]?.caption ?? null;
}

function mediaFor(message: Record<string, any>) {
  const media = message[message.type];
  if (!media?.id || !['image', 'document', 'audio', 'video'].includes(message.type)) return null;
  return { providerMediaId: media.id, mimeType: media.mime_type ?? null, fileName: media.filename ?? null, caption: media.caption ?? null };
}

export function parseWhatsAppWebhook(payload: unknown): WhatsAppInboundEvent[] {
  const root = payload as Record<string, any> | null;
  if (!root || root.object !== 'whatsapp_business_account') return [];
  const events: WhatsAppInboundEvent[] = [];
  for (const entry of root.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value) continue;
      const phoneNumberId = value.metadata?.phone_number_id ?? null;
      const senderName = value.contacts?.[0]?.profile?.name ?? 'Cliente WhatsApp';
      for (const status of value.statuses ?? []) {
        if (!status.id || !statuses.has(status.status)) continue;
        events.push({ kind: 'status', externalMessageId: status.id, phoneNumberId, status: status.status, providerTimestamp: timestamp(status.timestamp), raw: status });
      }
      for (const message of value.messages ?? []) {
        if (!message.id || !message.from || !message.type) continue;
        const messageType = messageTypes.has(message.type) ? message.type : 'text';
        events.push({ kind: 'message', externalMessageId: message.id, phoneNumberId, fromPhone: normalizeWhatsAppPhone(message.from), senderName, messageType, body: messageBody(message), media: mediaFor(message), referral: message.referral ?? null, providerTimestamp: timestamp(message.timestamp), raw: message });
      }
    }
  }
  return events;
}
