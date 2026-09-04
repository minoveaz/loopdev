import type {
  PublicAnalyticsConfig,
  PublicAnalyticsEvent,
  PublicConsentModeSettings,
} from '@loopdev/contracts';
import type { ReactNode } from 'react';

export interface AnalyticsContextValue {
  config: PublicAnalyticsConfig;
  trackEvent: (event: PublicAnalyticsEvent) => void;
  updateConsent: (consent: Partial<PublicConsentModeSettings>) => void;
  consentSettings: PublicConsentModeSettings;
}

export interface PublicAnalyticsProviderProps {
  config: PublicAnalyticsConfig;
  initialConsent?: Partial<PublicConsentModeSettings>;
  children: ReactNode;
}
