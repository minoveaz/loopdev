import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const verifyToken = Deno.env.get('META_WHATSAPP_VERIFY_TOKEN');
const appSecret = Deno.env.get('META_APP_SECRET');
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const timingSafeEqual = (left: Uint8Array, right: Uint8Array) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const hexToBytes = (hex: string) => new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []);

async function verifySignature(body: string, header: string | null) {
  if (!appSecret || !header?.startsWith('sha256=')) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(appSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)));
  return timingSafeEqual(digest, hexToBytes(header.slice(7)));
}

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) throw new Error('Invalid WhatsApp phone');
  return `+${digits}`;
};

const timestamp = (value: unknown) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? new Date(seconds * 1000).toISOString() : new Date().toISOString();
};

const eventKey = (kind: string, id: string) => `${kind}:${id}`;

Deno.serve(async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    if (url.searchParams.get('hub.mode') === 'subscribe' && url.searchParams.get('hub.verify_token') === verifyToken) {
      return new Response(url.searchParams.get('hub.challenge') ?? '', { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const rawBody = await request.text();
  if (!(await verifySignature(rawBody, request.headers.get('x-hub-signature-256')))) {
    return json({ error: 'Invalid webhook signature' }, 401);
  }

  try {
    const payload = JSON.parse(rawBody) as Record<string, any>;
    if (payload.object !== 'whatsapp_business_account') return json({ received: true, events: 0 });
    let processed = 0;
    let duplicates = 0;

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        const phoneNumberId = value?.metadata?.phone_number_id;
        if (!phoneNumberId) continue;
        const { data: account, error: accountError } = await supabase.from('communication_accounts')
          .select('id, organization_id').eq('external_account_id', phoneNumberId).maybeSingle();
        if (accountError) throw accountError;
        if (!account) return json({ error: 'WhatsApp account not configured' }, 404);

        for (const status of value.statuses ?? []) {
          if (!status.id) continue;
          const result = await supabase.from('communication_webhook_events').insert({
            organization_id: account.organization_id, account_id: account.id,
            external_event_id: eventKey('status', status.id), external_message_id: status.id,
            payload_version: 'whatsapp-cloud-v1',
          });
          if (result.error?.code === '23505') duplicates += 1;
          else if (result.error) throw result.error;
          else processed += 1;
        }

        for (const message of value.messages ?? []) {
          if (!message.id || !message.from) continue;
          const result = await supabase.from('communication_webhook_events').insert({
            organization_id: account.organization_id, account_id: account.id,
            external_event_id: eventKey('message', message.id), external_message_id: message.id,
            payload_version: 'whatsapp-cloud-v1',
          });
          if (result.error?.code === '23505') duplicates += 1;
          else if (result.error) throw result.error;
          else processed += 1;
          // Message-to-CRM persistence follows after event registration.
          void normalizePhone(message.from);
          void timestamp(message.timestamp);
        }
      }
    }
    return json({ received: true, events: processed + duplicates, processed, duplicates });
  } catch (error) {
    console.error('LoopDev WhatsApp webhook failed', error);
    return json({ error: 'Webhook processing failed' }, 500);
  }
});
