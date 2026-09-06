import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const DocumentRetentionClassSchema = z.enum([
  'temporary_source',
  'persisted_document',
  'extraction_result',
]);
export type DocumentRetentionClass = z.infer<typeof DocumentRetentionClassSchema>;

export const DocumentRetentionPolicySchema = z
  .object({
    retentionClass: DocumentRetentionClassSchema,
    ttlSeconds: z.number().int().positive().nullable(),
    legalHoldAllowed: z.boolean(),
  })
  .strict();
export type DocumentRetentionPolicy = z.infer<typeof DocumentRetentionPolicySchema>;

export const DocumentRetentionDecisionSchema = z
  .object({
    organizationId: IdSchema,
    documentId: IdSchema,
    retentionClass: DocumentRetentionClassSchema,
    expiresAt: TimestampSchema.nullable(),
    legalHold: z.boolean(),
    reasonCode: z.string().trim().min(1).max(120),
  })
  .strict()
  .superRefine((decision, ctx) => {
    if (decision.legalHold && decision.expiresAt !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expiresAt'],
        message: 'A legal hold cannot have an active deletion expiry.',
      });
    }
  });
export type DocumentRetentionDecision = z.infer<typeof DocumentRetentionDecisionSchema>;

export const DocumentCleanupStatusSchema = z.enum([
  'scheduled',
  'running',
  'retrying',
  'completed',
  'failed',
  'skipped_legal_hold',
]);
export type DocumentCleanupStatus = z.infer<typeof DocumentCleanupStatusSchema>;

export const DocumentCleanupErrorCodeSchema = z.enum([
  'STORAGE_DELETE_FAILED',
  'DATABASE_DELETE_FAILED',
  'LOCK_NOT_ACQUIRED',
  'LEGAL_HOLD',
  'RETRY_EXHAUSTED',
]);
export type DocumentCleanupErrorCode = z.infer<typeof DocumentCleanupErrorCodeSchema>;

export const DocumentCleanupJobSchema = z
  .object({
    id: IdSchema,
    organizationId: IdSchema,
    documentId: IdSchema,
    retentionClass: DocumentRetentionClassSchema,
    dueAt: TimestampSchema,
    status: DocumentCleanupStatusSchema,
    attempt: z.number().int().nonnegative(),
    maxAttempts: z.number().int().positive(),
    idempotencyKey: z.string().trim().min(8).max(160),
    lastErrorCode: DocumentCleanupErrorCodeSchema.nullable(),
    nextRetryAt: TimestampSchema.nullable(),
    startedAt: TimestampSchema.nullable(),
    completedAt: TimestampSchema.nullable(),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  })
  .strict()
  .superRefine((job, ctx) => {
    if (job.attempt > job.maxAttempts) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['attempt'],
        message: 'Cleanup attempts cannot exceed maxAttempts.',
      });
    }
    if (job.status === 'completed' && job.completedAt === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['completedAt'],
        message: 'Completed cleanup jobs require completedAt.',
      });
    }
  });
export type DocumentCleanupJob = z.infer<typeof DocumentCleanupJobSchema>;

export const ScheduleDocumentCleanupCommandSchema = z
  .object({
    organizationId: IdSchema,
    documentId: IdSchema,
    retentionClass: DocumentRetentionClassSchema,
    dueAt: TimestampSchema,
    idempotencyKey: z.string().trim().min(8).max(160),
  })
  .strict();
export type ScheduleDocumentCleanupCommand = z.infer<typeof ScheduleDocumentCleanupCommandSchema>;

export const RunDocumentCleanupCommandSchema = z
  .object({
    organizationId: IdSchema,
    cleanupJobId: IdSchema,
    expectedAttempt: z.number().int().nonnegative(),
    idempotencyKey: z.string().trim().min(8).max(160),
    mode: z.enum(['dry_run', 'execute']).default('execute'),
    killSwitch: z.boolean().default(false),
  })
  .strict();
export type RunDocumentCleanupCommand = z.infer<typeof RunDocumentCleanupCommandSchema>;

export const DocumentCleanupItemResultSchema = z
  .object({
    resource: z.enum(['storage_object', 'document_record', 'version_record', 'extraction_record']),
    deleted: z.boolean(),
    errorCode: DocumentCleanupErrorCodeSchema.nullable(),
  })
  .strict();
export type DocumentCleanupItemResult = z.infer<typeof DocumentCleanupItemResultSchema>;

export const DocumentCleanupResultSchema = z
  .object({
    cleanupJobId: IdSchema,
    status: DocumentCleanupStatusSchema,
    items: z.array(DocumentCleanupItemResultSchema).max(20),
    retryable: z.boolean(),
    auditCorrelationId: z.string().trim().min(1).max(160),
  })
  .strict();
export type DocumentCleanupResult = z.infer<typeof DocumentCleanupResultSchema>;

export const isDocumentCleanupRetryable = (status: DocumentCleanupStatus): boolean =>
  status === 'retrying';

export interface DocumentCleanupRepository {
  schedule(command: ScheduleDocumentCleanupCommand): Promise<DocumentCleanupJob>;
  run(command: RunDocumentCleanupCommand): Promise<DocumentCleanupResult>;
}
