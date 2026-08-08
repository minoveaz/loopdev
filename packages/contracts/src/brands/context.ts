import { z } from 'zod';
import { BrandSchema, BrandStatusSchema } from './brand';
import { MarketingAssetSchema } from '../marketing/asset';

/**
 * Stable read model consumed by Content Engine and Campaign Orchestrator.
 * Storage-specific rows must be mapped to this contract before crossing the
 * Brand Hub boundary.
 */
export const BrandContextSnapshotSchema = z.object({
  brand: BrandSchema.extend({
    identity: z.record(z.string(), z.unknown()).optional(),
    palette: z.record(z.string(), z.unknown()).optional(),
  }),
  organizationId: z.string().uuid(),
  version: z.object({
    id: z.string().uuid().nullable(),
    number: z.number().int().positive().nullable(),
    status: z.enum(['draft', 'in_review', 'approved', 'published']).default('published'),
    publishedAt: z.string().datetime().nullable(),
  }),
  assets: z.array(MarketingAssetSchema).default([]),
  approvedClaims: z.array(z.string().trim().min(1)).default([]),
  forbiddenClaims: z.array(z.string().trim().min(1)).default([]),
  rules: z.object({
    engine: BrandSchema.shape.rulesEngine.optional(),
    evaluatedAt: z.string().datetime().nullable(),
  }),
  generatedAt: z.string().datetime(),
}).superRefine((snapshot, context) => {
  if (snapshot.brand.organizationId !== snapshot.organizationId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['brand', 'organizationId'],
      message: 'Brand must belong to the snapshot organization',
    });
  }
});

export type BrandContextSnapshot = z.infer<typeof BrandContextSnapshotSchema>;

export const BrandContextSourceStatusSchema = z.object({
  brandStatus: BrandStatusSchema,
  hasPublishedVersion: z.boolean(),
  assetCount: z.number().int().nonnegative(),
  blockingRuleCount: z.number().int().nonnegative(),
});

export type BrandContextSourceStatus = z.infer<typeof BrandContextSourceStatusSchema>;
