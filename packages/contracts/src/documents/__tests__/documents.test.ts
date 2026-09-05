import { describe, expect, it } from 'vitest';
import {
  DocumentExtractionRequestSchema,
  DocumentExtractionResultSchema,
  IdentityDocumentReviewDecisionSchema,
} from '../document-intelligence';
import { DocumentExtractionSchema, DocumentRecordSchema } from '../documents';

const ids = {
  id: '00000000-0000-4000-9000-000000000001',
  organizationId: '00000000-0000-4000-9000-000000000002',
};
const timestamp = '2026-08-09T00:00:00.000Z';

describe('Document Intelligence contracts', () => {
  it('requires protected storage and processing ownership', () => {
    expect(
      DocumentRecordSchema.safeParse({
        id: ids.id,
        organizationId: ids.organizationId,
        documentType: 'identity',
        fileName: 'id.pdf',
        storageRef: 'private/identity/id.pdf',
        mimeType: 'application/pdf',
        processingStatus: 'queued',
        reviewStatus: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
  });

  it('keeps confidence and human review metadata', () => {
    const extraction = DocumentExtractionSchema.parse({
      id: ids.id,
      documentId: ids.organizationId,
      processor: 'ocr',
      processorVersion: '1',
      confidenceScore: 0.72,
      fieldConfidence: { policyNumber: 0.6 },
      requiresHumanReview: true,
      createdAt: timestamp,
    });
    expect(extraction.requiresHumanReview).toBe(true);
  });

  it('validates the tenant-scoped identity extraction contract with nullable fields', () => {
    const request = DocumentExtractionRequestSchema.parse({
      fileName: 'identity.pdf',
      mimeType: 'application/pdf',
      documentReference: 'temporary/actor/identity.pdf',
    });
    expect(request.backFileName).toBeUndefined();

    const result = DocumentExtractionResultSchema.parse({
      classification: { type: 'spanish-dni', confidence: 0.98 },
      fields: {
        documentType: 'spanish-dni',
        issuingCountry: 'ESP',
        fullName: null,
        givenNames: 'MARIA',
        surnames: null,
        firstSurname: null,
        secondSurname: null,
        documentNumber: null,
        birthDate: null,
        nationality: 'ESP',
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
      usage: null,
    });
    expect(result.fields.documentNumber).toBeNull();
  });

  it('keeps review decisions basic and independent from business validations', () => {
    expect(
      IdentityDocumentReviewDecisionSchema.parse({
        documentId: ids.id,
        decision: 'approved',
        comments: null,
      }).decision,
    ).toBe('approved');
  });
});
