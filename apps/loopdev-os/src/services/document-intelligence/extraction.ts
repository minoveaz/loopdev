import {
  DocumentExtractionErrorSchema,
  DocumentExtractionRequestSchema,
  DocumentExtractionResultSchema,
} from '@loopdev/contracts';
import type {
  DocumentExtractionError,
  DocumentExtractionRequest,
  DocumentExtractionResult,
} from '@loopdev/contracts';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export class DocumentExtractionServiceError extends Error {
  readonly details: DocumentExtractionError;

  constructor(details: DocumentExtractionError) {
    super(details.message);
    this.name = 'DocumentExtractionServiceError';
    this.details = details;
  }
}

function fallbackError(): DocumentExtractionError {
  return {
    code: 'provider-failed',
    status: 502,
    message: 'Document extraction failed.',
    recoverable: true,
  };
}

async function parseFunctionError(error: unknown): Promise<DocumentExtractionError> {
  if (!error || typeof error !== 'object' || !('context' in error)) return fallbackError();
  const context = error.context;
  if (!(context instanceof Response)) return fallbackError();

  try {
    const payload: unknown = await context.clone().json();
    return DocumentExtractionErrorSchema.parse(
      payload && typeof payload === 'object' && 'error' in payload ? payload.error : payload,
    );
  } catch {
    return fallbackError();
  }
}

export async function extractIdentityDocument(
  input: DocumentExtractionRequest,
): Promise<DocumentExtractionResult> {
  const request = DocumentExtractionRequestSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.functions.invoke('extract-identity-document', {
    body: request,
  });

  if (error) {
    throw new DocumentExtractionServiceError(await parseFunctionError(error));
  }

  return DocumentExtractionResultSchema.parse(data);
}
