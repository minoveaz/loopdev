import { NextResponse } from 'next/server';
import type { LeadErrorCode } from '@loopdev/contracts';

const KNOWN_ERRORS: Record<string, { status: number; code: LeadErrorCode }> = {
  'CRM lead update conflict or not found': { status: 409, code: 'CONFLICT' },
  'CRM lead not found': { status: 404, code: 'NOT_FOUND' },
  'CRM lead status transition is not allowed': { status: 409, code: 'INVALID_STATUS_TRANSITION' },
  'CRM lead is not qualified for conversion': { status: 409, code: 'INVALID_STATUS_TRANSITION' },
  'CRM contact required for lead capture': { status: 400, code: 'CONTACT_REQUIRED' },
};

/**
 * Maps known CRM Lead service errors to a stable `{ error, code }` envelope
 * and HTTP status. Unknown errors fall back to a generic 500 without leaking
 * internal details.
 */
export function leadServiceErrorResponse(error: unknown, fallback: string) {
  if (error instanceof Error) {
    const known = KNOWN_ERRORS[error.message];
    if (known) {
      return NextResponse.json({ error: error.message, code: known.code }, { status: known.status });
    }
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}
