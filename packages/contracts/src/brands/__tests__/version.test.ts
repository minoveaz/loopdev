import { describe, expect, it } from 'vitest';
import { BrandContextVersionSchema } from '../version';

describe('BrandContextVersionSchema', () => {
  it('accepts a published version with an immutable snapshot', () => {
    const result = BrandContextVersionSchema.safeParse({
      id: '00000000-0000-4000-9500-000000000001',
      organizationId: '00000000-0000-4000-9000-000000000001',
      brandId: '00000000-0000-4000-9200-000000000001',
      versionNumber: 1,
      status: 'published',
      snapshot: { brand: { name: 'VitaBlue' } },
      publishedAt: '2026-08-08T00:00:00.000Z',
      createdAt: '2026-08-08T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-positive version numbers', () => {
    const result = BrandContextVersionSchema.safeParse({
      id: '00000000-0000-4000-9500-000000000001',
      organizationId: '00000000-0000-4000-9000-000000000001',
      brandId: '00000000-0000-4000-9200-000000000001',
      versionNumber: 0,
      status: 'draft',
      snapshot: {},
      createdAt: '2026-08-08T00:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });
});
