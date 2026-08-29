import { NextResponse } from 'next/server';
export async function POST(_request: Request) {
  return NextResponse.json({ error: 'Conversation creation is restricted to Communications Core' }, { status: 405 });
}
