import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    { error: 'Conversation creation is restricted to Communications Core' },
    { status: 405 },
  );
}
