import type { Customer360ErrorCode } from '@loopdev/contracts';
import { crmErrorResponse, crmUnauthorizedResponse } from './crmErrors';

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
  const known = Object.fromEntries(
    Object.entries(STATUS_BY_CODE).map(([code, status]) => [code, { code, status }]),
  );
  return crmErrorResponse(error, fallback, known);
}

export function unauthorizedCustomer360Response(status: 401 | 403) {
  return crmUnauthorizedResponse(status);
}
