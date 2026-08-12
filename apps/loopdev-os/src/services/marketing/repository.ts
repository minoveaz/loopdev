import {
  BrandContextSnapshotSchema,
  CreateMarketingCampaignSchema,
  MarketingAssetSchema,
  MarketingAssetVariantSchema,
  MarketingCampaignSchema,
  SocialConnectionSchema,
  UpdateMarketingCampaignSchema,
} from '@loopdev/contracts';
import type {
  BrandContextSnapshot,
  CreateMarketingCampaignInput,
  MarketingAccessGrant,
  MarketingAsset,
  MarketingAssetVariant,
  MarketingCampaign,
  MarketingPermission,
  SocialConnection,
  UpdateMarketingCampaignInput,
} from '@loopdev/contracts';
import { hasMarketingAccess } from './access';

export type MarketingRepositoryContext = {
  userId: string;
  organizationId: string;
  workspaceId: string;
  brandId: string;
  grants: MarketingAccessGrant[];
};

export type MarketingRepositorySeed = {
  campaigns?: MarketingCampaign[];
  brandSnapshots?: BrandContextSnapshot[];
  assets?: MarketingAsset[];
  assetVariants?: MarketingAssetVariant[];
  connections?: SocialConnection[];
};

export interface MarketingRepository {
  listCampaigns(context: MarketingRepositoryContext): Promise<MarketingCampaign[]>;
  createCampaign(context: MarketingRepositoryContext, input: CreateMarketingCampaignInput): Promise<MarketingCampaign>;
  updateCampaign(context: MarketingRepositoryContext, input: UpdateMarketingCampaignInput): Promise<MarketingCampaign>;
  approveCampaign(context: MarketingRepositoryContext, campaignId: string): Promise<MarketingCampaign>;
  getBrandSnapshot(context: MarketingRepositoryContext): Promise<BrandContextSnapshot | null>;
  listAssets(context: MarketingRepositoryContext): Promise<MarketingAsset[]>;
  createAsset(context: MarketingRepositoryContext, asset: MarketingAsset): Promise<MarketingAsset>;
  updateAssetMetadata(context: MarketingRepositoryContext, assetId: string, updates: Partial<Pick<MarketingAsset, 'name' | 'approvalStatus' | 'checksum' | 'width' | 'height' | 'durationMs'>>): Promise<MarketingAsset>;
  archiveAsset(context: MarketingRepositoryContext, assetId: string): Promise<MarketingAsset>;
  listAssetVariants(context: MarketingRepositoryContext, assetId: string): Promise<MarketingAssetVariant[]>;
  listConnections(context: MarketingRepositoryContext): Promise<SocialConnection[]>;
  disconnectConnection(context: MarketingRepositoryContext, connectionId: string): Promise<SocialConnection>;
}

export class MarketingAccessDeniedError extends Error {
  constructor() {
    super('Marketing access denied');
    this.name = 'MarketingAccessDeniedError';
  }
}

function assertAccess(context: MarketingRepositoryContext, permission: MarketingPermission) {
  if (!hasMarketingAccess(context.grants, { ...context, permission })) {
    throw new MarketingAccessDeniedError();
  }
}

export class InMemoryMarketingRepository implements MarketingRepository {
  private readonly campaigns: MarketingCampaign[];
  private readonly brandSnapshots: BrandContextSnapshot[];
  private readonly assets: MarketingAsset[];
  private readonly assetVariants: MarketingAssetVariant[];
  private readonly connections: SocialConnection[];

  constructor(seed: MarketingRepositorySeed | MarketingCampaign[] = []) {
    const normalizedSeed = Array.isArray(seed) ? { campaigns: seed } : seed;
    this.campaigns = (normalizedSeed.campaigns ?? []).map((campaign) => MarketingCampaignSchema.parse(campaign));
    this.brandSnapshots = (normalizedSeed.brandSnapshots ?? []).map((snapshot) => BrandContextSnapshotSchema.parse(snapshot));
    this.assets = (normalizedSeed.assets ?? []).map((asset) => MarketingAssetSchema.parse(asset));
    this.assetVariants = (normalizedSeed.assetVariants ?? []).map((variant) => MarketingAssetVariantSchema.parse(variant));
    this.connections = (normalizedSeed.connections ?? []).map((connection) => SocialConnectionSchema.parse(connection));
  }

  async listCampaigns(context: MarketingRepositoryContext) {
    assertAccess(context, 'read');
    return this.campaigns.filter((campaign) =>
      campaign.organizationId === context.organizationId
      && campaign.workspaceId === context.workspaceId
      && campaign.brandId === context.brandId,
    );
  }

  async getBrandSnapshot(context: MarketingRepositoryContext) {
    assertAccess(context, 'read');
    return this.brandSnapshots.find((snapshot) =>
      snapshot.organizationId === context.organizationId
      && snapshot.brand.id === context.brandId,
    ) ?? null;
  }

  async listAssets(context: MarketingRepositoryContext) {
    assertAccess(context, 'read');
    return this.assets.filter((asset) =>
      asset.organizationId === context.organizationId
      && asset.brandId === context.brandId
      && (asset.workspaceId == null || asset.workspaceId === context.workspaceId),
    );
  }

  async listConnections(context: MarketingRepositoryContext) {
    assertAccess(context, 'read');
    return this.connections.filter((connection) =>
      connection.organizationId === context.organizationId
      && connection.brandId === context.brandId
      && (connection.workspaceId == null || connection.workspaceId === context.workspaceId),
    );
  }

