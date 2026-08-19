import { NextResponse } from 'next/server';
import type { TaskErrorCode } from '@loopdev/contracts';

const KNOWN_ERRORS: Record<string, { status: number; code: TaskErrorCode }> = {
  'CRM task was not found': { status: 404, code: 'NOT_FOUND' },
  'CRM note was not found': { status: 404, code: 'NOT_FOUND' },
  'CRM task update conflict': { status: 409, code: 'CONFLICT' },
  'CRM note update conflict': { status: 409, code: 'CONFLICT' },
  'CRM operation idempotency key was reused': { status: 409, code: 'IDEMPOTENCY_CONFLICT' },
  'CRM relation was not found': { status: 404, code: 'RELATION_NOT_FOUND' },
  'CRM task status transition is not allowed': {
    status: 409,
    code: 'INVALID_STATUS_TRANSITION',
  },
  'Task assignee is not allowed': { status: 403, code: 'ASSIGNMENT_FORBIDDEN' },
  'CRM note edit is forbidden': { status: 403, code: 'NOTE_EDIT_FORBIDDEN' },
  'CRM note moderation is forbidden': { status: 403, code: 'NOTE_MODERATION_FORBIDDEN' },
  'CRM relation is outside the workspace scope': { status: 409, code: 'CROSS_TENANT_REFERENCE' },
  'CRM relation is outside the brand scope': { status: 409, code: 'CROSS_TENANT_REFERENCE' },
};

const STATUS_BY_CODE: Partial<Record<TaskErrorCode, number>> = {
  RELATION_REQUIRED: 400,
  DUE_DATE_INVALID: 400,
  RELATION_CHANGE_FORBIDDEN: 409,
  NOT_FOUND: 404,
  CONFLICT: 409,
  IDEMPOTENCY_CONFLICT: 409,
  RELATION_NOT_FOUND: 404,
  INVALID_STATUS_TRANSITION: 409,
  ASSIGNMENT_FORBIDDEN: 403,
  NOTE_EDIT_FORBIDDEN: 403,
  NOTE_MODERATION_FORBIDDEN: 403,
  CROSS_TENANT_REFERENCE: 409,
};

export function taskServiceErrorResponse(error: unknown, fallback: string) {
  if (error instanceof Error) {
    const code = (error as Error & { code?: unknown }).code;
    if (typeof code === 'string' && code in STATUS_BY_CODE) {
      return NextResponse.json(
        { error: error.message, code },
        { status: STATUS_BY_CODE[code as TaskErrorCode] ?? 500 },
      );
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid CRM task command', code: 'VALIDATION_ERROR' },
        { status: 400 },
      );
    }
    const known = KNOWN_ERRORS[error.message];
    if (known)
      return NextResponse.json({ error: error.message, code: known.code }, { status: known.status });
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}
