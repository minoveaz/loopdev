import { NextResponse } from 'next/server';
import type { Customer360ErrorCode } from '@loopdev/contracts';

const STATUS_BY_CODE: Record<Customer360ErrorCode, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 400,
  CROSS_TENANT_REFERENCE: 409,
  ACTIVITY_DEDUPLICATION_ERROR: 500,
};

export function customer360ErrorResponse(error: unknown, fallback: string) {
  if (error instanceof Error) {
    const code = (error as Error & { code?: unknown }).code;
    if (typeof code === 'string' && code in STATUS_BY_CODE)
      return NextResponse.json(
        { error: error.message, code },
        { status: STATUS_BY_CODE[code as Customer360ErrorCode] },
      );
    if (error.name === 'ZodError')
      return NextResponse.json(
        { error: 'Invalid Customer 360 request', code: 'VALIDATION_ERROR' },
        { status: 400 },
      );
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export function unauthorizedCustomer360Response(status: 401 | 403) {
  return NextResponse.json(
    { error: 'Unauthorized', code: status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN' },
    { status },
  );
}
