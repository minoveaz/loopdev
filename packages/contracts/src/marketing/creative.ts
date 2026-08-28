import { z } from 'zod';
import { MarketingIdSchema, MarketingScopedRecordSchema } from './scope';
import { CreativeDocumentSchema } from './creative-assets';

export const MarketingCreativeProjectTypeSchema = z.enum([
  'social_post',
  'story',
  'advertisement',
  'banner',
  'other',
]);
export type MarketingCreativeProjectType = z.infer<typeof MarketingCreativeProjectTypeSchema>;

export const MarketingCreativeProjectStatusSchema = z.enum([
  'draft',
  'in_review',
  'approved',
  'archived',
]);
export type MarketingCreativeProjectStatus = z.infer<typeof MarketingCreativeProjectStatusSchema>;

export const MarketingCreativeProjectSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2_000).nullable().optional(),
  type: MarketingCreativeProjectTypeSchema.default('social_post'),
  status: MarketingCreativeProjectStatusSchema.default('draft'),
  currentVersionNumber: z.number().int().nonnegative().default(0),
  draftDocument: CreativeDocumentSchema.default({}),
  autosaveRevision: z.number().int().nonnegative().default(0),
  autosavedAt: z.string().datetime().nullable().optional(),
});
export type MarketingCreativeProject = z.infer<typeof MarketingCreativeProjectSchema>;

export const CreateMarketingCreativeProjectSchema = MarketingCreativeProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});
export type CreateMarketingCreativeProjectInput = z.input<
  typeof CreateMarketingCreativeProjectSchema
>;

export const MarketingCreativeProjectVersionSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  projectId: MarketingIdSchema,
  versionNumber: z.number().int().positive(),
  document: CreativeDocumentSchema.default({}),
  changeSummary: z.string().trim().max(1_000).nullable().optional(),
});
export type MarketingCreativeProjectVersion = z.infer<
  typeof MarketingCreativeProjectVersionSchema
>;

export const CreateMarketingCreativeProjectVersionSchema =
  MarketingCreativeProjectVersionSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
  });
export type CreateMarketingCreativeProjectVersionInput = z.input<
  typeof CreateMarketingCreativeProjectVersionSchema
>;

export const MarketingCreativeVariantChannelSchema = z.enum([
  'facebook',
  'instagram',
  'linkedin',
  'tiktok',
  'x',
  'email',
  'other',
]);
export const MarketingCreativeVariantFormatSchema = z.enum([
  'square',
  'portrait',
  'landscape',
  'story',
  'custom',
]);
export const MarketingCreativeVariantStatusSchema = z.enum([
  'draft',
  'approved',
  'archived',
]);

export const MarketingCreativeVariantSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  projectId: MarketingIdSchema,
  projectVersionId: MarketingIdSchema,
  key: z.string().trim().min(1).max(80),
  channel: MarketingCreativeVariantChannelSchema,
  format: MarketingCreativeVariantFormatSchema,
  payload: CreativeDocumentSchema.default({}),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  status: MarketingCreativeVariantStatusSchema.default('draft'),
});
export type MarketingCreativeVariant = z.infer<typeof MarketingCreativeVariantSchema>;

export const CreateMarketingCreativeVariantSchema = MarketingCreativeVariantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});
export type CreateMarketingCreativeVariantInput = z.input<
  typeof CreateMarketingCreativeVariantSchema
>;
