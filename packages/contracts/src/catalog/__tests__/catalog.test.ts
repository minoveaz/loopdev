import { describe, expect, it } from 'vitest';
import { CatalogCreateProductCommandSchema, CatalogOpportunityProductSchema, CatalogPriceBookSchema, CatalogPriceEntrySchema, CatalogProductSchema } from '../catalog';

const ids = { id: '00000000-0000-4000-9000-000000000001', organizationId: '00000000-0000-4000-9000-000000000002', opportunityId: '00000000-0000-4000-9000-000000000003', productId: '00000000-0000-4000-9000-000000000004', priceBookId: '00000000-0000-4000-9000-000000000005' };
const timestamp = '2026-08-09T00:00:00.000Z';

describe('Product Catalog contracts', () => {
  it('models generic products and services independently from CRM', () => {
    expect(CatalogProductSchema.safeParse({ ...ids, sku: 'HEALTH-001', name: 'Health Plan', type: 'plan', status: 'active', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(CatalogCreateProductCommandSchema.safeParse({ organizationId: ids.organizationId, sku: 'CONSULT-001', name: 'Consulting', type: 'service' }).success).toBe(true);
  });

  it('models price books and opportunity product links', () => {
    expect(CatalogPriceBookSchema.safeParse({ id: ids.priceBookId, organizationId: ids.organizationId, name: 'Standard', currency: 'EUR', status: 'active', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(CatalogPriceEntrySchema.safeParse({ id: ids.id, organizationId: ids.organizationId, priceBookId: ids.priceBookId, productId: ids.productId, unitPrice: 100, currency: 'EUR', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(CatalogOpportunityProductSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, opportunityId: ids.opportunityId, productId: ids.productId, quantity: 1, createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });
});
