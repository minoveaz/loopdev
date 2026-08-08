import { z } from 'zod';
import { MarketingIdSchema, MarketingLocaleSchema, MarketingScopedRecordSchema, MarketingTimestampSchema } from './scope';

export const MarketingCampaignStatusSchema = z.enum(['draft', 'in_review', 'approved', 'scheduled', 'active', 'paused', 'completed', 'archived']);
export const MarketingChannelSchema = z.enum(['facebook', 'instagram', 'linkedin', 'google', 'tiktok', 'x', 'email', 'landing_page', 'sms']);
export const MarketingDeliveryModeSchema = z.enum(['manual', 'automatic']);
export const MarketingCopyChannelSchema = z.enum(['social', 'email', 'landing_page', 'advertising', 'sms']);

export const MarketingCampaignSchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  name: z.string().trim().min(1).max(160),
  objective: z.string().trim().min(1).max(240),
  status: MarketingCampaignStatusSchema.default('draft'),
  startsAt: MarketingTimestampSchema.nullable().optional(),
  endsAt: MarketingTimestampSchema.nullable().optional(),
  budget: z.number().nonnegative().nullable().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
});
export type MarketingCampaign = z.infer<typeof MarketingCampaignSchema>;

export const CampaignChannelSchema = MarketingScopedRecordSchema.extend({
  campaignId: MarketingIdSchema,
  channel: MarketingChannelSchema,
  deliveryMode: MarketingDeliveryModeSchema,
  socialConnectionId: MarketingIdSchema.nullable().optional(),
  status: z.enum(['draft', 'ready', 'scheduled', 'delivered', 'failed']).default('draft'),
});

export const MarketingCopySchema = MarketingScopedRecordSchema.extend({
  brandId: MarketingIdSchema,
  campaignId: MarketingIdSchema,
  channel: MarketingCopyChannelSchema,
  locale: MarketingLocaleSchema.default('es-ES'),
  content: z.string().trim().min(1).max(20_000),
  version: z.number().int().positive().default(1),
  approvalStatus: z.enum(['draft', 'in_review', 'approved', 'rejected']).default('draft'),
});
export type MarketingCopy = z.infer<typeof MarketingCopySchema>;

export const CampaignScheduleSchema = MarketingScopedRecordSchema.extend({
  campaignId: MarketingIdSchema,
  campaignChannelId: MarketingIdSchema.nullable().optional(),
  scheduledFor: MarketingTimestampSchema,
  timezone: z.string().trim().min(1).max(64),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled', 'failed']).default('pending'),
});

export const CampaignUtmLinkSchema = MarketingScopedRecordSchema.extend({
  campaignId: MarketingIdSchema,
  source: z.string().trim().min(1).max(100),
  medium: z.string().trim().min(1).max(100),
  campaign: z.string().trim().min(1).max(160),
  content: z.string().trim().max(160).nullable().optional(),
  destinationUrl: z.string().url(),
});

export const CreateMarketingCampaignSchema = MarketingCampaignSchema.omit({
  id: true, createdAt: true, updatedAt: true, createdBy: true, updatedBy: true,
});
export type CreateMarketingCampaignInput = z.infer<typeof CreateMarketingCampaignSchema>;

export const UpdateMarketingCampaignSchema = z.object({
  organizationId: MarketingIdSchema,
  workspaceId: MarketingIdSchema,
  campaignId: MarketingIdSchema,
  brandId: MarketingIdSchema.optional(),
  name: MarketingCampaignSchema.shape.name.optional(),
  objective: MarketingCampaignSchema.shape.objective.optional(),
  status: MarketingCampaignStatusSchema.optional(),
  startsAt: MarketingCampaignSchema.shape.startsAt,
  endsAt: MarketingCampaignSchema.shape.endsAt,
  budget: MarketingCampaignSchema.shape.budget,
  currency: MarketingCampaignSchema.shape.currency.optional(),
}).refine((input) => Object.keys(input).some((key) => !['organizationId', 'workspaceId', 'campaignId'].includes(key)), {
  message: 'At least one campaign field is required',
});
export type UpdateMarketingCampaignInput = z.infer<typeof UpdateMarketingCampaignSchema>;
