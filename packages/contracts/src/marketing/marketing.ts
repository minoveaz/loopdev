import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const MarketingCampaignStatusSchema = z.enum(['draft', 'scheduled', 'active', 'paused', 'completed', 'archived']);
export const MarketingAssetTypeSchema = z.enum(['image', 'video', 'document', 'logo', 'other']);
export const MarketingCopyChannelSchema = z.enum(['social', 'email', 'landing_page', 'advertising', 'sms']);
export const SocialProviderSchema = z.enum(['facebook', 'instagram', 'linkedin', 'google', 'tiktok', 'x']);
export const SocialConnectionStatusSchema = z.enum(['connected', 'expired', 'revoked', 'error']);

export const MarketingCampaignSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema,
  workspaceId: IdSchema,
  name: z.string().trim().min(1).max(160),
  objective: z.string().trim().min(1).max(240),
  status: MarketingCampaignStatusSchema.default('draft'),
  startsAt: TimestampSchema.nullable().optional(),
  endsAt: TimestampSchema.nullable().optional(),
  budget: z.number().nonnegative().nullable().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type MarketingCampaign = z.infer<typeof MarketingCampaignSchema>;

export const MarketingAssetSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema,
  campaignId: IdSchema.nullable().optional(),
  type: MarketingAssetTypeSchema,
  name: z.string().trim().min(1).max(240),
  storagePath: z.string().trim().min(1).max(1024),
  mimeType: z.string().trim().min(3).max(120),
  sizeBytes: z.number().int().nonnegative(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type MarketingAsset = z.infer<typeof MarketingAssetSchema>;

export const MarketingCopySchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema,
  campaignId: IdSchema,
  channel: MarketingCopyChannelSchema,
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/).default('es-ES'),
  content: z.string().trim().min(1).max(20_000),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type MarketingCopy = z.infer<typeof MarketingCopySchema>;

export const SocialConnectionSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  provider: SocialProviderSchema,
  externalAccountId: z.string().trim().min(1).max(255),
  displayName: z.string().trim().min(1).max(255),
  status: SocialConnectionStatusSchema.default('connected'),
  expiresAt: TimestampSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type SocialConnection = z.infer<typeof SocialConnectionSchema>;
