import { describe, expect, it } from 'vitest';
import {
  PublicAnalyticsConfigSchema,
  PublicAnalyticsEventSchema,
  PublicConsentModeSettingsSchema,
} from '../telemetry';

describe('Public Telemetry & Analytics Contracts', () => {
  it('validates a complete analytics config with GA4 and Google Ads', () => {
    const config = {
      googleAnalyticsId: 'G-DCGH16NP2Q',
      googleAdsId: 'AW-515585712',
      gtmId: 'GTM-ABC1234',
      consentModeEnabled: true,
    };

    expect(PublicAnalyticsConfigSchema.safeParse(config).success).toBe(true);
  });

  it('rejects malformed GA4 or Google Ads IDs', () => {
    const invalidGa4 = { googleAnalyticsId: 'UA-123456-1' };
    expect(PublicAnalyticsConfigSchema.safeParse(invalidGa4).success).toBe(false);

    const invalidAds = { googleAdsId: '123456789' };
    expect(PublicAnalyticsConfigSchema.safeParse(invalidAds).success).toBe(false);
  });

  it('validates Google Consent Mode v2 settings', () => {
    const consentSettings = {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      functionality_storage: 'granted',
      security_storage: 'granted',
    };

    expect(PublicConsentModeSettingsSchema.safeParse(consentSettings).success).toBe(true);
  });

  it('validates a conversion tracking event with Google Ads conversionLabel', () => {
    const event = {
      eventName: 'join_crew_success',
      category: 'community_activity',
      label: 'Running 8K Retiro',
      value: 1,
      currency: 'EUR',
      conversionLabel: 'AbCdEfGhIjK_123',
      metadata: {
        sport: 'running',
        activityId: 'act_1',
      },
    };

    expect(PublicAnalyticsEventSchema.safeParse(event).success).toBe(true);
  });
});
