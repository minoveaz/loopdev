import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';

type CrmErrorMapping = { status: number; code: string; message?: string };

export function crmErrorResponse(
  error: unknown,
  fallback: string,
  known: Record<string, CrmErrorMapping> = {},
) {
  const traceId = randomUUID();
  const serviceError = error instanceof Error ? error : null;
  const explicitCode =
    serviceError && typeof (serviceError as Error & { code?: unknown }).code === 'string'
      ? (serviceError as Error & { code: string }).code
      : undefined;
  const mapped =
    (serviceError ? known[serviceError.message] : undefined) ||
    (explicitCode ? Object.values(known).find((item) => item.code === explicitCode) : undefined);
  const code =
    mapped?.code ?? (serviceError?.name === 'ZodError' ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR');
  const status = mapped?.status ?? (code === 'VALIDATION_ERROR' ? 400 : 500);
  const message =
    mapped?.message ??
    (code === 'VALIDATION_ERROR' ? fallback : mapped ? serviceError?.message : fallback);
  return NextResponse.json({ error: { code, message: message || fallback, traceId } }, { status });
}

export function crmUnauthorizedResponse(status: 401 | 403) {
  const traceId = randomUUID();
  return NextResponse.json(
    {
      error: {
        code: status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN',
        message: status === 401 ? 'Unauthorized' : 'Forbidden',
        traceId,
      },
    },
    { status },
  );
}
