import { describe, expect, it } from 'vitest';

import {
  ApproveExtractionCommandSchema,
  CreateDocumentCommandSchema,
  DOCUMENT_LIFECYCLE_TRANSITIONS,
  DocumentCoreCommandSchema,
  DocumentCoreRecordReadSchema,
  DocumentCoreReadSchema,
  DocumentHistoryQuerySchema,
  DocumentIntelligenceCoreErrorSchema,
  ExtractionRecordReadSchema,
  RetryExtractionCommandSchema,
  UpdateExtractionReviewCommandSchema,
  createDocumentCoreResponseSchema,
  isDocumentLifecycleTransitionAllowed,
  isExtractionLifecycleTransitionAllowed,
} from '../document-intelligence-core';
import {
  DocumentExtractionRequestSchema,
  DocumentExtractionResultSchema,
} from '../document-intelligence';
import { DocumentExtractionSchema, DocumentRecordSchema } from '../documents';

const ids = {
  organizationId: '00000000-0000-4200-9000-000000000001',
  workspaceId: '00000000-0000-4200-9000-000000000002',
  documentId: '00000000-0000-4200-9000-000000000003',
  versionId: '00000000-0000-4200-9000-000000000004',
  extractionId: '00000000-0000-4200-9000-000000000005',
};
const timestamp = '2026-09-06T12:00:00.000Z';
const concurrencyToken = 'document-version-token-1';

