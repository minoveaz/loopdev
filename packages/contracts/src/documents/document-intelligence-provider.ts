import { z } from 'zod';

const IdSchema = z.string().uuid();
const CorrelationIdSchema = z.string().trim().min(1).max(160);

export const DocumentProviderPromptReferenceSchema = z
  .object({
    key: z.string().trim().min(1).max(120),
    version: z.string().trim().min(1).max(80),
  })
  .strict();
export type DocumentProviderPromptReference = z.infer<typeof DocumentProviderPromptReferenceSchema>;

export const DocumentProviderResponseSchemaReferenceSchema = z
  .object({
    key: z.string().trim().min(1).max(120),
    version: z.string().trim().min(1).max(80),
  })
  .strict();
export type DocumentProviderResponseSchemaReference = z.infer<
  typeof DocumentProviderResponseSchemaReferenceSchema
>;

export const DocumentProviderCapabilitySchema = z.enum(['identity-document', 'invoice', 'receipt']);
export type DocumentProviderCapability = z.infer<typeof DocumentProviderCapabilitySchema>;

export const DocumentProviderFallbackPolicySchema = z.enum(['disabled', 'controlled']);
export type DocumentProviderFallbackPolicy = z.infer<typeof DocumentProviderFallbackPolicySchema>;

export const DocumentProviderInvocationRequestSchema = z
  .object({
    organizationId: IdSchema,
    documentVersionId: IdSchema,
    sourceReference: z.string().trim().min(1).max(500),
    capability: DocumentProviderCapabilitySchema,
    prompt: DocumentProviderPromptReferenceSchema,
    responseSchema: DocumentProviderResponseSchemaReferenceSchema,
    timeoutMs: z.number().int().min(100).max(120_000),
    attempt: z.number().int().positive(),
    correlationId: CorrelationIdSchema,
    fallbackPolicy: DocumentProviderFallbackPolicySchema,
  })
  .strict();
export type DocumentProviderInvocationRequest = z.infer<
  typeof DocumentProviderInvocationRequestSchema
>;

export const DocumentProviderUsageSchema = z
  .object({
    model: z.string().trim().min(1).max(120),
    promptTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative(),
    estimatedCostMicrosUsd: z.string().regex(/^\d+$/).nullable(),
    latencyMs: z.number().int().nonnegative(),
    retryCount: z.number().int().nonnegative().max(5),
  })
  .strict()
  .superRefine((usage, ctx) => {
    if (usage.totalTokens !== usage.promptTokens + usage.outputTokens) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['totalTokens'],
        message: 'totalTokens must equal promptTokens plus outputTokens.',
      });
    }
  });
export type DocumentProviderUsage = z.infer<typeof DocumentProviderUsageSchema>;

export const DocumentProviderInvocationResponseSchema = z
  .object({
    provider: z.string().trim().min(1).max(120),
    providerVersion: z.string().trim().min(1).max(80),
    responseSchema: DocumentProviderResponseSchemaReferenceSchema,
    fields: z.record(z.string(), z.unknown()),
    usage: DocumentProviderUsageSchema,
    correlationId: CorrelationIdSchema,
  })
  .strict();
export type DocumentProviderInvocationResponse = z.infer<
  typeof DocumentProviderInvocationResponseSchema
>;

export const DocumentProviderErrorCodeSchema = z.enum([
  'TIMEOUT',
  'RATE_LIMITED',
  'UNAVAILABLE',
  'INVALID_RESPONSE',
  'CAPABILITY_UNSUPPORTED',
  'INTERNAL',
]);
export type DocumentProviderErrorCode = z.infer<typeof DocumentProviderErrorCodeSchema>;

export const DocumentProviderErrorSchema = z
  .object({
    code: DocumentProviderErrorCodeSchema,
    message: z.string().trim().min(1).max(300),
    retryable: z.boolean(),
    correlationId: CorrelationIdSchema,
  })
  .strict();
export type DocumentProviderError = z.infer<typeof DocumentProviderErrorSchema>;

export const DocumentProviderInvocationResultSchema = z.union([
  z.object({
    data: DocumentProviderInvocationResponseSchema,
    error: z.null(),
  }),
  z.object({
    data: z.null(),
    error: DocumentProviderErrorSchema,
  }),
]);
export type DocumentProviderInvocationResult = z.infer<
  typeof DocumentProviderInvocationResultSchema
>;

const SAFE_PROVIDER_MESSAGES: Record<DocumentProviderErrorCode, string> = {
  TIMEOUT: 'The document provider timed out before returning a result.',
  RATE_LIMITED: 'The document provider rate limit was reached.',
  UNAVAILABLE: 'The document provider is temporarily unavailable.',
  INVALID_RESPONSE: 'The document provider returned an invalid response.',
  CAPABILITY_UNSUPPORTED: 'The requested document capability is not supported.',
  INTERNAL: 'The document provider request could not be completed.',
};

export function sanitizeDocumentProviderError(
  input: unknown,
  correlationId: string,
  code: DocumentProviderErrorCode = 'INTERNAL',
): DocumentProviderError {
  const normalizedCorrelationId = CorrelationIdSchema.parse(correlationId);
  const inferredCode = input instanceof Error && /timeout/i.test(input.message) ? 'TIMEOUT' : code;

  return {
    code: inferredCode,
    message: SAFE_PROVIDER_MESSAGES[inferredCode],
    retryable:
      inferredCode === 'TIMEOUT' ||
      inferredCode === 'RATE_LIMITED' ||
      inferredCode === 'UNAVAILABLE',
    correlationId: normalizedCorrelationId,
  };
}

export interface DocumentProviderAdapter {
  invoke(request: DocumentProviderInvocationRequest): Promise<DocumentProviderInvocationResult>;
}
