import { describe, expect, it } from 'vitest';
import { BrandContextSnapshotSchema } from '../context';

describe('BrandContextSnapshotSchema', () => {
  it('accepts a published context for downstream marketing modules', () => {
    const now = '2026-08-08T00:00:00.000Z';
    const result = BrandContextSnapshotSchema.safeParse({
      organizationId: '00000000-0000-4000-9000-000000000001',
      brand: {
        id: '00000000-0000-4000-9200-000000000001',
        organizationId: '00000000-0000-4000-9000-000000000001',
        name: 'VitaBlue',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
      version: { id: null, number: null, status: 'published', publishedAt: now },
      assets: [],
      approvedClaims: ['Cuidado cercano'],
      forbiddenClaims: [],
      rules: { evaluatedAt: now },
      generatedAt: now,
    });

    expect(result.success).toBe(true);
  });

  it('rejects a context whose brand belongs to another organization', () => {
    const now = '2026-08-08T00:00:00.000Z';
    const result = BrandContextSnapshotSchema.safeParse({
      organizationId: '00000000-0000-4000-9000-000000000001',
      brand: {
        id: '00000000-0000-4000-9200-000000000001',
        organizationId: '00000000-0000-4000-9000-000000000002',
        name: 'Other brand',
        status: 'published',
        createdAt: now,
        updatedAt: now,
      },
      version: { id: null, number: null, status: 'published', publishedAt: now },
      rules: { evaluatedAt: null },
      generatedAt: now,
    });

    expect(result.success).toBe(false);
  });
});
