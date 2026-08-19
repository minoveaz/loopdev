import type { OpportunityErrorCode } from '@loopdev/contracts';
import { crmErrorResponse } from './crmErrors';

const known: Record<string, { status: number; code: OpportunityErrorCode }> = {
  'CRM opportunity not found': { status: 404, code: 'NOT_FOUND' },
  'CRM opportunity update conflict': { status: 409, code: 'CONFLICT' },
  'CRM opportunity idempotency key was reused': { status: 409, code: 'IDEMPOTENCY_CONFLICT' },
  'CRM contact is required': { status: 400, code: 'CONTACT_REQUIRED' },
  'CRM pipeline has no active open stage': { status: 409, code: 'INVALID_STAGE' },
  'CRM stage is invalid or inactive': { status: 409, code: 'INVALID_STAGE' },
  'Terminal opportunities require reopen': { status: 409, code: 'STAGE_TRANSITION_FORBIDDEN' },
  'CRM opportunity is already in this stage': { status: 409, code: 'STAGE_TRANSITION_FORBIDDEN' },
  'Only won or lost opportunities can be reopened': { status: 409, code: 'REOPEN_FORBIDDEN' },
  'A reopen reason is required': { status: 400, code: 'REOPEN_REASON_REQUIRED' },
  'Reopen target must be an active open stage': { status: 409, code: 'INVALID_STAGE' },
  'CRM stage configuration conflicts': { status: 409, code: 'INVALID_STAGE_CONFIGURATION' },
};

export function opportunityServiceErrorResponse(error: unknown, fallback: string) {
  return crmErrorResponse(error, fallback, known);
}
