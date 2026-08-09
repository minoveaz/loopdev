import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { registerWebhookEvent } from '@/services/communications/core';
import { parseWhatsAppWebhook } from '@/services/communications/whatsapp';
import { verifyWhatsAppSignature } from '@/services/communications/whatsappSignature';

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
    const payload = JSON.parse(rawBody) as Record<string, any>;
    const events = parseWhatsAppWebhook(payload);
    const phoneNumberId = events.find((event) => event.phoneNumberId)?.phoneNumberId;
    if (!phoneNumberId) return NextResponse.json({ received: true, events: 0 });
    const supabase = createAdminSupabaseClient();
    const { data: account, error: accountError } = await supabase.from('communication_accounts')
      .select('id, organization_id')
      .eq('external_account_id', phoneNumberId)
      .maybeSingle();
    if (accountError || !account) return NextResponse.json({ error: 'WhatsApp account not configured' }, { status: 404 });
    let duplicates = 0;
    for (const event of events) {
      const result = await registerWebhookEvent({
        organizationId: account.organization_id,
        accountId: account.id,
        externalEventId: `${event.kind}:${event.externalMessageId}`,
        externalMessageId: event.externalMessageId,
        payloadVersion: 'whatsapp-cloud-v1',
      }, supabase);
      if (result.duplicate) duplicates += 1;
    }
    return NextResponse.json({ received: true, events: events.length, duplicates });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
