import { z } from 'zod';
import { MarketingIdSchema, MarketingScopedRecordSchema, MarketingTimestampSchema } from './scope';

export const CREATIVE_STUDIO_CAPACITY_LIMITS = Object.freeze({
  maxAssetBytes: 25 * 1024 * 1024,
  maxProjectBytes: 10 * 1024 * 1024,
  maxThumbnailBytes: 512 * 1024,
  maxProjectVersions: 10,
  orphanGracePeriodHours: 24,
  temporaryExportTtlHours: 24,
  indexedDbCacheBytes: 50 * 1024 * 1024,
});

const INLINE_DATA_URL_PATTERN = /^data:[^,]+;base64,/i;
const INLINE_BASE64_PATTERN = /(?:^|[/:_-])base64(?:[;,]|$)/i;
const LONG_BASE64_PATTERN = /^[A-Za-z0-9+/]{256,}={0,2}$/;
const STORAGE_PATH_PATTERN =
  /^org\/[0-9a-f-]{36}\/workspace\/[0-9a-f-]{36}\/(source|export|thumbnail)\/[a-f0-9]{64}[^/]*$/i;

export function containsInlineCreativeData(value: unknown): boolean {
  if (typeof value === 'string') {
    return (
      INLINE_DATA_URL_PATTERN.test(value)
      || INLINE_BASE64_PATTERN.test(value)
      || LONG_BASE64_PATTERN.test(value)
    );
  }
  if (Array.isArray(value)) return value.some(containsInlineCreativeData);
  if (value !== null && typeof value === 'object') {
    return Object.values(value).some(containsInlineCreativeData);
  }
  return false;
}

export const CreativeDocumentSchema = z.record(z.string(), z.unknown()).superRefine((document, ctx) => {
  if (containsInlineCreativeData(document)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Creative documents must reference Storage assets instead of base64 or data URLs',
    });
  }
  if (JSON.stringify(document).length > CREATIVE_STUDIO_CAPACITY_LIMITS.maxProjectBytes) {
    ctx.addIssue({
      code: 'too_big',
      maximum: CREATIVE_STUDIO_CAPACITY_LIMITS.maxProjectBytes,
      type: 'string',
      inclusive: true,
      message: 'Creative project documents exceed the configured size limit',
    });
  }
});
export type CreativeDocument = z.infer<typeof CreativeDocumentSchema>;

export const CreativeLayerReferenceSchema = z.object({
  id: MarketingIdSchema,
  type: z.string().trim().min(1).max(80),
  assetId: MarketingIdSchema,
}).passthrough();
export type CreativeLayerReference = z.infer<typeof CreativeLayerReferenceSchema>;

export const MarketingCreativeAssetKindSchema = z.enum(['source', 'export', 'thumbnail']);
export type MarketingCreativeAssetKind = z.infer<typeof MarketingCreativeAssetKindSchema>;

export const MarketingCreativeAssetStatusSchema = z.enum(['active', 'orphaned', 'expired']);

const MarketingCreativeAssetBaseSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  projectId: MarketingIdSchema.nullable().optional(),
  kind: MarketingCreativeAssetKindSchema,
  status: MarketingCreativeAssetStatusSchema.default('active'),
  storagePath: z.string().trim().min(1).max(1_024).refine(
    (path) => STORAGE_PATH_PATTERN.test(path),
    'Creative assets must use safe Storage paths',
  ),
  mimeType: z.string().trim().min(3).max(120),
  sizeBytes: z.number().int().positive().max(CREATIVE_STUDIO_CAPACITY_LIMITS.maxAssetBytes),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/i, 'contentHash must be a SHA-256 hex digest'),
  sourceAssetId: MarketingIdSchema.nullable().optional(),
  compressed: z.boolean().default(false),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  expiresAt: MarketingTimestampSchema.nullable().optional(),
  orphanedAt: MarketingTimestampSchema.nullable().optional(),
});

type CreativeAssetValidation = {
  kind: MarketingCreativeAssetKind;
  sourceAssetId?: string | null;
  compressed: boolean;
  sizeBytes: number;
  expiresAt?: string | null;
};

