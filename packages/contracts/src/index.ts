// Export Brands Module
export * from './brands/brand';

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
