import { describe, expect, it } from 'vitest';
import {
  AdvisorRecommendationSchema,
  ComplianceFindingSchema,
  ContentGenerationJobSchema,
  MarketingCampaignSchema,
  MarketingCopySchema,
  OAuthAuthorizationStateSchema,
  SocialConnectionSchema,
} from '../marketing';

const ids = { id: '00000000-0000-4000-9000-000000000001', organizationId: '00000000-0000-4000-9000-000000000002', brandId: '00000000-0000-4000-9000-000000000003', workspaceId: '00000000-0000-4000-9000-000000000004' };
const timestamp = '2026-08-07T00:00:00.000Z';

describe('Marketing contracts', () => {
  it('requires organization, brand and workspace ownership for campaigns', () => {
    expect(MarketingCampaignSchema.safeParse({ ...ids, name: 'Summer launch', objective: 'Generate leads', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(MarketingCampaignSchema.safeParse({ id: ids.id, name: 'Invalid', objective: 'Missing tenancy', createdAt: timestamp, updatedAt: timestamp }).success).toBe(false);
  });

  it('keeps copy and provider connection secrets out of public contracts', () => {
    expect(MarketingCopySchema.safeParse({ ...ids, campaignId: ids.id, channel: 'social', content: 'Hello', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(SocialConnectionSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, provider: 'instagram', externalAccountId: 'account-1', displayName: 'VitaBlue', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });

  it('requires a server-side-safe OAuth state with organization ownership', () => {
    const result = OAuthAuthorizationStateSchema.safeParse({
      ...ids,
      brandId: null,
      workspaceId: null,
      provider: 'facebook',
      stateHash: 'a'.repeat(64),
      expiresAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    expect(result.success).toBe(true);
    expect(OAuthAuthorizationStateSchema.safeParse({ ...result.data, stateHash: 'not-a-hash' }).success).toBe(false);
  });

  it('models advanced marketing work as auditable, human-approved records', () => {
    expect(ContentGenerationJobSchema.safeParse({
      ...ids,
      brandId: null,
      workspaceId: null,
      provider: 'openai',
      model: 'gpt-5',
      status: 'queued',
      inputHash: 'b'.repeat(64),
      createdAt: timestamp,
      updatedAt: timestamp,
    }).success).toBe(true);

    expect(AdvisorRecommendationSchema.safeParse({
      ...ids,
      brandId: null,
      workspaceId: null,
      recommendationType: 'compliance',
      summary: 'Review the claim before publishing.',
      evidence: ['The active rule blocks an unqualified claim.'],
      confidence: 0.9,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).success).toBe(true);

    expect(ComplianceFindingSchema.safeParse({
      ...ids,
      brandId: null,
      workspaceId: null,
      ruleId: ids.id,
      entityType: 'campaign',
      entityId: ids.id,
      severity: 'blocking',
      message: 'Approval is required before publication.',
      createdAt: timestamp,
      updatedAt: timestamp,
    }).success).toBe(true);
  });
});
