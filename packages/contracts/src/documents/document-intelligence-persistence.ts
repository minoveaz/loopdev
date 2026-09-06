import { z } from 'zod';

import {
  CreateDocumentCommandSchema,
  DocumentCoreRecordReadSchema,
  DocumentCoreReadSchema,
  DocumentCoreUsageSummarySchema,
  DocumentCoreValidationSummarySchema,
  DocumentHistoryPageSchema,
  DocumentHistoryQuerySchema,
  GetDocumentQuerySchema,
  DocumentLifecycleStatusSchema,
  ExtractionLifecycleStatusSchema,
  StartExtractionCommandSchema,
} from './document-intelligence-core';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();
const OpaqueReferenceSchema = z.string().trim().min(1).max(500);
const ConcurrencyTokenSchema = z.string().trim().min(8).max(256);

export const DocumentPersistenceOwnerSchema = z
  .object({
    organizationId: IdSchema,
    workspaceId: IdSchema.nullable(),
  })
  .strict();
export type DocumentPersistenceOwner = z.infer<typeof DocumentPersistenceOwnerSchema>;

export const DocumentPersistenceLookupSchema = z
  .object({
    organizationId: IdSchema,
    documentId: IdSchema,
    documentVersionId: IdSchema.optional(),
  })
  .strict();
export type DocumentPersistenceLookup = z.infer<typeof DocumentPersistenceLookupSchema>;

export const DocumentPersistenceRowSchema = z
  .object({
    id: IdSchema,
    organizationId: IdSchema,
    workspaceId: IdSchema.nullable(),
    status: DocumentLifecycleStatusSchema,
    currentVersionId: IdSchema.nullable(),
    retentionClass: z.string().trim().min(1).max(80),
    expiresAt: TimestampSchema.nullable(),
    version: z.number().int().positive(),
    concurrencyToken: ConcurrencyTokenSchema,
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  })
  .strict();
export type DocumentPersistenceRow = z.infer<typeof DocumentPersistenceRowSchema>;

export const DocumentVersionPersistenceRowSchema = z
  .object({
    id: IdSchema,
    documentId: IdSchema,
    organizationId: IdSchema,
    versionNumber: z.number().int().positive(),
    sourceReference: OpaqueReferenceSchema.nullable(),
    checksum: z.string().trim().min(1).max(256).nullable(),
    extractionId: IdSchema.nullable(),
    createdBy: IdSchema.nullable(),
    version: z.number().int().positive(),
    concurrencyToken: ConcurrencyTokenSchema,
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  })
  .strict();
export type DocumentVersionPersistenceRow = z.infer<typeof DocumentVersionPersistenceRowSchema>;

export const ExtractionPersistenceRowSchema = z
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
    version: z.number().int().positive(),
    concurrencyToken: ConcurrencyTokenSchema,
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  })
  .strict();
export type ExtractionPersistenceRow = z.infer<typeof ExtractionPersistenceRowSchema>;

export const DocumentPersistenceIdempotencySchema = z
  .object({
    organizationId: IdSchema,
    idempotencyKey: z.string().trim().min(8).max(160),
    commandType: z.enum(['createDocument', 'startExtraction']),
  })
  .strict();
export type DocumentPersistenceIdempotency = z.infer<typeof DocumentPersistenceIdempotencySchema>;

export interface DocumentCorePersistenceRepository {
  createDocument(
    command: z.infer<typeof CreateDocumentCommandSchema>,
  ): Promise<z.infer<typeof DocumentCoreReadSchema>>;
  startExtraction(
    command: z.infer<typeof StartExtractionCommandSchema>,
  ): Promise<z.infer<typeof ExtractionPersistenceRowSchema>>;
  getDocument(
    query: z.infer<typeof GetDocumentQuerySchema>,
  ): Promise<z.infer<typeof DocumentCoreRecordReadSchema> | null>;
  listHistory(
    query: z.infer<typeof DocumentHistoryQuerySchema>,
  ): Promise<z.infer<typeof DocumentHistoryPageSchema>>;
}

export const documentPersistenceCompatibilitySchemas = {
  document: DocumentPersistenceRowSchema,
  version: DocumentVersionPersistenceRowSchema,
  extraction: ExtractionPersistenceRowSchema,
};
