import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const CatalogProductTypeSchema = z.enum(['product', 'service', 'plan', 'subscription', 'bundle']);
export const CatalogProductStatusSchema = z.enum(['draft', 'active', 'archived']);
export const CatalogPriceBookStatusSchema = z.enum(['draft', 'active', 'archived']);

export const CatalogProductSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  providerId: IdSchema.nullable().optional(),
  parentProductId: IdSchema.nullable().optional(),
  sku: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(10_000).nullable().optional(),
  type: CatalogProductTypeSchema,
  status: CatalogProductStatusSchema,
  category: z.string().trim().max(120).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CatalogProduct = z.infer<typeof CatalogProductSchema>;

export const CatalogPriceBookSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  name: z.string().trim().min(1).max(160),
  currency: z.string().regex(/^[A-Z]{3}$/),
  segment: z.string().trim().max(120).nullable().optional(),
  status: CatalogPriceBookStatusSchema,
  validFrom: TimestampSchema.nullable().optional(),
  validUntil: TimestampSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CatalogPriceBook = z.infer<typeof CatalogPriceBookSchema>;

export const CatalogPriceEntrySchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  priceBookId: IdSchema,
  productId: IdSchema,
  unitPrice: z.number().nonnegative(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  billingPeriod: z.enum(['one_time', 'monthly', 'quarterly', 'annual']).default('one_time'),
  minQuantity: z.number().int().positive().default(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CatalogPriceEntry = z.infer<typeof CatalogPriceEntrySchema>;

export const CatalogOpportunityProductSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  opportunityId: IdSchema,
  productId: IdSchema,
  priceEntryId: IdSchema.nullable().optional(),
  quoteId: IdSchema.nullable().optional(),
  quantity: z.number().positive().default(1),
  unitPrice: z.number().nonnegative().nullable().optional(),
  totalPrice: z.number().nonnegative().nullable().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CatalogOpportunityProduct = z.infer<typeof CatalogOpportunityProductSchema>;

export const CatalogCreateProductCommandSchema = z.object({
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  providerId: IdSchema.nullable().optional(),
  sku: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(10_000).nullable().optional(),
  type: CatalogProductTypeSchema,
  category: z.string().trim().max(120).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export type CatalogCreateProductCommand = z.infer<typeof CatalogCreateProductCommandSchema>;
