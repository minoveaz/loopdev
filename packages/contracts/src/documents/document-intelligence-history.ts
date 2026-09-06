import { z } from 'zod';

import {
  DocumentHistoryOrderSchema,
  DocumentHistoryPageSchema,
  DocumentHistoryQuerySchema,
  DocumentIntelligenceCoreErrorSchema,
  ExtractionRecordReadSchema,
  ReopenExtractionCommandSchema,
} from './document-intelligence-core';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const DocumentHistoryCursorSchema = z
  .object({
    createdAt: TimestampSchema,
    documentId: IdSchema,
    order: DocumentHistoryOrderSchema,
  })
  .strict();
export type DocumentHistoryCursor = z.infer<typeof DocumentHistoryCursorSchema>;

export const DocumentHistoryOrderingSchema = z
  .object({
    primary: z.literal('createdAt'),
    tieBreaker: z.literal('id'),
    direction: DocumentHistoryOrderSchema,
  })
  .strict();
export type DocumentHistoryOrdering = z.infer<typeof DocumentHistoryOrderingSchema>;

export const DocumentHistoryQueryContractSchema = DocumentHistoryQuerySchema.extend({
  ordering: DocumentHistoryOrderingSchema.optional(),
});
export type DocumentHistoryQueryContract = z.infer<typeof DocumentHistoryQueryContractSchema>;

export const DocumentHistoryStateSchema = z.enum(['ready', 'empty', 'error', 'forbidden']);
export type DocumentHistoryState = z.infer<typeof DocumentHistoryStateSchema>;

export const DocumentHistoryResultSchema = z.discriminatedUnion('state', [
  z.object({ state: z.literal('ready'), page: DocumentHistoryPageSchema }).strict(),
  z
    .object({
      state: z.literal('empty'),
      page: DocumentHistoryPageSchema.extend({
        items: z.array(z.never()).max(0),
        nextCursor: z.null(),
        hasMore: z.literal(false),
      }),
    })
    .strict(),
  z.object({ state: z.literal('error'), error: DocumentIntelligenceCoreErrorSchema }).strict(),
  z.object({ state: z.literal('forbidden'), error: DocumentIntelligenceCoreErrorSchema }).strict(),
]);
export type DocumentHistoryResult = z.infer<typeof DocumentHistoryResultSchema>;

export const DocumentReopenSemanticsSchema = z
  .object({
    mode: z.literal('new_attempt'),
    sourceExtractionId: IdSchema,
    sourceVersionId: IdSchema,
    previousAttemptId: IdSchema,
    nextAttempt: z.number().int().positive(),
    nextStatus: z.literal('queued'),
  })
  .strict();
export type DocumentReopenSemantics = z.infer<typeof DocumentReopenSemanticsSchema>;

export const DocumentHistoryReopenResultSchema = z
  .object({
    extraction: ExtractionRecordReadSchema,
    semantics: DocumentReopenSemanticsSchema,
  })
  .strict()
  .superRefine((result, ctx) => {
    if (result.extraction.id === result.semantics.previousAttemptId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['semantics', 'previousAttemptId'],
        message: 'A reopened extraction must be a new immutable attempt.',
      });
    }
    if (result.extraction.previousAttemptId !== result.semantics.previousAttemptId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['extraction', 'previousAttemptId'],
        message: 'The new attempt must reference the previous attempt.',
      });
    }
    if (result.extraction.documentVersionId !== result.semantics.sourceVersionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['extraction', 'documentVersionId'],
        message: 'The new attempt must remain on the selected document version.',
      });
    }
  });
export type DocumentHistoryReopenResult = z.infer<typeof DocumentHistoryReopenResultSchema>;

export interface DocumentHistoryRepository {
  list(
    query: z.infer<typeof DocumentHistoryQueryContractSchema>,
  ): Promise<z.infer<typeof DocumentHistoryPageSchema>>;
  reopen(
    command: z.infer<typeof ReopenExtractionCommandSchema>,
  ): Promise<z.infer<typeof DocumentHistoryReopenResultSchema>>;
}
