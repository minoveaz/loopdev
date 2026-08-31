import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import type { PublicSeoMetadata } from '@loopdev/contracts';
import { PublicSeoHead } from '../seo/PublicSeoHead';
import { PublicAnalyticsProvider } from '../analytics/PublicAnalyticsProvider';
import { usePublicAnalytics } from '../analytics/usePublicAnalytics';

const testSeo: PublicSeoMetadata = {
  title: 'Running 8K Madrid Retiro',
  description: 'Únete a nuestro crew de running para entrenar en el Retiro todos los viernes.',
  canonicalUrl: 'https://cimo.app/running-retiro',
  openGraph: {
    title: 'Running 8K Madrid Retiro - CIMO',
    description: 'Únete a nuestro crew de running en Madrid.',
    image: 'https://cimo.app/og.jpg',
    type: 'website',
  },
  jsonLd: [
    {
      '@type': 'SportsEvent',
      name: 'Running 8K Retiro',
      startDate: '2026-08-28T19:30:00Z',
      location: { '@type': 'Place', name: 'Parque del Retiro' },
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    },
  ],
};

const TestAnalyticsConsumer = () => {
  const { trackEvent, updateConsent, consentSettings } = usePublicAnalytics();
  return (
    <div>
      <span data-testid="ad-consent">{consentSettings.ad_storage}</span>
      <button
        onClick={() => {
          updateConsent({ ad_storage: 'granted' });
          trackEvent({
            eventName: 'test_conversion',
            category: 'conversion',
            conversionLabel: 'AW_CONV_123',
          });
        }}
      >
        Trigger Conversion
      </button>
    </div>
  );
};

describe('PublicSeoHead and PublicAnalyticsProvider', () => {
  it('updates document.title and structured JSON-LD scripts', () => {
    render(<PublicSeoHead seo={testSeo} />);
    expect(document.title).toBe('Running 8K Madrid Retiro');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink?.getAttribute('href')).toBe('https://cimo.app/running-retiro');
  });

  it('provides analytics tracking and Google Consent Mode updates', () => {
    render(
      <PublicAnalyticsProvider
        config={{
          googleAnalyticsId: 'G-DCGH16NP2Q',
          googleAdsId: 'AW-515585712',
          consentModeEnabled: true,
        }}
      >
        <TestAnalyticsConsumer />
      </PublicAnalyticsProvider>,
    );

    expect(screen.getByTestId('ad-consent').textContent).toBe('denied');

    act(() => {
      screen.getByRole('button').click();
    });

    expect(screen.getByTestId('ad-consent').textContent).toBe('granted');
  });
});
