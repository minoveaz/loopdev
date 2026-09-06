import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();
const OpaqueReferenceSchema = z.string().trim().min(1).max(500);
const IdempotencyKeySchema = z.string().trim().min(8).max(160);
const ConcurrencyTokenSchema = z.string().trim().min(8).max(256);
const ReasonSchema = z.string().trim().min(1).max(1_000);

export const DocumentLifecycleStatusSchema = z.enum([
  'temporary',
  'uploaded',
  'processing',
  'review',
  'approved',
  'rejected',
  'failed',
  'expired',
  'deleted',
]);
export type DocumentLifecycleStatus = z.infer<typeof DocumentLifecycleStatusSchema>;

export const ExtractionLifecycleStatusSchema = z.enum([
  'queued',
  'processing',
  'review',
  'approved',
  'rejected',
  'failed',
]);
export type ExtractionLifecycleStatus = z.infer<typeof ExtractionLifecycleStatusSchema>;

export const DocumentLifecycleTransitionSchema = z.object({
  from: DocumentLifecycleStatusSchema,
  to: DocumentLifecycleStatusSchema,
});
export type DocumentLifecycleTransition = z.infer<typeof DocumentLifecycleTransitionSchema>;

export const ExtractionLifecycleTransitionSchema = z.object({
  from: ExtractionLifecycleStatusSchema,
  to: ExtractionLifecycleStatusSchema,
});
export type ExtractionLifecycleTransition = z.infer<typeof ExtractionLifecycleTransitionSchema>;

export const DOCUMENT_LIFECYCLE_TRANSITIONS = {
  temporary: ['uploaded', 'expired', 'deleted'],
  uploaded: ['processing', 'expired', 'deleted'],
  processing: ['review', 'failed'],
  review: ['approved', 'rejected', 'processing'],
  approved: ['review', 'expired'],
  rejected: ['review', 'expired', 'deleted'],
  failed: ['processing', 'expired', 'deleted'],
  expired: ['deleted'],
  deleted: [],
} as const satisfies Record<DocumentLifecycleStatus, readonly DocumentLifecycleStatus[]>;

export const EXTRACTION_LIFECYCLE_TRANSITIONS = {
  queued: ['processing', 'failed'],
  processing: ['review', 'failed'],
  review: ['approved', 'rejected'],
  approved: [],
  rejected: [],
  failed: [],
} as const satisfies Record<ExtractionLifecycleStatus, readonly ExtractionLifecycleStatus[]>;

export const isDocumentLifecycleTransitionAllowed = (
  transition: DocumentLifecycleTransition,
): boolean =>
  (DOCUMENT_LIFECYCLE_TRANSITIONS[transition.from] as readonly DocumentLifecycleStatus[]).includes(
    transition.to,
  );

export const isExtractionLifecycleTransitionAllowed = (
  transition: ExtractionLifecycleTransition,
): boolean =>
  (
    EXTRACTION_LIFECYCLE_TRANSITIONS[transition.from] as readonly ExtractionLifecycleStatus[]
  ).includes(transition.to);

export const DocumentCoreValidationSeveritySchema = z.enum(['info', 'warning', 'error']);
export type DocumentCoreValidationSeverity = z.infer<typeof DocumentCoreValidationSeveritySchema>;

export const DocumentCoreValidationResultSchema = z.object({
  ruleId: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(120),
  severity: DocumentCoreValidationSeveritySchema,
  code: z.string().trim().min(1).max(160),
  passed: z.boolean(),
  message: z.string().trim().min(1).max(1_000),
  fieldPaths: z.array(z.string().trim().min(1).max(500)).max(100),
});
export type DocumentCoreValidationResult = z.infer<typeof DocumentCoreValidationResultSchema>;

export const DocumentCoreValidationSummarySchema = z.object({
  results: z.array(DocumentCoreValidationResultSchema).max(500),
  evaluatedAt: TimestampSchema,
  ruleSetVersion: z.string().trim().min(1).max(80),
});
export type DocumentCoreValidationSummary = z.infer<typeof DocumentCoreValidationSummarySchema>;

export const DocumentCoreUsageSummarySchema = z.object({
  model: z.string().trim().min(1).max(120),
  promptTokens: z.number().int().nonnegative().nullable(),
  outputTokens: z.number().int().nonnegative().nullable(),
  totalTokens: z.number().int().nonnegative().nullable(),
  estimatedCostUsd: z.number().nonnegative().nullable(),
  latencyMs: z.number().int().nonnegative().nullable(),
});
export type DocumentCoreUsageSummary = z.infer<typeof DocumentCoreUsageSummarySchema>;

const VersionedReadFields = {
  version: z.number().int().positive(),
  concurrencyToken: ConcurrencyTokenSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
};

