import { z } from 'zod';
import { MarketingIdSchema, MarketingScopedRecordSchema, MarketingTimestampSchema } from './scope';

export const ComplianceRuleSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema.nullable().optional(),
  name: z.string().trim().min(1).max(160),
  appliesTo: z.array(z.enum(['brand', 'asset', 'content', 'campaign'])).min(1),
  severity: z.enum(['info', 'warning', 'blocking']),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  definition: z.record(z.unknown()),
});

export const ComplianceFindingSchema = MarketingScopedRecordSchema.extend({
  ruleId: MarketingIdSchema,
  entityType: z.enum(['brand', 'asset', 'content', 'campaign']),
  entityId: MarketingIdSchema,
  severity: z.enum(['info', 'warning', 'blocking']),
  message: z.string().trim().min(1).max(2_000),
  status: z.enum(['open', 'resolved', 'accepted_risk']).default('open'),
  resolvedAt: MarketingTimestampSchema.nullable().optional(),
});

export const MarketingWorkspaceSettingsSchema = MarketingScopedRecordSchema.extend({
  workspaceId: MarketingIdSchema,
  defaultLocale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/).default('es-ES'),
  timezone: z.string().trim().min(1).max(64),
  defaultUtmSource: z.string().trim().max(100).nullable().optional(),
  defaultUtmMedium: z.string().trim().max(100).nullable().optional(),
});
