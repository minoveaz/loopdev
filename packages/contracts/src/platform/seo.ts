import { z } from 'zod';

// --- 1. Schemas de Datos Estructurados JSON-LD (Schema.org) ---
export const PublicOrganizationSchema = z.object({
  '@type': z.literal('Organization'),
  name: z.string().min(1),
  url: z.string().url(),
  logo: z.string().url().optional(),
  contactPoint: z
    .object({
      telephone: z.string().optional(),
      contactType: z.string().default('customer service'),
      areaServed: z.string().optional(),
      availableLanguage: z.array(z.string()).optional(),
    })
    .optional(),
  sameAs: z.array(z.string().url()).optional(),
});

export const PublicWebSiteSchema = z.object({
  '@type': z.literal('WebSite'),
  name: z.string().min(1),
  url: z.string().url(),
  potentialAction: z
    .object({
      '@type': z.literal('SearchAction'),
      target: z.string(),
      'query-input': z.string(),
    })
    .optional(),
});

export const PublicSportsEventSchema = z.object({
  '@type': z.literal('SportsEvent'),
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.object({
    '@type': z.literal('Place'),
    name: z.string().min(1),
    address: z.string().optional(),
  }),
  organizer: z
    .object({
      '@type': z.enum(['Person', 'Organization']),
      name: z.string().min(1),
    })
    .optional(),
  eventStatus: z.string().default('https://schema.org/EventScheduled'),
  eventAttendanceMode: z.string().default('https://schema.org/OfflineEventAttendanceMode'),
});

export const PublicProductSchema = z.object({
  '@type': z.literal('Product'),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url().optional(),
  brand: z
    .object({
      '@type': z.literal('Brand'),
      name: z.string().min(1),
    })
    .optional(),
  offers: z
    .object({
      '@type': z.literal('Offer'),
      price: z.string().or(z.number()),
      priceCurrency: z.string().default('EUR'),
      availability: z.string().default('https://schema.org/InStock'),
    })
    .optional(),
});

export const PublicFaqPageSchema = z.object({
  '@type': z.literal('FAQPage'),
  mainEntity: z.array(
    z.object({
      '@type': z.literal('Question'),
      name: z.string().min(1),
      acceptedAnswer: z.object({
        '@type': z.literal('Answer'),
        text: z.string().min(1),
      }),
    }),
  ),
});

export const PublicBreadcrumbListSchema = z.object({
  '@type': z.literal('BreadcrumbList'),
  itemListElement: z.array(
    z.object({
      '@type': z.literal('ListItem'),
      position: z.number().int().positive(),
      name: z.string().min(1),
      item: z.string().url(),
    }),
  ),
});

export const PublicJsonLdSchema = z.union([
  PublicOrganizationSchema,
  PublicWebSiteSchema,
  PublicSportsEventSchema,
  PublicProductSchema,
  PublicFaqPageSchema,
  PublicBreadcrumbListSchema,
]);

export type PublicJsonLd = z.infer<typeof PublicJsonLdSchema>;

// --- 2. Metadatos Open Graph y Twitter Cards ---
export const PublicOpenGraphSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url().optional(),
  image: z.string().url(),
  type: z.enum(['website', 'article', 'profile']).default('website'),
  siteName: z.string().optional(),
  locale: z.string().default('es_ES'),
});

export type PublicOpenGraph = z.infer<typeof PublicOpenGraphSchema>;

export const PublicTwitterCardSchema = z.object({
  card: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
  site: z.string().optional(),
  creator: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export type PublicTwitterCard = z.infer<typeof PublicTwitterCardSchema>;

// --- 3. Metadatos SEO Canónicos ---
export const PublicSeoMetadataSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 chars')
    .max(80, 'Title should not exceed 80 chars'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 chars')
    .max(200, 'Description should not exceed 200 chars'),
  canonicalUrl: z.string().url().optional(),
  hreflang: z.record(z.string()).optional(), // e.g. { es: '/...', en: '/en/...' }
  openGraph: PublicOpenGraphSchema,
  twitter: PublicTwitterCardSchema.optional(),
  jsonLd: z.array(PublicJsonLdSchema).optional(),
  indexable: z.boolean().default(true),
  keywords: z.array(z.string()).optional(),
});

export type PublicSeoMetadata = z.infer<typeof PublicSeoMetadataSchema>;

// --- 4. Registro de Rutas para Sitemaps e Indexación ---
export const PublicRouteKindSchema = z.enum(['canonical', 'legacy', 'dynamic', 'private']);
export type PublicRouteKind = z.infer<typeof PublicRouteKindSchema>;

export const PublicRouteDefinitionSchema = z.object({
  path: z.string().min(1),
  kind: PublicRouteKindSchema.default('canonical'),
  locale: z.enum(['es', 'en', 'neutral']).default('es'),
  canonical: z.string().optional(),
  alternate: z.string().optional(),
  indexable: z.boolean().default(true),
  sitemap: z.boolean().default(true),
  changefreq: z
    .enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    .default('weekly'),
  priority: z.number().min(0).max(1).default(0.8),
  redirectTo: z.string().optional(),
});

export type PublicRouteDefinition = z.infer<typeof PublicRouteDefinitionSchema>;

export const PublicRouteRegistrySchema = z.array(PublicRouteDefinitionSchema);
export type PublicRouteRegistry = z.infer<typeof PublicRouteRegistrySchema>;
