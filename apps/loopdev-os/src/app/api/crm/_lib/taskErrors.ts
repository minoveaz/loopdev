import type { TaskErrorCode } from '@loopdev/contracts';
import { crmErrorResponse } from './crmErrors';

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

export function taskServiceErrorResponse(error: unknown, fallback: string) {
  return crmErrorResponse(error, fallback, KNOWN_ERRORS);
}
