import { z } from 'zod';
import { MarketingIdSchema, MarketingTimestampSchema } from '../marketing/scope';

export const BrandContextVersionStatusSchema = z.enum(['draft', 'in_review', 'approved', 'published']);

export const BrandContextVersionSchema = z.object({
  id: MarketingIdSchema,
  organizationId: MarketingIdSchema,
  brandId: MarketingIdSchema,
  versionNumber: z.number().int().positive(),
  status: BrandContextVersionStatusSchema,
  snapshot: z.record(z.string(), z.unknown()),
  publishedAt: MarketingTimestampSchema.nullable().optional(),
  createdBy: MarketingIdSchema.nullable().optional(),
  createdAt: MarketingTimestampSchema,
});

export type BrandContextVersion = z.infer<typeof BrandContextVersionSchema>;
