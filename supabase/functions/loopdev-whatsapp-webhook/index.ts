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

const messageBody = (message: Record<string, any>) => {
  if (message.type === 'text') return message.text?.body ?? null;
  if (message.type) return `[whatsapp:${message.type}]`;
  return null;
};

async function persistInboundMessage(
  account: { id: string; organization_id: string },
  value: Record<string, any>,
  message: Record<string, any>,
) {
  const phone = normalizePhone(String(message.from));
  const profileName = value.contacts?.find((contact: Record<string, any>) => contact.wa_id === message.from)?.profile?.name;
  const contactResult = await supabase.rpc('crm_resolve_whatsapp_inbound_contact', {
    p_organization_id: account.organization_id,
    p_phone: phone,
    p_profile_name: profileName ?? null,
  }).single();
  if (contactResult.error || !contactResult.data) throw contactResult.error ?? new Error('Unable to resolve CRM contact');
  const contactId = contactResult.data.contact_id;

  const channelResult = await supabase.from('communication_channels').select('id')
    .eq('organization_id', account.organization_id).eq('account_id', account.id)
    .eq('channel', 'whatsapp').eq('address', phone).maybeSingle();
  if (channelResult.error) throw channelResult.error;
  let channelId = channelResult.data?.id;
  if (!channelId) {
    const createdChannel = await supabase.from('communication_channels').insert({
      organization_id: account.organization_id, account_id: account.id, contact_id: contactId,
      channel: 'whatsapp', address: phone, display_name: profileName ?? null, is_primary: true,
    }).select('id').single();
    if (createdChannel.error?.code === '23505') {
      const existingChannel = await supabase.from('communication_channels').select('id')
        .eq('organization_id', account.organization_id).eq('account_id', account.id)
        .eq('channel', 'whatsapp').eq('address', phone).single();
      if (existingChannel.error) throw existingChannel.error;
      channelId = existingChannel.data.id;
    } else if (createdChannel.error) throw createdChannel.error;
    else channelId = createdChannel.data.id;
  }

  const conversationResult = await supabase.from('communication_conversations').select('id')
    .eq('organization_id', account.organization_id).eq('contact_id', contactId)
    .eq('channel_id', channelId).in('status', ['open', 'pending']).order('updated_at', { ascending: false }).limit(1).maybeSingle();
  if (conversationResult.error) throw conversationResult.error;
  let conversationId = conversationResult.data?.id;
  if (!conversationId) {
    const createdConversation = await supabase.from('communication_conversations').insert({
      organization_id: account.organization_id, contact_id: contactId, channel_id: channelId,
      channel: 'whatsapp', status: 'open', last_inbound_at: timestamp(message.timestamp),
      window_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }).select('id').single();
    if (createdConversation.error) throw createdConversation.error;
    conversationId = createdConversation.data.id;
  } else {
    const updatedConversation = await supabase.from('communication_conversations').update({
      last_inbound_at: timestamp(message.timestamp),
      window_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', conversationId).select('id').single();
    if (updatedConversation.error) throw updatedConversation.error;
  }

  const createdMessage = await supabase.from('communication_messages').insert({
    organization_id: account.organization_id, conversation_id: conversationId,
    external_id: message.id, direction: 'inbound', status: 'delivered', body: messageBody(message),
  });
  if (createdMessage.error && createdMessage.error.code !== '23505') throw createdMessage.error;
}

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
  const signature = request.headers.get('x-hub-signature-256');
  const signatureValid = await verifySignature(rawBody, signature);
  if (!signatureValid) {
    console.warn('WhatsApp webhook signature rejected', {
      hasAppSecret: Boolean(appSecret),
      hasSignature: Boolean(signature),
      signatureLength: signature?.length ?? 0,
      bodyLength: rawBody.length,
    });
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
        if (!account) {
          console.warn('WhatsApp account not configured', {
            phoneNumberId,
            object: payload.object,
          });
          return json({ error: 'WhatsApp account not configured' }, 404);
        }

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
          const messageResult = await supabase.from('communication_messages').select('id')
            .eq('organization_id', account.organization_id).eq('external_id', status.id).maybeSingle();
          if (messageResult.error) throw messageResult.error;
          if (messageResult.data) {
            const statusResult = await supabase.from('communication_message_statuses').insert({
              organization_id: account.organization_id, message_id: messageResult.data.id,
              status: status.status, provider_timestamp: timestamp(status.timestamp),
            });
            if (statusResult.error && statusResult.error.code !== '23505') throw statusResult.error;
            const updateResult = await supabase.from('communication_messages').update({
              status: status.status, updated_at: new Date().toISOString(),
            }).eq('organization_id', account.organization_id).eq('id', messageResult.data.id);
            if (updateResult.error) throw updateResult.error;
          }
          const processedEvent = await supabase.from('communication_webhook_events').update({
            processing_status: 'processed', processed_at: new Date().toISOString(),
          }).eq('organization_id', account.organization_id).eq('account_id', account.id)
            .eq('external_event_id', eventKey('status', status.id));
          if (processedEvent.error) throw processedEvent.error;
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
          await persistInboundMessage(account, value, message);
          await supabase.from('communication_webhook_events').update({
            processing_status: 'processed', processed_at: new Date().toISOString(),
          }).eq('organization_id', account.organization_id).eq('account_id', account.id)
            .eq('external_event_id', eventKey('message', message.id));
        }
      }
    }
    return json({ received: true, events: processed + duplicates, processed, duplicates });
  } catch (error) {
    console.error('LoopDev WhatsApp webhook failed', error);
    return json({ error: 'Webhook processing failed' }, 500);
  }
});
