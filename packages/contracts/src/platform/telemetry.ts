import { z } from 'zod';

// --- 1. Configuración de Proveedores de Analytics ---
export const PublicAnalyticsConfigSchema = z.object({
  googleAnalyticsId: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, 'Must be a valid GA4 measurement ID (e.g. G-XXXXXXXXXX)')
    .optional(),
  googleAdsId: z
    .string()
    .regex(/^AW-[0-9]+$/, 'Must be a valid Google Ads conversion ID (e.g. AW-XXXXXXXXXX)')
    .optional(),
  gtmId: z
    .string()
    .regex(/^GTM-[A-Z0-9]+$/, 'Must be a valid GTM container ID (e.g. GTM-XXXXXXXX)')
    .optional(),
  metaPixelId: z.string().optional(),
  consentModeEnabled: z.boolean().default(true),
});

export type PublicAnalyticsConfig = z.infer<typeof PublicAnalyticsConfigSchema>;

// --- 2. Google Consent Mode v2 ---
export const PublicConsentStatusSchema = z.enum(['granted', 'denied']);
export type PublicConsentStatus = z.infer<typeof PublicConsentStatusSchema>;

export const PublicConsentModeSettingsSchema = z.object({
  ad_storage: PublicConsentStatusSchema.default('denied'),
  analytics_storage: PublicConsentStatusSchema.default('denied'),
  ad_user_data: PublicConsentStatusSchema.default('denied'),
  ad_personalization: PublicConsentStatusSchema.default('denied'),
  functionality_storage: PublicConsentStatusSchema.default('granted'),
  security_storage: PublicConsentStatusSchema.default('granted'),
});

export type PublicConsentModeSettings = z.infer<typeof PublicConsentModeSettingsSchema>;

// --- 3. Eventos de Conversión y Telemetría Estructurada ---
export const PublicAnalyticsEventCategorySchema = z.enum([
  'engagement',
  'lead_generation',
  'community_activity',
  'auth',
  'navigation',
  'conversion',
]);

export type PublicAnalyticsEventCategory = z.infer<typeof PublicAnalyticsEventCategorySchema>;

export const PublicAnalyticsEventSchema = z.object({
  eventName: z.string().min(1),
  category: PublicAnalyticsEventCategorySchema.default('engagement'),
  label: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().default('EUR'),
  conversionLabel: z.string().optional(), // Para conversiones directas de Google Ads
  metadata: z.record(z.unknown()).optional(),
  timestamp: z.number().int().optional(),
});

export type PublicAnalyticsEvent = z.infer<typeof PublicAnalyticsEventSchema>;
