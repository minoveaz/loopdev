import { describe, expect, it } from 'vitest';

import type { DocumentCorePersistenceRepository } from '../document-intelligence-persistence';
import {
  DocumentPersistenceIdempotencySchema,
  DocumentPersistenceLookupSchema,
  DocumentPersistenceOwnerSchema,
  DocumentPersistenceRowSchema,
  DocumentVersionPersistenceRowSchema,
  ExtractionPersistenceRowSchema,
} from '../document-intelligence-persistence';

const ids = {
  organizationId: '00000000-0000-4200-9000-000000000001',
  workspaceId: '00000000-0000-4200-9000-000000000002',
  documentId: '00000000-0000-4200-9000-000000000003',
  versionId: '00000000-0000-4200-9000-000000000004',
  extractionId: '00000000-0000-4200-9000-000000000005',
};
const timestamp = '2026-09-06T12:00:00.000Z';

describe('Document Intelligence persistence contracts', () => {
  it('requires canonical organization ownership and optional workspace scope', () => {
    expect(
      DocumentPersistenceOwnerSchema.safeParse({
        organizationId: ids.organizationId,
        workspaceId: ids.workspaceId,
      }).success,
    ).toBe(true);
    expect(
      DocumentPersistenceOwnerSchema.safeParse({
        organizationId: ids.organizationId,
        workspaceId: ids.workspaceId,
        tenantId: ids.organizationId,
      }).success,
    ).toBe(false);
  });

  it('keeps lookup and idempotency keys organization-scoped', () => {
    expect(
      DocumentPersistenceLookupSchema.safeParse({
        organizationId: ids.organizationId,
        documentId: ids.documentId,
      }).success,
    ).toBe(true);
    expect(
      DocumentPersistenceIdempotencySchema.safeParse({
        organizationId: ids.organizationId,
        idempotencyKey: 'create-document-001',
        commandType: 'createDocument',
      }).success,
    ).toBe(true);
    expect(
      DocumentPersistenceIdempotencySchema.safeParse({
        organizationId: ids.organizationId,
        idempotencyKey: 'short',
        commandType: 'createDocument',
      }).success,
    ).toBe(false);
  });

  it('validates database-shaped document, version, and extraction rows', () => {
    expect(
      DocumentPersistenceRowSchema.safeParse({
        id: ids.documentId,
        organizationId: ids.organizationId,
        workspaceId: ids.workspaceId,
        status: 'review',
        currentVersionId: ids.versionId,
        retentionClass: 'standard',
        expiresAt: null,
        version: 1,
        concurrencyToken: 'document-persistence-token',
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
    expect(
      DocumentVersionPersistenceRowSchema.safeParse({
        id: ids.versionId,
        documentId: ids.documentId,
        organizationId: ids.organizationId,
        versionNumber: 1,
        sourceReference: 'private/documents/source.pdf',
        checksum: null,
        extractionId: ids.extractionId,
        createdBy: null,
        version: 1,
        concurrencyToken: 'version-persistence-token',
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
    expect(
      ExtractionPersistenceRowSchema.safeParse({
        id: ids.extractionId,
        documentVersionId: ids.versionId,
        organizationId: ids.organizationId,
        status: 'queued',
        attempt: 1,
        previousAttemptId: null,
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
        concurrencyToken: 'extraction-persistence-token',
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
  });

  it('exposes a typed repository boundary without an implementation or provider', () => {
    const repository: DocumentCorePersistenceRepository = {
      createDocument: async () => {
        throw new Error('test boundary');
      },
      startExtraction: async () => {
        throw new Error('test boundary');
      },
      getDocument: async () => null,
      listHistory: async () => ({ items: [], nextCursor: null, hasMore: false }),
    };

    expect(repository.getDocument).toBeTypeOf('function');
    expect(repository.listHistory).toBeTypeOf('function');
  });
});
