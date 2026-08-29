import { NextResponse } from 'next/server';

export async function POST(_request: Request) {
  return NextResponse.json({ error: 'Message creation is restricted to Communications Core' }, { status: 405 });
}

export async function PATCH(_request: Request) {
  return NextResponse.json({ error: 'Message status is restricted to the Communications worker' }, { status: 405 });
}

export async function PUT(_request: Request) {
  return NextResponse.json({ error: 'Message retry is restricted to the Communications worker' }, { status: 405 });
}
