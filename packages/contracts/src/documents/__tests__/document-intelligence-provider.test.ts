import { describe, expect, it } from 'vitest';

import {
  DocumentProviderInvocationRequestSchema,
  DocumentProviderInvocationResponseSchema,
  DocumentProviderUsageSchema,
  sanitizeDocumentProviderError,
} from '../document-intelligence-provider';

const ids = {
  organizationId: '00000000-0000-4200-9000-000000000001',
  versionId: '00000000-0000-4200-9000-000000000004',
};

describe('Document Intelligence provider contracts', () => {
  it('keeps prompt and response versions as references without provider payloads', () => {
    expect(
      DocumentProviderInvocationRequestSchema.safeParse({
        organizationId: ids.organizationId,
        documentVersionId: ids.versionId,
        sourceReference: 'private/documents/source.pdf',
        capability: 'identity-document',
        prompt: { key: 'identity-extraction', version: '2026-09-1' },
        responseSchema: { key: 'identity-fields', version: '1' },
        timeoutMs: 30_000,
        attempt: 1,
        correlationId: 'provider-correlation-001',
        fallbackPolicy: 'controlled',
      }).success,
    ).toBe(true);
  });

  it('validates safe token, cost, latency, and model telemetry', () => {
    expect(
      DocumentProviderUsageSchema.safeParse({
        model: 'fixture-model',
        promptTokens: 10,
        outputTokens: 5,
        totalTokens: 15,
        estimatedCostMicrosUsd: '1250',
        latencyMs: 120,
        retryCount: 0,
      }).success,
    ).toBe(true);
    expect(
      DocumentProviderInvocationResponseSchema.safeParse({
        provider: 'fixture',
        providerVersion: '2026-09',
        responseSchema: { key: 'identity-fields', version: '1' },
        fields: { documentType: 'national-id' },
        usage: {
          model: 'fixture-model',
          promptTokens: 10,
          outputTokens: 5,
          totalTokens: 15,
          estimatedCostMicrosUsd: '1250',
          latencyMs: 120,
          retryCount: 0,
        },
        correlationId: 'provider-correlation-001',
      }).success,
    ).toBe(true);
  });

  it('sanitizes provider failures without retaining original messages or stacks', () => {
    const sanitized = sanitizeDocumentProviderError(
      new Error('secret prompt and provider response leaked in this message'),
      'provider-correlation-002',
      'TIMEOUT',
    );

    expect(sanitized).toEqual({
      code: 'TIMEOUT',
      message: 'The document provider timed out before returning a result.',
      retryable: true,
      correlationId: 'provider-correlation-002',
    });
    expect(sanitized.message).not.toContain('secret');
  });
});
