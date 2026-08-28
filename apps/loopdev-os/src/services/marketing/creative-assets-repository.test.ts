import { describe, expect, it } from 'vitest';
import type { MarketingAccessGrant } from '@loopdev/contracts';
import {
  InMemoryCreativeAssetRepository,
  sha256Hex,
} from './creative-assets-repository';

const ids = {
  userId: '00000000-0000-4000-9000-000000000001',
  organizationId: '00000000-0000-4000-9000-000000000002',
  brandId: '00000000-0000-4000-9000-000000000003',
  workspaceId: '00000000-0000-4000-9000-000000000004',
  projectId: '00000000-0000-4000-9000-000000000005',
};
const timestamp = '2026-08-27T00:00:00.000Z';
const grant: MarketingAccessGrant = {
  userId: ids.userId,
  organizationId: ids.organizationId,
  brandId: ids.brandId,
  workspaceId: ids.workspaceId,
  permission: 'edit',
  grantedBy: ids.userId,
  createdAt: timestamp,
  updatedAt: timestamp,
};
const readGrant: MarketingAccessGrant = { ...grant, permission: 'read' };
const context = { ...ids, grants: [grant, readGrant] };

describe('InMemoryCreativeAssetRepository', () => {
  it('hashes content, deduplicates active assets, and reports usage', async () => {
    const repository = new InMemoryCreativeAssetRepository();
    const content = new TextEncoder().encode('creative-source');
    const contentHash = sha256Hex(content);
    const input = {
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      projectId: ids.projectId,
      kind: 'source' as const,
      storagePath: `org/${ids.organizationId}/workspace/${ids.workspaceId}/source/${contentHash}.txt`,
      mimeType: 'text/plain',
      sizeBytes: content.byteLength,
      contentHash,
    };

    const first = await repository.createAsset(context, input, content);
    const duplicate = await repository.createAsset(context, input, content);

    expect(duplicate.id).toBe(first.id);
    expect(await repository.listAssets(context, ids.projectId)).toHaveLength(1);
    await expect(repository.getUsage(context)).resolves.toMatchObject({
      usedBytes: content.byteLength,
      assetCount: 1,
      indexedDbIsCacheOnly: true,
    });
  });

  it('rejects content metadata mismatches and cross-tenant writes', async () => {
    const repository = new InMemoryCreativeAssetRepository();
    const content = new TextEncoder().encode('creative-source');
    const input = {
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      kind: 'source' as const,
      storagePath: `org/${ids.organizationId}/workspace/${ids.workspaceId}/source/${'b'.repeat(64)}.txt`,
      mimeType: 'text/plain',
      sizeBytes: content.byteLength,
      contentHash: 'b'.repeat(64),
    };

    await expect(repository.createAsset(context, input, content)).rejects.toThrow(
      'metadata does not match',
    );
    await expect(repository.createAsset({
      ...context,
      workspaceId: '00000000-0000-4000-9000-000000000006',
    }, input, content)).rejects.toThrow('Marketing access denied');
  });

  it('keeps referenced assets during safe cleanup and removes expired exports', async () => {
    const repository = new InMemoryCreativeAssetRepository();
    const content = new TextEncoder().encode('creative-export');
    const contentHash = sha256Hex(content);
    const exportAsset = await repository.createAsset(context, {
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      kind: 'export',
      storagePath: `org/${ids.organizationId}/workspace/${ids.workspaceId}/export/${contentHash}.png`,
      mimeType: 'image/png',
      sizeBytes: content.byteLength,
      contentHash,
      expiresAt: '2026-08-26T00:00:00.000Z',
    }, content);
    const removed = await repository.cleanup(context, new Date(timestamp));
    expect(removed).toEqual([exportAsset.id]);
    expect(await repository.listAssets(context)).toHaveLength(0);
  });

  it('enforces the workspace quota before persisting an asset', async () => {
    const repository = new InMemoryCreativeAssetRepository({
      quotas: [{ organizationId: ids.organizationId, workspaceId: ids.workspaceId, quotaBytes: 1 }],
    });
    const content = new TextEncoder().encode('too-large-for-quota');
    const contentHash = sha256Hex(content);

    await expect(repository.createAsset(context, {
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      kind: 'source',
      storagePath: `org/${ids.organizationId}/workspace/${ids.workspaceId}/source/${contentHash}.txt`,
      mimeType: 'text/plain',
      sizeBytes: content.byteLength,
      contentHash,
    }, content)).rejects.toThrow('storage quota exceeded');
  });
});
