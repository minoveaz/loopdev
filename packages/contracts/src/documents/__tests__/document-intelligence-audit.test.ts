import { describe, expect, it } from 'vitest';

import {
  AppendDocumentAuditEventCommandSchema,
  DocumentAuditEventSchema,
  DocumentAuditHistoryQuerySchema,
} from '../document-intelligence-audit';

const ids = {
  organizationId: '00000000-0000-4200-9000-000000000001',
  documentId: '00000000-0000-4200-9000-000000000003',
  versionId: '00000000-0000-4200-9000-000000000004',
  extractionId: '00000000-0000-4200-9000-000000000005',
  actorId: '00000000-0000-4200-9000-000000000006',
};
const timestamp = '2026-09-06T12:00:00.000Z';

describe('Document Intelligence audit contracts', () => {
  it('requires organization, actor, timestamp, correlation, and safe metadata', () => {
    expect(
      DocumentAuditEventSchema.safeParse({
        id: ids.extractionId,
        organizationId: ids.organizationId,
        actor: { type: 'user', userId: ids.actorId },
        eventType: 'manual_edit',
        documentId: ids.documentId,
        documentVersionId: ids.versionId,
        extractionId: ids.extractionId,
        occurredAt: timestamp,
        correlationId: 'document-correlation-001',
        metadata: { field_count: 3, source: 'reviewer' },
      }).success,
    ).toBe(true);
    expect(
      DocumentAuditEventSchema.safeParse({
        id: ids.extractionId,
        organizationId: ids.organizationId,
        actor: { type: 'service', serviceName: 'document-core' },
        eventType: 'processing_started',
        documentId: ids.documentId,
        documentVersionId: ids.versionId,
        extractionId: null,
        occurredAt: timestamp,
        correlationId: 'document-correlation-001',
        metadata: { prompt: 'do not log this' },
      }).success,
    ).toBe(false);
  });

  it('keeps append commands idempotent and rejects PII-shaped metadata', () => {
    expect(
      AppendDocumentAuditEventCommandSchema.safeParse({
        organizationId: ids.organizationId,
        actor: { type: 'user', userId: ids.actorId },
        eventType: 'approved',
        documentId: ids.documentId,
        documentVersionId: ids.versionId,
        extractionId: ids.extractionId,
        correlationId: 'document-correlation-002',
        metadata: { reason_code: 'reviewed' },
        idempotencyKey: 'audit-event-approval-001',
      }).success,
    ).toBe(true);
    expect(
      AppendDocumentAuditEventCommandSchema.safeParse({
        organizationId: ids.organizationId,
        actor: { type: 'user', userId: ids.actorId },
        eventType: 'approved',
        documentId: ids.documentId,
        documentVersionId: ids.versionId,
        extractionId: ids.extractionId,
        correlationId: 'document-correlation-002',
        metadata: { documentNumber: 'ABC123' },
        idempotencyKey: 'audit-event-approval-002',
      }).success,
    ).toBe(false);
  });

  it('bounds authorized audit history filters', () => {
    expect(
      DocumentAuditHistoryQuerySchema.safeParse({
        organizationId: ids.organizationId,
        documentId: ids.documentId,
        eventTypes: ['uploaded', 'failure_recovered'],
        limit: 50,
        order: 'created_at_desc',
      }).success,
    ).toBe(true);
    expect(
      DocumentAuditHistoryQuerySchema.safeParse({
        organizationId: ids.organizationId,
        limit: 101,
      }).success,
    ).toBe(false);
  });
});