export const DocumentCoreReadSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  workspaceId: IdSchema.nullable(),
  status: DocumentLifecycleStatusSchema,
  currentVersionId: IdSchema.nullable(),
  retentionClass: z.string().trim().min(1).max(80),
  expiresAt: TimestampSchema.nullable(),
  ...VersionedReadFields,
});
export type DocumentCoreRead = z.infer<typeof DocumentCoreReadSchema>;

export const DocumentVersionReadSchema = z.object({
  id: IdSchema,
  documentId: IdSchema,
  organizationId: IdSchema,
  versionNumber: z.number().int().positive(),
  sourceReference: OpaqueReferenceSchema.nullable(),
  checksum: z.string().trim().min(1).max(256).nullable(),
  extractionId: IdSchema.nullable(),
  createdBy: IdSchema.nullable(),
  ...VersionedReadFields,
});
export type DocumentVersionRead = z.infer<typeof DocumentVersionReadSchema>;

export const ExtractionRecordReadSchema = z
  .object({
    id: IdSchema,
    documentVersionId: IdSchema,
    organizationId: IdSchema,
    status: ExtractionLifecycleStatusSchema,
    attempt: z.number().int().positive(),
    previousAttemptId: IdSchema.nullable(),
    provider: z.string().trim().min(1).max(120),
    providerVersion: z.string().trim().min(1).max(80),
    schemaVersion: z.string().trim().min(1).max(80),
    fields: z.record(z.string(), z.unknown()),
    validationSummary: DocumentCoreValidationSummarySchema,
    usage: DocumentCoreUsageSummarySchema.nullable(),
    completedAt: TimestampSchema.nullable(),
    ...VersionedReadFields,
  })
  .superRefine((record, ctx) => {
    if (record.attempt === 1 && record.previousAttemptId !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['previousAttemptId'],
        message: 'The first extraction attempt cannot reference a previous attempt.',
      });
    }
    if (record.attempt > 1 && record.previousAttemptId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['previousAttemptId'],
        message: 'Retry attempts must reference the previous attempt.',
      });
    }
    if (record.previousAttemptId === record.id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['previousAttemptId'],
        message: 'An extraction attempt cannot reference itself.',
      });
    }
  });
export type ExtractionRecordRead = z.infer<typeof ExtractionRecordReadSchema>;

export const DocumentCoreRecordReadSchema = z
  .object({
    document: DocumentCoreReadSchema,
    version: DocumentVersionReadSchema.nullable(),
    extraction: ExtractionRecordReadSchema.nullable(),
  })
  .superRefine((record, ctx) => {
    if (record.version && record.version.documentId !== record.document.id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['version', 'documentId'],
        message: 'The version must belong to the returned document.',
      });
    }
    if (record.version && record.version.organizationId !== record.document.organizationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['version', 'organizationId'],
        message: 'The version must belong to the document organization.',
      });
    }
    if (record.extraction && record.extraction.organizationId !== record.document.organizationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['extraction', 'organizationId'],
        message: 'The extraction must belong to the document organization.',
      });
    }
    if (
      record.extraction &&
      record.version &&
      record.extraction.documentVersionId !== record.version.id
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['extraction', 'documentVersionId'],
        message: 'The extraction must belong to the returned version.',
      });
    }
  });
export type DocumentCoreRecordRead = z.infer<typeof DocumentCoreRecordReadSchema>;

export const CreateDocumentInputSchema = z.object({
  workspaceId: IdSchema.nullable().optional(),
  sourceReference: OpaqueReferenceSchema,
  checksum: z.string().trim().min(1).max(256).nullable().optional(),
  retentionClass: z.string().trim().min(1).max(80),
});
export type CreateDocumentInput = z.infer<typeof CreateDocumentInputSchema>;

const OrganizationCommandFields = {
  organizationId: IdSchema,
  idempotencyKey: IdempotencyKeySchema,
};

const ConcurrentCommandFields = {
  expectedVersion: z.number().int().positive(),
  concurrencyToken: ConcurrencyTokenSchema,
};

export const CreateDocumentCommandSchema = z.object({
  type: z.literal('createDocument'),
  ...OrganizationCommandFields,
  input: CreateDocumentInputSchema,
});
export type CreateDocumentCommand = z.infer<typeof CreateDocumentCommandSchema>;

export const StartExtractionCommandSchema = z.object({
  type: z.literal('startExtraction'),
  ...OrganizationCommandFields,
  documentVersionId: IdSchema,
  capability: z.string().trim().min(1).max(120),
});
export type StartExtractionCommand = z.infer<typeof StartExtractionCommandSchema>;

export const RetryExtractionCommandSchema = z.object({
  type: z.literal('retryExtraction'),
  ...OrganizationCommandFields,
  extractionId: IdSchema,
  ...ConcurrentCommandFields,
  reason: ReasonSchema,
});
export type RetryExtractionCommand = z.infer<typeof RetryExtractionCommandSchema>;