  async createAsset(context: MarketingRepositoryContext, asset: MarketingAsset) {
    assertAccess(context, 'edit');
    const parsed = MarketingAssetSchema.parse(asset);
    if (parsed.organizationId !== context.organizationId || parsed.brandId !== context.brandId || (parsed.workspaceId != null && parsed.workspaceId !== context.workspaceId)) {
      throw new MarketingAccessDeniedError();
    }
    this.assets.push(parsed);
    return parsed;
  }

  async updateAssetMetadata(context: MarketingRepositoryContext, assetId: string, updates: Partial<Pick<MarketingAsset, 'name' | 'approvalStatus' | 'checksum' | 'width' | 'height' | 'durationMs'>>) {
    assertAccess(context, 'edit');
    const assetIndex = this.assets.findIndex((asset) => asset.id === assetId && asset.organizationId === context.organizationId && asset.brandId === context.brandId && (asset.workspaceId == null || asset.workspaceId === context.workspaceId));
    if (assetIndex < 0) throw new MarketingAccessDeniedError();
    const updated = MarketingAssetSchema.parse({ ...this.assets[assetIndex], ...updates, updatedAt: new Date().toISOString() });
    this.assets[assetIndex] = updated;
    return updated;
  }

  async archiveAsset(context: MarketingRepositoryContext, assetId: string) {
    return this.updateAssetMetadata(context, assetId, { approvalStatus: 'archived' });
  }

  async listAssetVariants(context: MarketingRepositoryContext, assetId: string) {
    assertAccess(context, 'read');
    const asset = this.assets.find((candidate) => candidate.id === assetId && candidate.organizationId === context.organizationId && candidate.brandId === context.brandId && (candidate.workspaceId == null || candidate.workspaceId === context.workspaceId));
    if (!asset) throw new MarketingAccessDeniedError();
    return this.assetVariants.filter((variant) => variant.assetId === assetId && variant.organizationId === context.organizationId && variant.brandId === context.brandId && (variant.workspaceId == null || variant.workspaceId === context.workspaceId));
  }

  async disconnectConnection(context: MarketingRepositoryContext, connectionId: string) {
    assertAccess(context, 'manage');
    const connectionIndex = this.connections.findIndex((connection) =>
      connection.id === connectionId
      && connection.organizationId === context.organizationId
      && connection.brandId === context.brandId
      && (connection.workspaceId == null || connection.workspaceId === context.workspaceId),
    );

    if (connectionIndex < 0) {
      throw new MarketingAccessDeniedError();
    }

    const connection = this.connections[connectionIndex];
    const revokedConnection = SocialConnectionSchema.parse({
      ...connection,
      status: 'revoked',
      updatedAt: new Date().toISOString(),
    });
    this.connections[connectionIndex] = revokedConnection;
    return revokedConnection;
  }

  async createCampaign(context: MarketingRepositoryContext, input: CreateMarketingCampaignInput) {
    assertAccess(context, 'edit');
    const parsed = CreateMarketingCampaignSchema.parse(input);

    if (parsed.organizationId !== context.organizationId || parsed.workspaceId !== context.workspaceId || parsed.brandId !== context.brandId) {
      throw new MarketingAccessDeniedError();
    }

    const campaign = MarketingCampaignSchema.parse({
      ...parsed,
      id: crypto.randomUUID(),
      createdBy: context.userId,
      updatedBy: context.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.campaigns.push(campaign);
    return campaign;
  }

  async updateCampaign(context: MarketingRepositoryContext, input: UpdateMarketingCampaignInput) {
    assertAccess(context, 'edit');
    const parsed = UpdateMarketingCampaignSchema.parse(input);
    const campaignIndex = this.campaigns.findIndex((campaign) =>
      campaign.id === parsed.campaignId
      && campaign.organizationId === context.organizationId
      && campaign.workspaceId === context.workspaceId
      && campaign.brandId === context.brandId,
    );

    if (campaignIndex < 0 || parsed.organizationId !== context.organizationId || parsed.workspaceId !== context.workspaceId) {
      throw new MarketingAccessDeniedError();
    }

    if (parsed.brandId !== undefined && parsed.brandId !== context.brandId) {
      throw new MarketingAccessDeniedError();
    }

    const currentCampaign = this.campaigns[campaignIndex];
    const updatedCampaign = MarketingCampaignSchema.parse({
      ...currentCampaign,
      ...parsed,
      id: currentCampaign.id,
      organizationId: currentCampaign.organizationId,
      brandId: currentCampaign.brandId,
      workspaceId: currentCampaign.workspaceId,
      campaignId: undefined,
      updatedBy: context.userId,
      updatedAt: new Date().toISOString(),
    });
    this.campaigns[campaignIndex] = updatedCampaign;
    return updatedCampaign;
  }

  async approveCampaign(context: MarketingRepositoryContext, campaignId: string) {
    assertAccess(context, 'approve');
    const campaignIndex = this.campaigns.findIndex((campaign) =>
      campaign.id === campaignId
      && campaign.organizationId === context.organizationId
      && campaign.workspaceId === context.workspaceId
      && campaign.brandId === context.brandId,
    );

    if (campaignIndex < 0) {
      throw new MarketingAccessDeniedError();
    }

    const currentCampaign = this.campaigns[campaignIndex];
    if (currentCampaign.status !== 'draft' && currentCampaign.status !== 'in_review') {
      throw new Error('Only draft or in-review campaigns can be approved');
    }

    const approvedCampaign = MarketingCampaignSchema.parse({
      ...currentCampaign,
      status: 'approved',
      updatedBy: context.userId,
      updatedAt: new Date().toISOString(),
    });
    this.campaigns[campaignIndex] = approvedCampaign;
    return approvedCampaign;
  }
}