import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const DocumentTypeSchema = z.enum(['identity', 'policy', 'quote_support', 'invoice', 'receipt', 'medical', 'other']);
export const DocumentProcessingStatusSchema = z.enum(['queued', 'processing', 'processed', 'failed', 'cancelled']);
export const DocumentReviewStatusSchema = z.enum(['not_required', 'pending', 'approved', 'rejected']);

export const DocumentRecordSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  contactId: IdSchema.nullable().optional(),
  leadId: IdSchema.nullable().optional(),
  opportunityId: IdSchema.nullable().optional(),
  documentType: DocumentTypeSchema,
  fileName: z.string().trim().min(1).max(240),
  storageRef: z.string().trim().min(1).max(500),
  mimeType: z.string().trim().min(1).max(120),
  processingStatus: DocumentProcessingStatusSchema,
  reviewStatus: DocumentReviewStatusSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type DocumentRecord = z.infer<typeof DocumentRecordSchema>;

export const DocumentExtractionSchema = z.object({
  id: IdSchema,
  documentId: IdSchema,
  processor: z.string().trim().min(1).max(120),
  processorVersion: z.string().trim().min(1).max(80),
  confidenceScore: z.number().min(0).max(1),
  fieldConfidence: z.record(z.string(), z.number().min(0).max(1)).default({}),
  extractedFields: z.record(z.string(), z.unknown()).default({}),
  requiresHumanReview: z.boolean(),
  createdAt: TimestampSchema,
});
export type DocumentExtraction = z.infer<typeof DocumentExtractionSchema>;

export const DocumentReviewDecisionSchema = z.object({
  documentId: IdSchema,
  reviewerUserId: IdSchema,
  decision: z.enum(['approved', 'rejected']),
  comments: z.string().max(10_000).nullable().optional(),
});
export type DocumentReviewDecision = z.infer<typeof DocumentReviewDecisionSchema>;
