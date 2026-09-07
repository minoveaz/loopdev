import { NextResponse } from 'next/server';

function retiredWebhookResponse() {
  return NextResponse.json(
    { error: 'WhatsApp webhook moved to the registered Supabase Edge Function' },
    { status: 410 },
  );
}

export async function GET(request: Request) {
  void request;
  return retiredWebhookResponse();
}

export async function POST(request: Request) {
  void request;
  return retiredWebhookResponse();
}
