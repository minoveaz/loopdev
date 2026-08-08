import { z } from 'zod';
import { MarketingIdSchema, MarketingScopedRecordSchema, MarketingTimestampSchema } from './scope';

export const SocialProviderSchema = z.enum(['facebook', 'instagram', 'linkedin', 'google', 'tiktok', 'x']);
export const SocialConnectionStatusSchema = z.enum(['connected', 'expired', 'revoked', 'error']);

export const SocialConnectionSchema = MarketingScopedRecordSchema.extend({
  provider: SocialProviderSchema,
  externalAccountId: z.string().trim().min(1).max(255),
  displayName: z.string().trim().min(1).max(255),
  status: SocialConnectionStatusSchema.default('connected'),
  expiresAt: MarketingTimestampSchema.nullable().optional(),
});
export type SocialConnection = z.infer<typeof SocialConnectionSchema>;

export const SocialConnectionAccountSchema = MarketingScopedRecordSchema.extend({
  socialConnectionId: MarketingIdSchema,
  externalAccountId: z.string().trim().min(1).max(255),
  displayName: z.string().trim().min(1).max(255),
  accountType: z.enum(['profile', 'page', 'channel', 'business']),
  isSelected: z.boolean().default(false),
});

export const OAuthAuthorizationStateSchema = MarketingScopedRecordSchema.extend({
  provider: SocialProviderSchema,
  stateHash: z.string().regex(/^[a-f0-9]{64}$/),
  expiresAt: MarketingTimestampSchema,
  consumedAt: MarketingTimestampSchema.nullable().optional(),
});

export const IntegrationSyncRunSchema = MarketingScopedRecordSchema.extend({
  socialConnectionId: MarketingIdSchema,
  operation: z.enum(['authorize', 'refresh', 'import_metrics', 'publish']),
  status: z.enum(['queued', 'running', 'completed', 'failed']),
  startedAt: MarketingTimestampSchema.nullable().optional(),
  finishedAt: MarketingTimestampSchema.nullable().optional(),
  errorCode: z.string().trim().max(100).nullable().optional(),
});
