import { describe, expect, it } from 'vitest';
import { DocumentExtractionSchema, DocumentRecordSchema } from '../documents';

const ids = { id: '00000000-0000-4000-9000-000000000001', organizationId: '00000000-0000-4000-9000-000000000002' };
const timestamp = '2026-08-09T00:00:00.000Z';

describe('Document Intelligence contracts', () => {
  it('requires protected storage and processing ownership', () => {
    expect(DocumentRecordSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, documentType: 'identity', fileName: 'id.pdf', storageRef: 'private/identity/id.pdf', mimeType: 'application/pdf', processingStatus: 'queued', reviewStatus: 'pending', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });

  it('keeps confidence and human review metadata', () => {
    const extraction = DocumentExtractionSchema.parse({ id: ids.id, documentId: ids.organizationId, processor: 'ocr', processorVersion: '1', confidenceScore: 0.72, fieldConfidence: { policyNumber: 0.6 }, requiresHumanReview: true, createdAt: timestamp });
    expect(extraction.requiresHumanReview).toBe(true);
  });
});
