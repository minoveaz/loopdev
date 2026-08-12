import { z } from 'zod';
import { MarketingIdSchema, MarketingScopedRecordSchema } from './scope';

export const MarketingAssetTypeSchema = z.enum(['image', 'video', 'audio', 'document', 'logo', 'other']);
export const MarketingAssetSchema = MarketingScopedRecordSchema.extend({
  type: MarketingAssetTypeSchema,
  name: z.string().trim().min(1).max(240),
  storagePath: z.string().trim().min(1).max(1024),
  mimeType: z.string().trim().min(3).max(120),
  sizeBytes: z.number().int().nonnegative(),
  checksum: z.string().trim().max(128).nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  durationMs: z.number().int().nonnegative().nullable().optional(),
  approvalStatus: z.enum(['draft', 'in_review', 'approved', 'rejected', 'archived']).default('draft'),
});
export type MarketingAsset = z.infer<typeof MarketingAssetSchema>;

export const MarketingAssetVariantSchema = MarketingScopedRecordSchema.extend({
  assetId: MarketingIdSchema,
  purpose: z.enum(['original', 'thumbnail', 'social_crop', 'compressed', 'other']),
  storagePath: z.string().trim().min(1).max(1024),
  mimeType: z.string().trim().min(3).max(120),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
});
export type MarketingAssetVariant = z.infer<typeof MarketingAssetVariantSchema>;

export const MarketingAssetLinkSchema = MarketingScopedRecordSchema.extend({
  assetId: MarketingIdSchema,
  entityType: z.enum(['brand', 'campaign', 'content_item', 'template']),
  entityId: MarketingIdSchema,
  role: z.enum(['primary', 'secondary', 'logo', 'attachment']).default('secondary'),
});
