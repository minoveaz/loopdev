import { z } from 'zod';

export const MarketingIdSchema = z.string().uuid();
export const MarketingTimestampSchema = z.string().datetime();
export const MarketingLocaleSchema = z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/);

export const MarketingOwnershipSchema = z.object({
  organizationId: MarketingIdSchema,
  brandId: MarketingIdSchema.nullable().optional(),
  workspaceId: MarketingIdSchema.nullable().optional(),
});

export const MarketingPermissionSchema = z.enum(['read', 'edit', 'approve', 'publish', 'manage']);
export type MarketingPermission = z.infer<typeof MarketingPermissionSchema>;

export const MarketingAccessGrantSchema = z.object({
  userId: MarketingIdSchema,
  organizationId: MarketingIdSchema,
  workspaceId: MarketingIdSchema.nullable().optional(),
  brandId: MarketingIdSchema.nullable().optional(),
  permission: MarketingPermissionSchema,
  grantedBy: MarketingIdSchema,
  expiresAt: MarketingTimestampSchema.nullable().optional(),
  createdAt: MarketingTimestampSchema,
  updatedAt: MarketingTimestampSchema,
});

export type MarketingAccessGrant = z.infer<typeof MarketingAccessGrantSchema>;

export const MarketingAuditFieldsSchema = z.object({
  createdAt: MarketingTimestampSchema,
  updatedAt: MarketingTimestampSchema,
  createdBy: MarketingIdSchema.nullable().optional(),
  updatedBy: MarketingIdSchema.nullable().optional(),
});

export const MarketingScopedRecordSchema = MarketingOwnershipSchema.merge(MarketingAuditFieldsSchema).extend({
  id: MarketingIdSchema,
});