export const UpdateExtractionReviewCommandSchema = z.object({
  type: z.literal('updateExtractionReview'),
  ...OrganizationCommandFields,
  extractionId: IdSchema,
  ...ConcurrentCommandFields,
  fieldPatch: z.record(z.string(), z.unknown()),
});
export type UpdateExtractionReviewCommand = z.infer<typeof UpdateExtractionReviewCommandSchema>;

const ExtractionDecisionCommandSchema = z.object({
  organizationId: IdSchema,
  extractionId: IdSchema,
  ...ConcurrentCommandFields,
  reason: ReasonSchema,
  idempotencyKey: IdempotencyKeySchema,
});

export const ApproveExtractionCommandSchema = ExtractionDecisionCommandSchema.extend({
  type: z.literal('approveExtraction'),
});
export type ApproveExtractionCommand = z.infer<typeof ApproveExtractionCommandSchema>;

export const RejectExtractionCommandSchema = ExtractionDecisionCommandSchema.extend({
  type: z.literal('rejectExtraction'),
});
export type RejectExtractionCommand = z.infer<typeof RejectExtractionCommandSchema>;

export const ReopenExtractionCommandSchema = ExtractionDecisionCommandSchema.extend({
  type: z.literal('reopenExtraction'),
});
export type ReopenExtractionCommand = z.infer<typeof ReopenExtractionCommandSchema>;

export const DocumentCoreCommandSchema = z.discriminatedUnion('type', [
  CreateDocumentCommandSchema,
  StartExtractionCommandSchema,
  RetryExtractionCommandSchema,
  UpdateExtractionReviewCommandSchema,
  ApproveExtractionCommandSchema,
  RejectExtractionCommandSchema,
  ReopenExtractionCommandSchema,
]);
export type DocumentCoreCommand = z.infer<typeof DocumentCoreCommandSchema>;

export const DocumentHistoryOrderSchema = z.enum(['created_at_asc', 'created_at_desc']);
export const DocumentHistoryQuerySchema = z.object({
  type: z.literal('listDocumentHistory'),
  organizationId: IdSchema,
  workspaceId: IdSchema.optional(),
  statuses: z.array(DocumentLifecycleStatusSchema).max(9).optional(),
  cursor: z.string().trim().min(1).max(500).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  order: DocumentHistoryOrderSchema.default('created_at_desc'),
});
export type DocumentHistoryQuery = z.infer<typeof DocumentHistoryQuerySchema>;

export const GetDocumentQuerySchema = z
  .object({
    type: z.literal('getDocument'),
    organizationId: IdSchema,
    documentId: IdSchema,
    documentVersionId: IdSchema.optional(),
  })
  .strict();
export type GetDocumentQuery = z.infer<typeof GetDocumentQuerySchema>;

export const DocumentCoreQuerySchema = z.discriminatedUnion('type', [
  DocumentHistoryQuerySchema,
  GetDocumentQuerySchema,
]);
export type DocumentCoreQuery = z.infer<typeof DocumentCoreQuerySchema>;

export const DocumentHistoryPageSchema = z.object({
  items: z.array(DocumentCoreRecordReadSchema).max(100),
  nextCursor: z.string().trim().min(1).max(500).nullable(),
  hasMore: z.boolean(),
});
export type DocumentHistoryPage = z.infer<typeof DocumentHistoryPageSchema>;

export const DocumentIntelligenceCoreErrorCodeSchema = z.enum([
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'CONFLICT',
  'IDEMPOTENCY_CONFLICT',
  'INVALID_TRANSITION',
  'PROVIDER_UNAVAILABLE',
  'PROVIDER_TIMEOUT',
  'RATE_LIMITED',
  'RETENTION_EXPIRED',
  'CLEANUP_PENDING',
  'INTERNAL_ERROR',
]);
export type DocumentIntelligenceCoreErrorCode = z.infer<
  typeof DocumentIntelligenceCoreErrorCodeSchema
>;

export const DocumentIntelligenceCoreErrorSchema = z.object({
  code: DocumentIntelligenceCoreErrorCodeSchema,
  message: z.string().trim().min(1).max(1_000),
  correlationId: z.string().trim().min(1).max(160),
});
export type DocumentIntelligenceCoreError = z.infer<typeof DocumentIntelligenceCoreErrorSchema>;

export type DocumentCoreResponse<T> =
  { data: T; error: null } | { data: null; error: DocumentIntelligenceCoreError };

export const createDocumentCoreResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([
    z.object({ data: dataSchema, error: z.null() }),
    z.object({ data: z.null(), error: DocumentIntelligenceCoreErrorSchema }),
  ]);
