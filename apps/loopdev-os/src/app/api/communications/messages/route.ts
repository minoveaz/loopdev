import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    { error: 'Message creation is restricted to Communications Core' },
    { status: 405 },
  );
}

export async function PATCH(request: Request) {
  void request;
  return NextResponse.json(
    { error: 'Message status is restricted to the Communications worker' },
    { status: 405 },
  );
}

export async function PUT(request: Request) {
  void request;
  return NextResponse.json(
    { error: 'Message retry is restricted to the Communications worker' },
    { status: 405 },
  );
}
