import { describe, expect, it } from 'vitest';

import {
  DocumentCleanupJobSchema,
  DocumentCleanupResultSchema,
  DocumentRetentionDecisionSchema,
  RunDocumentCleanupCommandSchema,
  ScheduleDocumentCleanupCommandSchema,
  isDocumentCleanupRetryable,
} from '../document-intelligence-retention';

const ids = {
  organizationId: '00000000-0000-4200-9000-000000000001',
  documentId: '00000000-0000-4200-9000-000000000003',
  cleanupJobId: '00000000-0000-4200-9000-000000000004',
};
const timestamp = '2026-09-06T12:00:00.000Z';

describe('Document Intelligence retention contracts', () => {
  it('models resource classes and prevents expiry during legal hold', () => {
    expect(
      DocumentRetentionDecisionSchema.safeParse({
        organizationId: ids.organizationId,
        documentId: ids.documentId,
        retentionClass: 'temporary_source',
        expiresAt: timestamp,
        legalHold: false,
        reasonCode: 'temporary-upload',
      }).success,
    ).toBe(true);
    expect(
      DocumentRetentionDecisionSchema.safeParse({
        organizationId: ids.organizationId,
        documentId: ids.documentId,
        retentionClass: 'persisted_document',
        expiresAt: timestamp,
        legalHold: true,
        reasonCode: 'legal-hold',
      }).success,
    ).toBe(false);
  });

  it('requires idempotent scheduling and guarded cleanup attempts', () => {
    expect(
      ScheduleDocumentCleanupCommandSchema.safeParse({
        organizationId: ids.organizationId,
        documentId: ids.documentId,
        retentionClass: 'extraction_result',
        dueAt: timestamp,
        idempotencyKey: 'cleanup-schedule-001',
      }).success,
    ).toBe(true);
    expect(
      RunDocumentCleanupCommandSchema.safeParse({
        organizationId: ids.organizationId,
        cleanupJobId: ids.cleanupJobId,
        expectedAttempt: 1,
        idempotencyKey: 'cleanup-run-001',
        mode: 'dry_run',
        killSwitch: false,
      }).success,
    ).toBe(true);
  });

  it('models retry, recovery, and terminal cleanup evidence', () => {
    expect(
      DocumentCleanupJobSchema.safeParse({
        id: ids.cleanupJobId,
        organizationId: ids.organizationId,
        documentId: ids.documentId,
        retentionClass: 'temporary_source',
        dueAt: timestamp,
        status: 'retrying',
        attempt: 1,
        maxAttempts: 3,
        idempotencyKey: 'cleanup-job-001',
        lastErrorCode: 'STORAGE_DELETE_FAILED',
        nextRetryAt: timestamp,
        startedAt: timestamp,
        completedAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
    expect(isDocumentCleanupRetryable('retrying')).toBe(true);
    expect(isDocumentCleanupRetryable('completed')).toBe(false);
    expect(
      DocumentCleanupResultSchema.safeParse({
        cleanupJobId: ids.cleanupJobId,
        status: 'completed',
        items: [
          { resource: 'storage_object', deleted: true, errorCode: null },
          { resource: 'document_record', deleted: true, errorCode: null },
        ],
        retryable: false,
        auditCorrelationId: 'cleanup-correlation-001',
      }).success,
    ).toBe(true);
  });
});
