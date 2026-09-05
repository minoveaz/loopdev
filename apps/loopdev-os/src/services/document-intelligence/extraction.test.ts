import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DocumentExtractionServiceError,
  extractIdentityDocument,
} from './extraction';

const invoke = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    functions: { invoke },
  })),
}));

const request = {
  fileName: 'front.png',
  mimeType: 'image/png' as const,
  documentReference: 'organizations/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222/33333333-3333-4333-8333-333333333333.png',
};

afterEach(() => invoke.mockReset());

describe('extractIdentityDocument', () => {
  it('validates and returns the shared extraction result', async () => {
    invoke.mockResolvedValueOnce({
      data: {
        classification: { type: 'spanish-dni', confidence: 0.98 },
        fields: {
          documentType: 'spanish-dni',
          issuingCountry: 'ES',
          fullName: null,
          givenNames: null,
          surnames: null,
          firstSurname: null,
          secondSurname: null,
          documentNumber: null,
          birthDate: null,
          nationality: null,
          sex: null,
          issueDate: null,
          expiryDate: null,
          birthplace: null,
          supportNumber: null,
          address: null,
          mrz: null,
        },
        validations: [],
        provider: 'gemini',
        usage: null,
      },
      error: null,
    });

    await expect(extractIdentityDocument(request)).resolves.toMatchObject({
      provider: 'gemini',
      classification: { type: 'spanish-dni' },
    });
    expect(invoke).toHaveBeenCalledWith('extract-identity-document', { body: request });
  });

  it('normalizes function errors into a typed service error', async () => {
    invoke.mockResolvedValueOnce({
      data: null,
      error: {
        context: new Response(JSON.stringify({
          error: {
            code: 'provider-unavailable',
            status: 503,
            message: 'Document extraction is not configured.',
            recoverable: true,
          },
        }), { status: 503 }),
      },
    });

    const extraction = extractIdentityDocument(request);
    await expect(extraction).rejects.toBeInstanceOf(DocumentExtractionServiceError);
    await expect(extraction).rejects.toMatchObject({
      details: { code: 'provider-unavailable', status: 503 },
    });
  });
});
