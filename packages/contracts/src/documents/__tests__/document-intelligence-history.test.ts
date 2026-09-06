import { describe, expect, it } from 'vitest';

import {
  DocumentHistoryCursorSchema,
  DocumentHistoryOrderingSchema,
  DocumentHistoryQueryContractSchema,
  DocumentHistoryResultSchema,
  DocumentHistoryReopenResultSchema,
} from '../document-intelligence-history';

const ids = {
  organizationId: '00000000-0000-4200-9000-000000000001',
  documentId: '00000000-0000-4200-9000-000000000003',
  versionId: '00000000-0000-4200-9000-000000000004',
  previousAttemptId: '00000000-0000-4200-9000-000000000005',
  newAttemptId: '00000000-0000-4200-9000-000000000006',
};
const timestamp = '2026-09-06T12:00:00.000Z';

describe('Document Intelligence history contracts', () => {
  it('makes cursor pagination stable with a createdAt and id tie-breaker', () => {
    expect(
      DocumentHistoryCursorSchema.safeParse({
        createdAt: timestamp,
        documentId: ids.documentId,
        order: 'created_at_desc',
      }).success,
    ).toBe(true);
    expect(
      DocumentHistoryOrderingSchema.safeParse({
        primary: 'createdAt',
        tieBreaker: 'id',
        direction: 'created_at_desc',
      }).success,
    ).toBe(true);
    expect(
      DocumentHistoryCursorSchema.safeParse({
        createdAt: timestamp,
        documentId: ids.documentId,
        order: 'created_at_desc',
        offset: 20,
      }).success,
    ).toBe(false);
  });

  it('keeps history filters organization-scoped and bounded', () => {
    expect(
      DocumentHistoryQueryContractSchema.safeParse({
        type: 'listDocumentHistory',
        organizationId: ids.organizationId,
        statuses: ['review', 'failed'],
        cursor: 'opaque-history-cursor',
        limit: 25,
        order: 'created_at_desc',
        ordering: {
          primary: 'createdAt',
          tieBreaker: 'id',
          direction: 'created_at_desc',
        },
      }).success,
    ).toBe(true);
    expect(
      DocumentHistoryQueryContractSchema.safeParse({
        type: 'listDocumentHistory',
        organizationId: ids.organizationId,
        limit: 101,
      }).success,
    ).toBe(false);
  });

  it('models reopen as an immutable new extraction attempt on the selected version', () => {
    expect(
      DocumentHistoryReopenResultSchema.safeParse({
        extraction: {
          id: ids.newAttemptId,
          documentVersionId: ids.versionId,
          organizationId: ids.organizationId,
          status: 'queued',
          attempt: 2,
          previousAttemptId: ids.previousAttemptId,
          provider: 'fixture',
          providerVersion: '2026-09',
          schemaVersion: '1',
          fields: {},
          validationSummary: {
            results: [],
            evaluatedAt: timestamp,
            ruleSetVersion: '1',
          },
          usage: null,
          completedAt: null,
          version: 1,
          concurrencyToken: 'history-reopen-token',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        semantics: {
          mode: 'new_attempt',
          sourceExtractionId: ids.previousAttemptId,
          sourceVersionId: ids.versionId,
          previousAttemptId: ids.previousAttemptId,
          nextAttempt: 2,
          nextStatus: 'queued',
        },
      }).success,
    ).toBe(true);
  });

  it('distinguishes empty, error, and forbidden history states', () => {
    expect(
      DocumentHistoryResultSchema.safeParse({
        state: 'empty',
        page: { items: [], nextCursor: null, hasMore: false },
      }).success,
    ).toBe(true);
    expect(
      DocumentHistoryResultSchema.safeParse({
        state: 'forbidden',
        error: {
          code: 'FORBIDDEN',
          message: 'The requested history is not available.',
          correlationId: 'history-correlation-001',
        },
      }).success,
    ).toBe(true);
  });
});
