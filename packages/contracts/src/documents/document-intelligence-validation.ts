import { z } from 'zod';

import { DocumentCoreValidationSeveritySchema } from './document-intelligence-core';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();
const VersionSchema = z.string().trim().min(1).max(80);
const FieldPathSchema = z.string().trim().min(1).max(500);

export const DocumentValidationRuleCategorySchema = z.enum([
  'checksum',
  'mrz',
  'expiration',
  'field_coherence',
]);
export type DocumentValidationRuleCategory = z.infer<typeof DocumentValidationRuleCategorySchema>;

const CommonRuleFields = {
  ruleId: z.string().trim().min(1).max(160),
  ruleVersion: VersionSchema,
  severity: DocumentCoreValidationSeveritySchema,
  enabled: z.boolean(),
};

export const DocumentValidationRuleSchema = z.discriminatedUnion('category', [
  z
    .object({
      ...CommonRuleFields,
      category: z.literal('checksum'),
      configuration: z
        .object({
          algorithm: z.enum(['sha256']),
          sourceField: FieldPathSchema,
          expectedField: FieldPathSchema,
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...CommonRuleFields,
      category: z.literal('mrz'),
      configuration: z
        .object({
          documentNumberField: FieldPathSchema,
          birthDateField: FieldPathSchema,
          expiryDateField: FieldPathSchema,
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...CommonRuleFields,
      category: z.literal('expiration'),
      configuration: z
        .object({
          expiryDateField: FieldPathSchema,
          allowExpired: z.boolean(),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...CommonRuleFields,
      category: z.literal('field_coherence'),
      configuration: z
        .object({
          leftField: FieldPathSchema,
          rightField: FieldPathSchema,
          relation: z.enum(['equals', 'not_equals']),
        })
        .strict(),
    })
    .strict(),
]);
export type DocumentValidationRule = z.infer<typeof DocumentValidationRuleSchema>;

export const DocumentValidationRulePermissionSchema = z.enum(['read', 'evaluate', 'manage']);
export type DocumentValidationRulePermission = z.infer<
  typeof DocumentValidationRulePermissionSchema
>;

export const DocumentValidationRuleSetSchema = z
  .object({
    organizationId: IdSchema,
    ruleSetVersion: VersionSchema,
    rules: z.array(DocumentValidationRuleSchema).min(1).max(100),
    permissions: z.array(DocumentValidationRulePermissionSchema).min(1).max(3),
    createdBy: IdSchema,
    createdAt: TimestampSchema,
  })
  .strict()
  .superRefine((ruleSet, ctx) => {
    const ruleIds = new Set<string>();
    for (const rule of ruleSet.rules) {
      if (ruleIds.has(rule.ruleId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rules'],
          message: 'A rule set cannot contain duplicate rule IDs.',
        });
      }
      ruleIds.add(rule.ruleId);
    }
  });
export type DocumentValidationRuleSet = z.infer<typeof DocumentValidationRuleSetSchema>;

export const ManageDocumentValidationRuleSetCommandSchema = z
  .object({
    organizationId: IdSchema,
    expectedRuleSetVersion: VersionSchema.nullable(),
    ruleSet: DocumentValidationRuleSetSchema,
    idempotencyKey: z.string().trim().min(8).max(160),
    requiredPermission: z.literal('manage'),
  })
  .strict();
export type ManageDocumentValidationRuleSetCommand = z.infer<
  typeof ManageDocumentValidationRuleSetCommandSchema
>;

export const EvaluateDocumentValidationCommandSchema = z
  .object({
    organizationId: IdSchema,
    documentVersionId: IdSchema,
    ruleSetVersion: VersionSchema,
    idempotencyKey: z.string().trim().min(8).max(160),
    requiredPermission: z.literal('evaluate'),
  })
  .strict();
export type EvaluateDocumentValidationCommand = z.infer<
  typeof EvaluateDocumentValidationCommandSchema
>;

export const DocumentValidationResultSchema = z
  .object({
    ruleId: z.string().trim().min(1).max(160),
    ruleVersion: VersionSchema,
    category: DocumentValidationRuleCategorySchema,
    severity: DocumentCoreValidationSeveritySchema,
    passed: z.boolean(),
    code: z.string().trim().min(1).max(160),
    explanation: z.string().trim().min(1).max(1_000),
    fieldPaths: z.array(FieldPathSchema).max(20),
  })
  .strict();
export type DocumentValidationResult = z.infer<typeof DocumentValidationResultSchema>;

export const DocumentValidationEvaluationSchema = z
  .object({
    organizationId: IdSchema,
    documentVersionId: IdSchema,
    ruleSetVersion: VersionSchema,
    evaluatedAt: TimestampSchema,
    results: z.array(DocumentValidationResultSchema).max(100),
  })
  .strict();
export type DocumentValidationEvaluation = z.infer<typeof DocumentValidationEvaluationSchema>;

export interface DocumentValidationRepository {
  saveRuleSet(command: ManageDocumentValidationRuleSetCommand): Promise<DocumentValidationRuleSet>;
  evaluate(command: EvaluateDocumentValidationCommand): Promise<DocumentValidationEvaluation>;
}
