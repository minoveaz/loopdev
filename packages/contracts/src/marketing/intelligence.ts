import { z } from 'zod';
import { MarketingIdSchema, MarketingScopedRecordSchema, MarketingTimestampSchema } from './scope';

export const MarketingMetricSnapshotSchema = MarketingScopedRecordSchema.extend({
  campaignId: MarketingIdSchema.nullable().optional(),
  socialConnectionId: MarketingIdSchema.nullable().optional(),
  metricDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  metric: z.enum(['impressions', 'reach', 'clicks', 'spend', 'conversions', 'revenue']),
  value: z.number().nonnegative(),
  currency: z.string().regex(/^[A-Z]{3}$/).nullable().optional(),
  source: z.string().trim().min(1).max(100),
});

export const GrowthExperimentSchema = MarketingScopedRecordSchema.extend({
  campaignId: MarketingIdSchema.nullable().optional(),
  name: z.string().trim().min(1).max(160),
  hypothesis: z.string().trim().min(1).max(2_000),
  primaryMetric: z.string().trim().min(1).max(100),
  status: z.enum(['draft', 'running', 'completed', 'cancelled']).default('draft'),
  startsAt: MarketingTimestampSchema.nullable().optional(),
  endsAt: MarketingTimestampSchema.nullable().optional(),
});

export const GrowthExperimentVariantSchema = MarketingScopedRecordSchema.extend({
  experimentId: MarketingIdSchema,
  name: z.string().trim().min(1).max(160),
  allocationPercent: z.number().min(0).max(100),
  contentItemId: MarketingIdSchema.nullable().optional(),
});

export const AdvisorRecommendationSchema = MarketingScopedRecordSchema.extend({
  campaignId: MarketingIdSchema.nullable().optional(),
  recommendationType: z.enum(['performance', 'compliance', 'content', 'integration']),
  summary: z.string().trim().min(1).max(2_000),
  evidence: z.array(z.string().trim().min(1).max(500)).max(20),
  confidence: z.number().min(0).max(1),
  status: z.enum(['proposed', 'accepted', 'dismissed', 'executed']).default('proposed'),
  requiresApproval: z.boolean().default(true),
});
