import { describe, expect, it } from 'vitest';
import { EligibilityResultSchema, QuoteSchema, PolicySchema } from '../insurance';

const ids = { id: '00000000-0000-4000-9000-000000000001', organizationId: '00000000-0000-4000-9000-000000000002', leadId: '00000000-0000-4000-9000-000000000003', productId: '00000000-0000-4000-9000-000000000004' };
const timestamp = '2026-08-07T00:00:00.000Z';

describe('Insurance contracts', () => {
  it('keeps quotes versioned and organization-scoped', () => {
    expect(QuoteSchema.safeParse({ ...ids, version: 1, createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
    expect(QuoteSchema.safeParse({ id: ids.id, leadId: ids.leadId, productId: ids.productId, version: 1, createdAt: timestamp, updatedAt: timestamp }).success).toBe(false);
  });

  it('models eligibility and policy lifecycle explicitly', () => {
    expect(EligibilityResultSchema.parse({ productId: ids.productId, outcome: 'manual_review', evaluatedAt: timestamp }).reasons).toEqual([]);
    expect(PolicySchema.safeParse({ ...ids, policyNumber: 'POL-001', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });
});
