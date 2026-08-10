import { describe, expect, it } from 'vitest';
import type { CreateMarketingCampaignInput, MarketingAccessGrant, MarketingAsset, MarketingAssetVariant, MarketingCampaign } from '@loopdev/contracts';
import { InMemoryMarketingRepository, MarketingAccessDeniedError } from './repository';
import { marketingFixtureAssets, marketingFixtureBrandSnapshots, marketingFixtureConnections, marketingFixtureIds } from './fixtures/marketing-data';

const ids = {
  userId: '00000000-0000-4000-9000-000000000001',
  organizationId: '00000000-0000-4000-9000-000000000002',
  brandId: '00000000-0000-4000-9000-000000000003',
  workspaceId: '00000000-0000-4000-9000-000000000004',
  otherOrganizationId: '00000000-0000-4000-9000-000000000005',
  otherBrandId: '00000000-0000-4000-9000-000000000006',
  otherWorkspaceId: '00000000-0000-4000-9000-000000000007',
};
const timestamp = '2026-08-10T00:00:00.000Z';

const grant: MarketingAccessGrant = {
  userId: ids.userId,
  organizationId: ids.organizationId,
  permission: 'read',
  grantedBy: ids.userId,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const editableGrant: MarketingAccessGrant = { ...grant, permission: 'edit' };

const campaign = (organizationId: string, brandId: string, workspaceId: string, id: string): MarketingCampaign => ({
  id,
  organizationId,
  brandId,
  workspaceId,
  name: 'Launch',
  objective: 'Generate leads',
  status: 'draft',
  currency: 'EUR',
  createdAt: timestamp,
  updatedAt: timestamp,
});

const input: CreateMarketingCampaignInput = {
  organizationId: ids.organizationId,
  brandId: ids.brandId,
  workspaceId: ids.workspaceId,
  name: 'New launch',
  objective: 'Generate leads',
};

describe('InMemoryMarketingRepository', () => {
  it('lists only campaigns in the authorized organization, brand and workspace', async () => {
    const repository = new InMemoryMarketingRepository([
      campaign(ids.organizationId, ids.brandId, ids.workspaceId, '00000000-0000-4000-9000-000000000010'),
      campaign(ids.organizationId, ids.otherBrandId, ids.workspaceId, '00000000-0000-4000-9000-000000000011'),
      campaign(ids.otherOrganizationId, ids.brandId, ids.workspaceId, '00000000-0000-4000-9000-000000000012'),
    ]);

    const result = await repository.listCampaigns({ ...ids, grants: [grant] });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('00000000-0000-4000-9000-000000000010');
  });

  it('rejects reads and writes without the corresponding grant', async () => {
    const repository = new InMemoryMarketingRepository();
    const context = { ...ids, grants: [grant] };

    await expect(repository.listCampaigns(context)).resolves.toEqual([]);
    await expect(repository.createCampaign(context, input)).rejects.toBeInstanceOf(MarketingAccessDeniedError);
  });

  it('creates a campaign only inside the context scope', async () => {
    const repository = new InMemoryMarketingRepository();
    const context = { ...ids, grants: [editableGrant] };

    const created = await repository.createCampaign(context, input);
    expect(created.organizationId).toBe(ids.organizationId);
    expect(created.brandId).toBe(ids.brandId);
    expect(created.workspaceId).toBe(ids.workspaceId);
    await expect(repository.createCampaign(context, { ...input, workspaceId: ids.otherWorkspaceId })).rejects.toBeInstanceOf(MarketingAccessDeniedError);
  });

  it('updates an authorized campaign and rejects cross-scope mutations', async () => {
    const campaignId = '00000000-0000-4000-9000-000000000020';
    const repository = new InMemoryMarketingRepository({
      campaigns: [campaign(ids.organizationId, ids.brandId, ids.workspaceId, campaignId)],
    });
    const context = { ...ids, grants: [editableGrant] };

    const updated = await repository.updateCampaign(context, {
      organizationId: ids.organizationId,
      workspaceId: ids.workspaceId,
      campaignId,
      name: 'Updated launch',
    });
    expect(updated.name).toBe('Updated launch');
    expect(updated.updatedBy).toBe(ids.userId);

    await expect(repository.updateCampaign(context, {
      organizationId: ids.organizationId,
      workspaceId: ids.otherWorkspaceId,
      campaignId,
      name: 'Cross-scope update',
    })).rejects.toBeInstanceOf(MarketingAccessDeniedError);
  });

  it('reads Brand Hub, assets and connections only for the authorized brand', async () => {
    const repository = new InMemoryMarketingRepository({
      brandSnapshots: marketingFixtureBrandSnapshots,
      assets: marketingFixtureAssets,
      connections: marketingFixtureConnections,
    });
    const context = {
      userId: ids.userId,
      organizationId: marketingFixtureIds.vitablueOrganization,
      brandId: marketingFixtureIds.vitablueBrand,
      workspaceId: marketingFixtureIds.vitablueWorkspace,
      grants: [{
        userId: ids.userId,
        organizationId: marketingFixtureIds.vitablueOrganization,
        brandId: marketingFixtureIds.vitablueBrand,
        workspaceId: marketingFixtureIds.vitablueWorkspace,
        permission: 'read' as const,
        grantedBy: ids.userId,
        createdAt: timestamp,
        updatedAt: timestamp,
      }],
    };

    expect((await repository.getBrandSnapshot(context))?.brand.id).toBe(marketingFixtureIds.vitablueBrand);
    expect(await repository.listAssets(context)).toHaveLength(1);
    expect(await repository.listConnections(context)).toHaveLength(1);
    expect((await repository.listConnections(context))[0]?.organizationId).toBe(marketingFixtureIds.vitablueOrganization);
  });

  it('revokes a connection only with manage permission and matching scope', async () => {
    const repository = new InMemoryMarketingRepository({ connections: marketingFixtureConnections });
    const context = {
      userId: ids.userId,
      organizationId: marketingFixtureIds.vitablueOrganization,
      brandId: marketingFixtureIds.vitablueBrand,
      workspaceId: marketingFixtureIds.vitablueWorkspace,
      grants: [{
        userId: ids.userId,
        organizationId: marketingFixtureIds.vitablueOrganization,
        brandId: marketingFixtureIds.vitablueBrand,
        workspaceId: marketingFixtureIds.vitablueWorkspace,
        permission: 'manage' as const,
        grantedBy: ids.userId,
        createdAt: timestamp,
        updatedAt: timestamp,
      }],
    };

    const revoked = await repository.disconnectConnection(context, marketingFixtureIds.vitablueConnection);
    expect(revoked.status).toBe('revoked');
    expect((await repository.listConnections({ ...context, grants: [{ ...context.grants[0], permission: 'read' as const }] }))).toHaveLength(1);
    await expect(repository.disconnectConnection({ ...context, brandId: ids.otherBrandId }, marketingFixtureIds.vitablueConnection)).rejects.toBeInstanceOf(MarketingAccessDeniedError);
  });

  it('approves a draft campaign only with explicit approve permission', async () => {
    const campaignId = '00000000-0000-4000-9000-000000000021';
    const repository = new InMemoryMarketingRepository({
      campaigns: [campaign(ids.organizationId, ids.brandId, ids.workspaceId, campaignId)],
    });
    const context = {
      ...ids,
      grants: [{ ...grant, permission: 'approve' as const }],
    };

    const approved = await repository.approveCampaign(context, campaignId);
    expect(approved.status).toBe('approved');
    await expect(repository.approveCampaign({ ...context, grants: [{ ...context.grants[0], permission: 'edit' as const }] }, campaignId)).rejects.toBeInstanceOf(MarketingAccessDeniedError);
  });

  it('manages asset metadata and variants inside the authorized scope', async () => {
    const asset: MarketingAsset = {
      id: '00000000-0000-4000-9000-000000000030',
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      type: 'image',
      name: 'Campaign hero',
      storagePath: 'fixtures/campaign-hero.png',
      mimeType: 'image/png',
      sizeBytes: 2400,
      approvalStatus: 'draft',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const variant: MarketingAssetVariant = {
      id: '00000000-0000-4000-9000-000000000031',
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      assetId: asset.id,
      purpose: 'thumbnail',
      storagePath: 'fixtures/campaign-hero-thumb.png',
      mimeType: 'image/png',
      width: 320,
      height: 180,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const repository = new InMemoryMarketingRepository({ assets: [asset], assetVariants: [variant] });
    const context = { ...ids, grants: [editableGrant, grant] };

    expect((await repository.updateAssetMetadata(context, asset.id, { name: 'Updated hero' })).name).toBe('Updated hero');
    expect((await repository.archiveAsset(context, asset.id)).approvalStatus).toBe('archived');
    expect(await repository.listAssetVariants(context, asset.id)).toHaveLength(1);
    await expect(repository.updateAssetMetadata({ ...context, grants: [grant] }, asset.id, { name: 'Denied' })).rejects.toBeInstanceOf(MarketingAccessDeniedError);
    await expect(repository.listAssetVariants({ ...context, brandId: ids.otherBrandId }, asset.id)).rejects.toBeInstanceOf(MarketingAccessDeniedError);
  });
});