'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { PublicAnalyticsEvent, PublicConsentModeSettings } from '@loopdev/contracts';
import type { AnalyticsContextValue, PublicAnalyticsProviderProps } from './types';

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
  }
}

const defaultConsent: PublicConsentModeSettings = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
};

export const PublicAnalyticsProvider: React.FC<PublicAnalyticsProviderProps> = ({
  config,
  initialConsent,
  children,
}) => {
  const [consentSettings, setConsentSettings] = useState<PublicConsentModeSettings>({
    ...defaultConsent,
    ...initialConsent,
  });

  // Initialize dataLayer and gtag
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;

    if (config.consentModeEnabled) {
      gtag('consent', 'default', {
        ad_storage: consentSettings.ad_storage,
        analytics_storage: consentSettings.analytics_storage,
        ad_user_data: consentSettings.ad_user_data,
        ad_personalization: consentSettings.ad_personalization,
        functionality_storage: consentSettings.functionality_storage,
        security_storage: consentSettings.security_storage,
      });
    }

    gtag('js', new Date());

    if (config.googleAnalyticsId) {
      gtag('config', config.googleAnalyticsId, { send_page_view: true });
    }

    if (config.googleAdsId) {
      gtag('config', config.googleAdsId);
    }
  }, [config, consentSettings]);

  const updateConsent = useCallback((newConsent: Partial<PublicConsentModeSettings>) => {
    setConsentSettings((prev) => {
      const updated = { ...prev, ...newConsent };
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', updated);
      }
      return updated;
    });
  }, []);

  const trackEvent = useCallback(
    (event: PublicAnalyticsEvent) => {
      if (typeof window === 'undefined') return;

      const payload: Record<string, unknown> = {
        event: event.eventName,
        category: event.category,
        label: event.label,
        value: event.value,
        currency: event.currency,
        ...(event.metadata ?? {}),
      };

      if (event.conversionLabel && config.googleAdsId) {
        payload.send_to = `${config.googleAdsId}/${event.conversionLabel}`;
      }

      if (window.gtag) {
        window.gtag('event', event.eventName, payload);
      } else if (window.dataLayer) {
        window.dataLayer.push(payload);
      }
    },
    [config.googleAdsId],
  );

  return (
    <AnalyticsContext.Provider value={{ config, trackEvent, updateConsent, consentSettings }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
