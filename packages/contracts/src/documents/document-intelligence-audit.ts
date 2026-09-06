import { z } from 'zod';

import { DocumentHistoryQuerySchema } from './document-intelligence-core';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();
const CorrelationIdSchema = z.string().trim().min(1).max(160);

export const DocumentAuditEventTypeSchema = z.enum([
  'uploaded',
  'processing_started',
  'processing_completed',
  'manual_edit',
  'approved',
  'rejected',
  'retry_requested',
  'failure_recovered',
]);
export type DocumentAuditEventType = z.infer<typeof DocumentAuditEventTypeSchema>;

export const DocumentAuditActorSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('user'), userId: IdSchema }).strict(),
  z.object({ type: z.literal('service'), serviceName: z.string().trim().min(1).max(80) }).strict(),
  z.object({ type: z.literal('system') }).strict(),
]);
export type DocumentAuditActor = z.infer<typeof DocumentAuditActorSchema>;

const SensitiveAuditKeySchema = z.enum([
  'address',
  'birthdate',
  'document',
  'documentnumber',
  'email',
  'mrz',
  'name',
  'payload',
  'prompt',
  'response',
  'secret',
  'token',
]);

const SafeAuditMetadataKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z][a-z0-9_.-]*$/);
const SafeAuditMetadataValueSchema = z.union([
  z.string().trim().max(240),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

export const DocumentAuditMetadataSchema = z
  .record(SafeAuditMetadataKeySchema, SafeAuditMetadataValueSchema)
  .superRefine((metadata, ctx) => {
    for (const key of Object.keys(metadata)) {
      if (SensitiveAuditKeySchema.safeParse(key).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: 'Sensitive or provider payload metadata is not allowed in audit events.',
        });
      }
    }
  });
export type DocumentAuditMetadata = z.infer<typeof DocumentAuditMetadataSchema>;

export const DocumentAuditEventSchema = z
  .object({
    id: IdSchema,
    organizationId: IdSchema,
    actor: DocumentAuditActorSchema,
    eventType: DocumentAuditEventTypeSchema,
    documentId: IdSchema,
    documentVersionId: IdSchema.nullable(),
    extractionId: IdSchema.nullable(),
    occurredAt: TimestampSchema,
    correlationId: CorrelationIdSchema,
    metadata: DocumentAuditMetadataSchema,
  })
  .strict();
export type DocumentAuditEvent = z.infer<typeof DocumentAuditEventSchema>;

export const AppendDocumentAuditEventCommandSchema = DocumentAuditEventSchema.omit({
  id: true,
  occurredAt: true,
}).extend({
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type AppendDocumentAuditEventCommand = z.infer<typeof AppendDocumentAuditEventCommandSchema>;

export const DocumentAuditHistoryQuerySchema = DocumentHistoryQuerySchema.pick({
  organizationId: true,
  cursor: true,
  limit: true,
  order: true,
}).extend({
  documentId: IdSchema.optional(),
  eventTypes: z.array(DocumentAuditEventTypeSchema).max(8).optional(),
});
export type DocumentAuditHistoryQuery = z.infer<typeof DocumentAuditHistoryQuerySchema>;

export const DocumentAuditPermissionSchema = z.enum(['read', 'append']);
export type DocumentAuditPermission = z.infer<typeof DocumentAuditPermissionSchema>;

export interface DocumentAuditRepository {
  append(command: AppendDocumentAuditEventCommand): Promise<DocumentAuditEvent>;
  list(query: DocumentAuditHistoryQuery): Promise<{
    items: DocumentAuditEvent[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;
}
