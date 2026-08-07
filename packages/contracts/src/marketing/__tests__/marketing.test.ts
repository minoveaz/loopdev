import { describe, expect, it } from 'vitest';
import { MarketingCampaignSchema, MarketingCopySchema, SocialConnectionSchema } from '../marketing';

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
});