function validateCreativeAsset(asset: CreativeAssetValidation, ctx: z.RefinementCtx) {
  if (asset.kind === 'source' && asset.sourceAssetId) {
    ctx.addIssue({ code: 'custom', path: ['sourceAssetId'], message: 'Source assets cannot reference another asset' });
  }
  if (asset.kind === 'thumbnail') {
    if (!asset.sourceAssetId) {
      ctx.addIssue({ code: 'custom', path: ['sourceAssetId'], message: 'Thumbnails require a source asset' });
    }
    if (!asset.compressed) {
      ctx.addIssue({ code: 'custom', path: ['compressed'], message: 'Thumbnails must be compressed' });
    }
    if (asset.sizeBytes > CREATIVE_STUDIO_CAPACITY_LIMITS.maxThumbnailBytes) {
      ctx.addIssue({
        code: 'too_big',
        path: ['sizeBytes'],
        maximum: CREATIVE_STUDIO_CAPACITY_LIMITS.maxThumbnailBytes,
        type: 'number',
        inclusive: true,
      });
    }
  }
  if (asset.kind === 'export' && !asset.expiresAt) {
    ctx.addIssue({ code: 'custom', path: ['expiresAt'], message: 'Temporary exports require an expiration timestamp' });
  }
  if (asset.kind !== 'export' && asset.expiresAt) {
    ctx.addIssue({ code: 'custom', path: ['expiresAt'], message: 'Only temporary exports may expire' });
  }
}

export const MarketingCreativeAssetSchema = MarketingCreativeAssetBaseSchema.superRefine(validateCreativeAsset);
export type MarketingCreativeAsset = z.infer<typeof MarketingCreativeAssetSchema>;

export const CreateMarketingCreativeAssetSchema = MarketingCreativeAssetBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
}).superRefine(validateCreativeAsset);
export type CreateMarketingCreativeAssetInput = z.input<typeof CreateMarketingCreativeAssetSchema>;

export const MarketingCreativeAssetReferenceTypeSchema = z.enum(['layer', 'variant', 'thumbnail']);

const MarketingCreativeAssetReferenceBaseSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  assetId: MarketingIdSchema,
  projectId: MarketingIdSchema,
  projectVersionId: MarketingIdSchema.nullable().optional(),
  variantId: MarketingIdSchema.nullable().optional(),
  layerId: MarketingIdSchema.nullable().optional(),
  referenceType: MarketingCreativeAssetReferenceTypeSchema,
});

type CreativeAssetReferenceValidation = {
  referenceType: MarketingCreativeAssetReferenceType;
  projectVersionId?: string | null;
  variantId?: string | null;
  layerId?: string | null;
};

type MarketingCreativeAssetReferenceType = z.infer<typeof MarketingCreativeAssetReferenceTypeSchema>;

function validateCreativeAssetReference(reference: CreativeAssetReferenceValidation, ctx: z.RefinementCtx) {
  if (reference.referenceType === 'layer' && (!reference.projectVersionId || !reference.layerId)) {
    ctx.addIssue({ code: 'custom', message: 'Layer references require projectVersionId and layerId' });
  }
  if (reference.referenceType === 'variant' && !reference.variantId) {
    ctx.addIssue({ code: 'custom', message: 'Variant references require variantId' });
  }
}

export const MarketingCreativeAssetReferenceSchema =
  MarketingCreativeAssetReferenceBaseSchema.superRefine(validateCreativeAssetReference);
export type MarketingCreativeAssetReference = z.infer<typeof MarketingCreativeAssetReferenceSchema>;

export const CreateMarketingCreativeAssetReferenceSchema = MarketingCreativeAssetReferenceBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
}).superRefine(validateCreativeAssetReference);
export type CreateMarketingCreativeAssetReferenceInput = z.input<
  typeof CreateMarketingCreativeAssetReferenceSchema
>;

export const MarketingCreativeStorageUsageSchema = z.object({
  organizationId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  usedBytes: z.number().int().nonnegative(),
  assetCount: z.number().int().nonnegative(),
  quotaBytes: z.number().int().positive().nullable(),
  indexedDbIsCacheOnly: z.literal(true),
});
export type MarketingCreativeStorageUsage = z.infer<typeof MarketingCreativeStorageUsageSchema>;

export const AutosaveMarketingCreativeProjectSchema = z.object({
  organizationId: MarketingIdSchema,
  brandId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  projectId: MarketingIdSchema,
  document: CreativeDocumentSchema,
  autosaveRevision: z.number().int().nonnegative(),
});
export type AutosaveMarketingCreativeProjectInput = z.input<
  typeof AutosaveMarketingCreativeProjectSchema
>;
