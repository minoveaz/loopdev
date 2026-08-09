import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { registerWebhookEvent } from '@/services/communications/core';
import { parseWhatsAppWebhook } from '@/services/communications/whatsapp';
import { verifyWhatsAppSignature } from '@/services/communications/whatsappSignature';

async function persistInboundMessage(supabase: ReturnType<typeof createAdminSupabaseClient>, account: { id: string; organization_id: string }, event: Extract<Awaited<ReturnType<typeof parseWhatsAppWebhook>>[number], { kind: 'message' }>) {
  const contactResult = await supabase.from('crm_contacts').select('id')
    .eq('organization_id', account.organization_id).eq('phone_normalized', event.fromPhone).maybeSingle();
  if (contactResult.error) throw contactResult.error;
  let contactId = contactResult.data?.id;
  if (!contactId) {
    const created = await supabase.from('crm_contacts').insert({
      organization_id: account.organization_id,
      first_name: event.senderName || event.fromPhone,
      phone: event.fromPhone,
      phone_normalized: event.fromPhone,
    }).select('id').single();
    if (created.error?.code === '23505') {
      const existing = await supabase.from('crm_contacts').select('id').eq('organization_id', account.organization_id).eq('phone_normalized', event.fromPhone).single();
      if (existing.error) throw existing.error;
      contactId = existing.data.id;
    } else if (created.error) throw created.error;
    else contactId = created.data.id;
  }

  const channelResult = await supabase.from('communication_channels').select('id')
    .eq('organization_id', account.organization_id).eq('account_id', account.id)
    .eq('channel', 'whatsapp').eq('address', event.fromPhone).maybeSingle();
  if (channelResult.error) throw channelResult.error;
  let channelId = channelResult.data?.id;
  if (!channelId) {
    const created = await supabase.from('communication_channels').insert({
      organization_id: account.organization_id, account_id: account.id, contact_id: contactId,
      channel: 'whatsapp', address: event.fromPhone, display_name: event.senderName, is_primary: true,
    }).select('id').single();
    if (created.error?.code === '23505') {
      const existing = await supabase.from('communication_channels').select('id').eq('organization_id', account.organization_id).eq('account_id', account.id).eq('channel', 'whatsapp').eq('address', event.fromPhone).single();
      if (existing.error) throw existing.error;
      channelId = existing.data.id;
    } else if (created.error) throw created.error;
    else channelId = created.data.id;
  }

  const conversationResult = await supabase.from('communication_conversations').select('id')
    .eq('organization_id', account.organization_id).eq('contact_id', contactId).eq('channel_id', channelId)
    .in('status', ['open', 'pending']).order('updated_at', { ascending: false }).limit(1).maybeSingle();
  if (conversationResult.error) throw conversationResult.error;
  let conversationId = conversationResult.data?.id;
  if (!conversationId) {
    const created = await supabase.from('communication_conversations').insert({
      organization_id: account.organization_id, contact_id: contactId, channel_id: channelId,
      channel: 'whatsapp', status: 'open', last_inbound_at: event.providerTimestamp,
      window_expires_at: new Date(Date.parse(event.providerTimestamp) + 24 * 60 * 60 * 1000).toISOString(),
    }).select('id').single();
    if (created.error) throw created.error;
    conversationId = created.data.id;
  } else {
    const updated = await supabase.from('communication_conversations').update({
      last_inbound_at: event.providerTimestamp,
      window_expires_at: new Date(Date.parse(event.providerTimestamp) + 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', conversationId).select('id').single();
    if (updated.error) throw updated.error;
  }

  const message = await supabase.from('communication_messages').insert({
    organization_id: account.organization_id, conversation_id: conversationId,
    external_id: event.externalMessageId, direction: 'inbound', status: 'delivered', body: event.body ?? `[whatsapp:${event.messageType}]`,
  });
  if (message.error && message.error.code !== '23505') throw message.error;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  if (mode === 'subscribe' && token && token === process.env.META_WHATSAPP_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret || !verifyWhatsAppSignature(rawBody, request.headers.get('x-hub-signature-256'), appSecret)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }
  try {
    const payload = JSON.parse(rawBody) as unknown;
    const events = parseWhatsAppWebhook(payload);
    if (!events.length) return NextResponse.json({ received: true, events: 0 });
    const supabase = createAdminSupabaseClient();
    let duplicates = 0;
    for (const event of events) {
      if (!event.phoneNumberId) continue;
      const { data: account, error: accountError } = await supabase.from('communication_accounts')
        .select('id, organization_id').eq('external_account_id', event.phoneNumberId).maybeSingle();
      if (accountError || !account) return NextResponse.json({ error: 'WhatsApp account not configured' }, { status: 404 });
      const result = await registerWebhookEvent({
        organizationId: account.organization_id,
        accountId: account.id,
        externalEventId: `${event.kind}:${event.externalMessageId}`,
        externalMessageId: event.externalMessageId,
        payloadVersion: 'whatsapp-cloud-v1',
      }, supabase);
      if (result.duplicate) duplicates += 1;
      if (event.kind === 'message') {
        await persistInboundMessage(supabase, account, event);
      } else {
        const message = await supabase.from('communication_messages').select('id')
          .eq('organization_id', account.organization_id).eq('external_id', event.externalMessageId).maybeSingle();
        if (message.error) throw message.error;
        if (message.data) {
          const status = await supabase.from('communication_message_statuses').insert({
            organization_id: account.organization_id, message_id: message.data.id,
            status: event.status, provider_timestamp: event.providerTimestamp,
          });
          if (status.error && status.error.code !== '23505') throw status.error;
          const updated = await supabase.from('communication_messages').update({ status: event.status, updated_at: new Date().toISOString() })
            .eq('organization_id', account.organization_id).eq('id', message.data.id);
          if (updated.error) throw updated.error;
        }
      }
      await supabase.from('communication_webhook_events').update({
        processing_status: 'processed', processed_at: new Date().toISOString(),
      }).eq('organization_id', account.organization_id).eq('account_id', account.id)
        .eq('external_event_id', `${event.kind}:${event.externalMessageId}`);
    }
    return NextResponse.json({ received: true, events: events.length, duplicates });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