describe('Document Intelligence Core contracts', () => {
  it('models organization-scoped versioned reads with opaque concurrency', () => {
    expect(
      DocumentCoreReadSchema.safeParse({
        id: ids.documentId,
        organizationId: ids.organizationId,
        workspaceId: ids.workspaceId,
        status: 'review',
        currentVersionId: ids.versionId,
        retentionClass: 'standard',
        expiresAt: null,
        version: 3,
        concurrencyToken,
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
  });

  it('rejects cross-document and cross-organization record envelopes', () => {
    const record = {
      document: {
        id: ids.documentId,
        organizationId: ids.organizationId,
        workspaceId: ids.workspaceId,
        status: 'review' as const,
        currentVersionId: ids.versionId,
        retentionClass: 'standard',
        expiresAt: null,
        version: 3,
        concurrencyToken,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      version: {
        id: ids.versionId,
        documentId: ids.documentId,
        organizationId: ids.organizationId,
        versionNumber: 1,
        sourceReference: 'private/documents/source.pdf',
        checksum: null,
        extractionId: null,
        createdBy: null,
        version: 1,
        concurrencyToken,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      extraction: null,
    };

    expect(DocumentCoreRecordReadSchema.safeParse(record).success).toBe(true);
    expect(
      DocumentCoreRecordReadSchema.safeParse({
        ...record,
        version: {
          ...record.version,
          organizationId: ids.workspaceId,
        },
      }).success,
    ).toBe(false);
    expect(
      DocumentCoreRecordReadSchema.safeParse({
        ...record,
        version: {
          ...record.version,
          documentId: ids.workspaceId,
        },
      }).success,
    ).toBe(false);
  });

  it('allowlists lifecycle transitions and keeps terminal deletion closed', () => {
    expect(isDocumentLifecycleTransitionAllowed({ from: 'processing', to: 'review' })).toBe(true);
    expect(isDocumentLifecycleTransitionAllowed({ from: 'approved', to: 'processing' })).toBe(
      false,
    );
    expect(isExtractionLifecycleTransitionAllowed({ from: 'failed', to: 'queued' })).toBe(false);
    expect(isExtractionLifecycleTransitionAllowed({ from: 'approved', to: 'review' })).toBe(false);
    expect(DOCUMENT_LIFECYCLE_TRANSITIONS.deleted).toEqual([]);
  });

  it('requires idempotency for creation, retries, and decisions', () => {
    expect(
      CreateDocumentCommandSchema.safeParse({
        type: 'createDocument',
        organizationId: ids.organizationId,
        idempotencyKey: 'upload-request-001',
        input: {
          workspaceId: ids.workspaceId,
          sourceReference: 'private/documents/source.pdf',
          checksum: 'sha256:abc123',
          retentionClass: 'standard',
        },
      }).success,
    ).toBe(true);

    expect(
      RetryExtractionCommandSchema.safeParse({
        type: 'retryExtraction',
        organizationId: ids.organizationId,
        extractionId: ids.extractionId,
        expectedVersion: 2,
        concurrencyToken,
        reason: 'Provider timeout',
      }).success,
    ).toBe(false);

    expect(
      RetryExtractionCommandSchema.safeParse({
        type: 'retryExtraction',
        organizationId: ids.organizationId,
        extractionId: ids.extractionId,
        idempotencyKey: 'retry-request-001',
        expectedVersion: 2,
        concurrencyToken,
        reason: 'Provider timeout',
      }).success,
    ).toBe(true);

    expect(
      UpdateExtractionReviewCommandSchema.safeParse({
        type: 'updateExtractionReview',
        organizationId: ids.organizationId,
        extractionId: ids.extractionId,
        expectedVersion: 2,
        concurrencyToken,
        fieldPatch: { fullName: 'Ada Lovelace' },
      }).success,
    ).toBe(false);

    expect(
      ApproveExtractionCommandSchema.safeParse({
        type: 'approveExtraction',
        organizationId: ids.organizationId,
        extractionId: ids.extractionId,
        expectedVersion: 2,
        concurrencyToken,
        reason: 'Verified by reviewer',
        idempotencyKey: 'approval-request-001',
      }).success,
    ).toBe(true);
  });

  it('discriminates commands and bounds history queries', () => {
    const command = DocumentCoreCommandSchema.parse({
      type: 'startExtraction',
      organizationId: ids.organizationId,
      documentVersionId: ids.versionId,
      capability: 'identity-document',
      idempotencyKey: 'extract-request-001',
    });
    expect(command.type).toBe('startExtraction');

    expect(
      DocumentHistoryQuerySchema.safeParse({
        type: 'listDocumentHistory',
        organizationId: ids.organizationId,
        limit: 101,
      }).success,
    ).toBe(false);
  });

  it('returns mutually exclusive data and sanitized errors', () => {
    const responseSchema = createDocumentCoreResponseSchema(DocumentCoreReadSchema);
    expect(
      responseSchema.safeParse({
        data: null,
        error: {
          code: 'CONFLICT',
          message: 'The document changed before this request completed.',
          correlationId: 'trace-document-001',
        },
      }).success,
    ).toBe(true);
    expect(
      DocumentIntelligenceCoreErrorSchema.safeParse({
        code: 'INTERNAL_STACK',
        message: 'stack',
        correlationId: 'trace-document-001',
      }).success,
    ).toBe(false);
  });

  it('represents retry attempts without mutating the previous extraction', () => {
    const extraction = ExtractionRecordReadSchema.parse({
      id: ids.extractionId,
      documentVersionId: ids.versionId,
      organizationId: ids.organizationId,
      status: 'queued',
      attempt: 2,
      previousAttemptId: ids.documentId,
      provider: 'document-provider',
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
      concurrencyToken,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    expect(extraction.attempt).toBe(2);
    expect(extraction.previousAttemptId).toBe(ids.documentId);
    expect(
      ExtractionRecordReadSchema.safeParse({
        ...extraction,
        attempt: 2,
        previousAttemptId: null,
      }).success,
    ).toBe(false);
    expect(
      ExtractionRecordReadSchema.safeParse({
        ...extraction,
        id: ids.documentId,
        attempt: 1,
        previousAttemptId: ids.documentId,
      }).success,
    ).toBe(false);
  });

  it('preserves all POC request, result, record, and extraction schemas', () => {
    expect(
      DocumentExtractionRequestSchema.safeParse({
        fileName: 'identity-front.jpg',
        mimeType: 'image/jpeg',
        documentReference: 'private/documents/identity-front.jpg',
      }).success,
    ).toBe(true);
    expect(
      DocumentExtractionResultSchema.safeParse({
        classification: { type: 'national-id', confidence: 0.98 },
        fields: {
          documentType: 'national-id',
          issuingCountry: 'ES',
          fullName: 'Ada Lovelace',
          givenNames: 'Ada',
          surnames: 'Lovelace',
          firstSurname: null,
          secondSurname: null,
          documentNumber: 'ABC123',
          birthDate: null,
          nationality: 'GBR',
          sex: null,
          issueDate: null,
          expiryDate: null,
          birthplace: null,
          supportNumber: null,
          address: null,
          mrz: null,
        },
        validations: [],
        provider: 'fixture',
      }).success,
    ).toBe(true);
    expect(
      DocumentRecordSchema.safeParse({
        id: ids.documentId,
        organizationId: ids.organizationId,
        brandId: null,
        workspaceId: ids.workspaceId,
        contactId: null,
        leadId: null,
        opportunityId: null,
        documentType: 'identity',
        fileName: 'identity-front.jpg',
        storageRef: 'private/documents/identity-front.jpg',
        mimeType: 'image/jpeg',
        processingStatus: 'processed',
        reviewStatus: 'approved',
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
    expect(
      DocumentExtractionSchema.safeParse({
        id: ids.extractionId,
        documentId: ids.documentId,
        processor: 'fixture',
        processorVersion: '2026-09',
        confidenceScore: 0.98,
        requiresHumanReview: false,
        createdAt: timestamp,
      }).success,
    ).toBe(true);
  });
});
