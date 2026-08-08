import { z } from 'zod';

export const MarketingIdSchema = z.string().uuid();
export const MarketingTimestampSchema = z.string().datetime();
export const MarketingLocaleSchema = z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/);

export const MarketingOwnershipSchema = z.object({
  organizationId: MarketingIdSchema,
  brandId: MarketingIdSchema.nullable().optional(),
  workspaceId: MarketingIdSchema.nullable().optional(),
});

export const MarketingAuditFieldsSchema = z.object({
  createdAt: MarketingTimestampSchema,
  updatedAt: MarketingTimestampSchema,
  createdBy: MarketingIdSchema.nullable().optional(),
  updatedBy: MarketingIdSchema.nullable().optional(),
});

export const MarketingScopedRecordSchema = MarketingOwnershipSchema.merge(MarketingAuditFieldsSchema).extend({
  id: MarketingIdSchema,
});
