import { describe, expect, it } from 'vitest';

import {
  DocumentValidationEvaluationSchema,
  DocumentValidationRuleSetSchema,
  DocumentValidationRuleSchema,
  EvaluateDocumentValidationCommandSchema,
  ManageDocumentValidationRuleSetCommandSchema,
} from '../document-intelligence-validation';

const ids = {
  organizationId: '00000000-0000-4200-9000-000000000001',
  versionId: '00000000-0000-4200-9000-000000000004',
  actorId: '00000000-0000-4200-9000-000000000005',
};
const timestamp = '2026-09-06T12:00:00.000Z';

const rules = [
  {
    ruleId: 'checksum-document',
    ruleVersion: '1',
    category: 'checksum' as const,
    severity: 'error' as const,
    enabled: true,
    configuration: {
      algorithm: 'sha256' as const,
      sourceField: 'source.checksum',
      expectedField: 'document.checksum',
    },
  },
  {
    ruleId: 'mrz-coherence',
    ruleVersion: '1',
    category: 'mrz' as const,
    severity: 'warning' as const,
    enabled: true,
    configuration: {
      documentNumberField: 'fields.documentNumber',
      birthDateField: 'fields.birthDate',
      expiryDateField: 'fields.expiryDate',
    },
  },
  {
    ruleId: 'document-expiry',
    ruleVersion: '2',
    category: 'expiration' as const,
    severity: 'warning' as const,
    enabled: true,
    configuration: { expiryDateField: 'fields.expiryDate', allowExpired: false },
  },
  {
    ruleId: 'surname-coherence',
    ruleVersion: '1',
    category: 'field_coherence' as const,
    severity: 'info' as const,
    enabled: true,
    configuration: {
      leftField: 'fields.surnames',
      rightField: 'fields.mrzSurnames',
      relation: 'equals' as const,
    },
  },
];

describe('Document Intelligence configurable validation contracts', () => {
  it('supports only explainable checksum, MRZ, expiration, and coherence rules', () => {
    for (const rule of rules) {
      expect(DocumentValidationRuleSchema.safeParse(rule).success).toBe(true);
    }
    expect(
      DocumentValidationRuleSchema.safeParse({
        ...rules[0],
        category: 'liveness',
      }).success,
    ).toBe(false);
  });

  it('versions rule sets and requires organization-scoped permissions', () => {
    const ruleSet = {
      organizationId: ids.organizationId,
      ruleSetVersion: '2026-09-1',
      rules,
      permissions: ['read', 'evaluate', 'manage'] as const,
      createdBy: ids.actorId,
      createdAt: timestamp,
    };

    expect(DocumentValidationRuleSetSchema.safeParse(ruleSet).success).toBe(true);
    expect(
      ManageDocumentValidationRuleSetCommandSchema.safeParse({
        organizationId: ids.organizationId,
        expectedRuleSetVersion: null,
        ruleSet,
        idempotencyKey: 'validation-ruleset-001',
        requiredPermission: 'manage',
      }).success,
    ).toBe(true);
    expect(
      EvaluateDocumentValidationCommandSchema.safeParse({
        organizationId: ids.organizationId,
        documentVersionId: ids.versionId,
        ruleSetVersion: '2026-09-1',
        idempotencyKey: 'validation-evaluate-001',
        requiredPermission: 'read',
      }).success,
    ).toBe(false);
  });

  it('keeps results explainable and linked to the evaluated version', () => {
    expect(
      DocumentValidationEvaluationSchema.safeParse({
        organizationId: ids.organizationId,
        documentVersionId: ids.versionId,
        ruleSetVersion: '2026-09-1',
        evaluatedAt: timestamp,
        results: [
          {
            ruleId: 'document-expiry',
            ruleVersion: '2',
            category: 'expiration',
            severity: 'warning',
            passed: false,
            code: 'DOCUMENT_EXPIRED',
            explanation: 'The configured expiry date is before the evaluation time.',
            fieldPaths: ['fields.expiryDate'],
          },
        ],
      }).success,
    ).toBe(true);
  });
});
