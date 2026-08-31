// Export Brands Module
export * from './brands/brand';
export * from './brands/typography.schema';
export * from './brands/logo.schema';
export * from './brands/rules.schema';
export * from './brands/context';
export * from './brands/version';

// Export Platform Navigation Contracts
export * from './platform/navigation';
export * from './platform/shell';
export * from './platform/tenancy';
export * from './platform/home';
export * from './platform/composition';
export * from './platform/composition-registry';
export * from './platform/composition-layout';
export * from './platform/public-shell';
export * from './platform/seo';
export * from './platform/telemetry';
export * from './platform/deepLinking';


// Export CRM contracts
export * from './crm/crm';
export * from './crm/customer-workspace';
export * from './crm/tasks';
export * from './crm/customer-360';
export * from './communications/communications';
export * from './communications/inbox';
export * from './documents/documents';
export * from './ai/assistant';
export * from './catalog/catalog';

// Export Marketing contracts
export * from './marketing/marketing';
export * from './marketing/content';
export * from './marketing/asset';
export * from './marketing/creative';
export * from './marketing/creative-assets';

// Export insurance and operations contracts
export * from './insurance/insurance';

// Export Trading/Quant Contracts
export * from './trading/trading.schema';

// Common API Schemas (Basados en API_STANDARDS.md)
import { z } from 'zod';

export const ApiMetaSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  totalPages: z.number().optional(),
  traceId: z.string().optional(),
});

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: ApiMetaSchema.optional(),
  });

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
    traceId: z.string(),
  }),
});
