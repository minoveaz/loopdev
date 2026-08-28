import { describe, expect, it } from 'vitest';
import {
  CreativeDocumentSchema,
  MarketingCreativeAssetSchema,
  MarketingCreativeAssetReferenceSchema,
} from '../creative-assets';

const ids = {
  organizationId: '00000000-0000-4000-9000-000000000001',
  brandId: '00000000-0000-4000-9000-000000000002',
  workspaceId: '00000000-0000-4000-9000-000000000003',
  projectId: '00000000-0000-4000-9000-000000000004',
  assetId: '00000000-0000-4000-9000-000000000005',
  sourceAssetId: '00000000-0000-4000-9000-000000000008',
  versionId: '00000000-0000-4000-9000-000000000006',
};

const baseAsset = {
  id: ids.assetId,
  organizationId: ids.organizationId,
  brandId: ids.brandId,
  workspaceId: ids.workspaceId,
  projectId: ids.projectId,
  kind: 'source' as const,
  storagePath: `org/${ids.organizationId}/workspace/${ids.workspaceId}/source/${'a'.repeat(64)}.png`,
  mimeType: 'image/png',
  sizeBytes: 1_024,
  contentHash: 'a'.repeat(64),
  createdAt: '2026-08-27T00:00:00.000Z',
  updatedAt: '2026-08-27T00:00:00.000Z',
};

describe('Creative Studio asset contracts', () => {
  it('rejects inline base64 and data URLs in documents', () => {
    expect(CreativeDocumentSchema.safeParse({ image: `data:image/png;base64,${'a'.repeat(300)}` }).success).toBe(false);
    expect(CreativeDocumentSchema.safeParse({ image: 'storage://creative/hero.png' }).success).toBe(true);
  });

  it('requires compressed thumbnails to point to a source asset', () => {
    expect(MarketingCreativeAssetSchema.safeParse({
      ...baseAsset,
      kind: 'thumbnail',
      compressed: true,
      sourceAssetId: ids.sourceAssetId,
      sizeBytes: 10_000,
    }).success).toBe(true);
    expect(MarketingCreativeAssetSchema.safeParse({
      ...baseAsset,
      kind: 'thumbnail',
      compressed: false,
    }).success).toBe(false);
  });

  it('requires references to identify their owning layer or variant', () => {
    expect(MarketingCreativeAssetReferenceSchema.safeParse({
      id: ids.assetId,
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      assetId: ids.assetId,
      projectId: ids.projectId,
      projectVersionId: ids.versionId,
      layerId: '00000000-0000-4000-9000-000000000007',
      referenceType: 'layer',
      createdAt: '2026-08-27T00:00:00.000Z',
      updatedAt: '2026-08-27T00:00:00.000Z',
    }).success).toBe(true);
    expect(MarketingCreativeAssetReferenceSchema.safeParse({
      id: ids.assetId,
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      assetId: ids.assetId,
      projectId: ids.projectId,
      referenceType: 'variant',
      createdAt: '2026-08-27T00:00:00.000Z',
      updatedAt: '2026-08-27T00:00:00.000Z',
    }).success).toBe(false);
  });
});
