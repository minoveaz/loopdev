import { z } from 'zod';
import {
  MarketingIdSchema,
  MarketingLocaleSchema,
  MarketingScopedRecordSchema,
  MarketingTimestampSchema,
} from './scope';

export const ContentItemTypeSchema = z.enum([
  'social_post',
  'email',
  'landing_page',
  'advertisement',
  'script',
  'other',
]);
export const ContentBriefSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  brandVersionId: MarketingIdSchema.nullable().optional(),
  campaignId: MarketingIdSchema.nullable().optional(),
  name: z.string().trim().min(1).max(160),
  objective: z.string().trim().min(1).max(240),
  audience: z.string().trim().max(2_000).nullable().optional(),
  locale: MarketingLocaleSchema.default('es-ES'),
  callToAction: z.string().trim().max(500).nullable().optional(),
});
export type ContentBrief = z.infer<typeof ContentBriefSchema>;
export const CreateContentBriefSchema = ContentBriefSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});
export type CreateContentBriefInput = z.infer<typeof CreateContentBriefSchema>;

export const ContentItemSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  brandVersionId: MarketingIdSchema.nullable().optional(),
  campaignId: MarketingIdSchema.nullable().optional(),
  briefId: MarketingIdSchema.nullable().optional(),
  type: ContentItemTypeSchema,
  title: z.string().trim().min(1).max(240),
  locale: MarketingLocaleSchema.default('es-ES'),
  status: z.enum(['draft', 'in_review', 'approved', 'published', 'archived']).default('draft'),
  currentVersion: z.number().int().positive().default(1),
});
export type ContentItem = z.infer<typeof ContentItemSchema>;
export const CreateContentItemSchema = ContentItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});
export type CreateContentItemInput = z.infer<typeof CreateContentItemSchema>;

export const ContentVersionSchema = MarketingScopedRecordSchema.extend({
  contentItemId: MarketingIdSchema,
  version: z.number().int().positive(),
  body: z.string().trim().min(1).max(50_000),
  changeSummary: z.string().trim().max(1_000).nullable().optional(),
});
export type ContentVersion = z.infer<typeof ContentVersionSchema>;
export const CreateContentVersionSchema = ContentVersionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});
export type CreateContentVersionInput = z.infer<typeof CreateContentVersionSchema>;

export const ContentGenerationJobSchema = MarketingScopedRecordSchema.extend({
  brandVersionId: MarketingIdSchema.nullable().optional(),
  briefId: MarketingIdSchema.nullable().optional(),
  contentItemId: MarketingIdSchema.nullable().optional(),
  provider: z.string().trim().min(1).max(100),
  model: z.string().trim().min(1).max(160),
  status: z.enum(['queued', 'running', 'completed', 'failed', 'cancelled']),
  inputHash: z.string().trim().min(1).max(128),
  completedAt: MarketingTimestampSchema.nullable().optional(),
});
