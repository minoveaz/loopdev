import {
  BrandContextSnapshotSchema,
  CreateMarketingCreativeProjectSchema,
  CreateMarketingCreativeProjectVersionSchema,
  CreateMarketingCreativeVariantSchema,
  CreateMarketingCampaignSchema,
  MarketingCreativeProjectSchema,
  MarketingCreativeProjectVersionSchema,
  MarketingCreativeVariantSchema,
  MarketingAssetSchema,
  MarketingAssetVariantSchema,
  MarketingCampaignSchema,
  SocialConnectionSchema,
  UpdateMarketingCampaignSchema,
} from '@loopdev/contracts';
import type {
  BrandContextSnapshot,
  CreateMarketingCreativeProjectInput,
  CreateMarketingCreativeProjectVersionInput,
  CreateMarketingCreativeVariantInput,
  CreateMarketingCampaignInput,
  MarketingAccessGrant,
  MarketingAsset,
  MarketingAssetVariant,
  MarketingCampaign,
  MarketingCreativeProject,
  MarketingCreativeProjectVersion,
  MarketingCreativeVariant,
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
  creativeProjects?: MarketingCreativeProject[];
  creativeProjectVersions?: MarketingCreativeProjectVersion[];
  creativeVariants?: MarketingCreativeVariant[];
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
  listCreativeProjects(context: MarketingRepositoryContext): Promise<MarketingCreativeProject[]>;
  createCreativeProject(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeProjectInput,
  ): Promise<MarketingCreativeProject>;
  listCreativeProjectVersions(
    context: MarketingRepositoryContext,
    projectId: string,
  ): Promise<MarketingCreativeProjectVersion[]>;
  createCreativeProjectVersion(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeProjectVersionInput,
  ): Promise<MarketingCreativeProjectVersion>;
  listCreativeVariants(
    context: MarketingRepositoryContext,
    projectVersionId: string,
  ): Promise<MarketingCreativeVariant[]>;
  createCreativeVariant(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeVariantInput,
  ): Promise<MarketingCreativeVariant>;
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
  private readonly creativeProjects: MarketingCreativeProject[];
  private readonly creativeProjectVersions: MarketingCreativeProjectVersion[];
  private readonly creativeVariants: MarketingCreativeVariant[];
  private readonly brandSnapshots: BrandContextSnapshot[];
  private readonly assets: MarketingAsset[];
  private readonly assetVariants: MarketingAssetVariant[];
  private readonly connections: SocialConnection[];

  constructor(seed: MarketingRepositorySeed | MarketingCampaign[] = []) {
    const normalizedSeed = Array.isArray(seed) ? { campaigns: seed } : seed;
    this.campaigns = (normalizedSeed.campaigns ?? []).map((campaign) => MarketingCampaignSchema.parse(campaign));
    this.creativeProjects = (normalizedSeed.creativeProjects ?? []).map((project) =>
      MarketingCreativeProjectSchema.parse(project),
    );
    this.creativeProjectVersions = (normalizedSeed.creativeProjectVersions ?? []).map((version) =>
      MarketingCreativeProjectVersionSchema.parse(version),
    );
    this.creativeVariants = (normalizedSeed.creativeVariants ?? []).map((variant) =>
      MarketingCreativeVariantSchema.parse(variant),
    );
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

  async listCreativeProjects(context: MarketingRepositoryContext) {
    assertAccess(context, 'read');
    return this.creativeProjects.filter((project) => isCreativeProjectInContext(project, context));
  }

  async createCreativeProject(context: MarketingRepositoryContext, input: CreateMarketingCreativeProjectInput) {
    assertAccess(context, 'edit');
    const parsed = CreateMarketingCreativeProjectSchema.parse(input);
    assertCreativeScope(parsed, context);
    const now = new Date().toISOString();
    const project = MarketingCreativeProjectSchema.parse({
      ...parsed,
      id: crypto.randomUUID(),
      createdBy: context.userId,
      updatedBy: context.userId,
      createdAt: now,
      updatedAt: now,
    });
    this.creativeProjects.push(project);
    return project;
  }

  async listCreativeProjectVersions(context: MarketingRepositoryContext, projectId: string) {
    assertAccess(context, 'read');
    assertProjectInContext(this.creativeProjects, projectId, context);
    return this.creativeProjectVersions.filter(
      (version) => version.projectId === projectId && isCreativeProjectInContext(version, context),
    );
  }

  async createCreativeProjectVersion(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeProjectVersionInput,
  ) {
    assertAccess(context, 'edit');
    const parsed = CreateMarketingCreativeProjectVersionSchema.parse(input);
    assertCreativeScope(parsed, context);
    assertProjectInContext(this.creativeProjects, parsed.projectId, context);
    if (
      this.creativeProjectVersions.some(
        (version) => version.projectId === parsed.projectId && version.versionNumber === parsed.versionNumber,
      )
    ) {
      throw new Error('Creative project version already exists');
    }
    const now = new Date().toISOString();
    const version = MarketingCreativeProjectVersionSchema.parse({
      ...parsed,
      id: crypto.randomUUID(),
      createdBy: context.userId,
      updatedBy: context.userId,
      createdAt: now,
      updatedAt: now,
    });
    this.creativeProjectVersions.push(version);
    return version;
  }

  async listCreativeVariants(context: MarketingRepositoryContext, projectVersionId: string) {
    assertAccess(context, 'read');
    const version = this.creativeProjectVersions.find((candidate) => candidate.id === projectVersionId);
    if (!version || !isCreativeProjectInContext(version, context)) throw new MarketingAccessDeniedError();
    return this.creativeVariants.filter(
      (variant) => variant.projectVersionId === projectVersionId && isCreativeProjectInContext(variant, context),
    );
  }

  async createCreativeVariant(context: MarketingRepositoryContext, input: CreateMarketingCreativeVariantInput) {
    assertAccess(context, 'edit');
    const parsed = CreateMarketingCreativeVariantSchema.parse(input);
    assertCreativeScope(parsed, context);
    assertProjectInContext(this.creativeProjects, parsed.projectId, context);
    const version = this.creativeProjectVersions.find(
      (candidate) => candidate.id === parsed.projectVersionId && candidate.projectId === parsed.projectId,
    );
    if (!version || !isCreativeProjectInContext(version, context)) throw new MarketingAccessDeniedError();
    if (
      this.creativeVariants.some(
        (variant) =>
          variant.projectVersionId === parsed.projectVersionId && variant.key === parsed.key,
      )
    ) {
      throw new Error('Creative project variant already exists');
    }
    const now = new Date().toISOString();
    const variant = MarketingCreativeVariantSchema.parse({
      ...parsed,
      id: crypto.randomUUID(),
      createdBy: context.userId,
      updatedBy: context.userId,
      createdAt: now,
      updatedAt: now,
    });
    this.creativeVariants.push(variant);
    return variant;
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

type CreativeScopedRecord = {
  organizationId: string;
  brandId: string;
  workspaceId: string;
};

function isCreativeProjectInContext(
  record: CreativeScopedRecord,
  context: MarketingRepositoryContext,
) {
  return (
    record.organizationId === context.organizationId
    && record.brandId === context.brandId
    && record.workspaceId === context.workspaceId
  );
}

function assertCreativeScope(record: CreativeScopedRecord, context: MarketingRepositoryContext) {
  if (!isCreativeProjectInContext(record, context)) throw new MarketingAccessDeniedError();
}

function assertProjectInContext(
  projects: MarketingCreativeProject[],
  projectId: string,
  context: MarketingRepositoryContext,
) {
  const project = projects.find((candidate) => candidate.id === projectId);
  if (!project || !isCreativeProjectInContext(project, context)) throw new MarketingAccessDeniedError();
}

export class SupabaseCreativeRepository {
  async listCreativeProjects(context: MarketingRepositoryContext) {
    const supabase = await getAuthorizedSupabase(context, 'read');
    const { data, error } = await supabase
      .from('marketing_creative_projects')
      .select(creativeProjectColumns)
      .eq('organization_id', context.organizationId)
      .eq('brand_id', context.brandId)
      .eq('workspace_id', context.workspaceId)
      .order('updated_at', { ascending: false });
    if (error) throw new Error('Unable to load creative projects');
    return ((data ?? []) as unknown as CreativeProjectRow[]).map(mapCreativeProject);
  }

  async createCreativeProject(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeProjectInput,
  ) {
    const parsed = CreateMarketingCreativeProjectSchema.parse(input);
    assertCreativeScope(parsed, context);
    const supabase = await getAuthorizedSupabase(context, 'edit');
    const { data, error } = await supabase
      .from('marketing_creative_projects')
      .insert({
        organization_id: parsed.organizationId,
        brand_id: parsed.brandId,
        workspace_id: parsed.workspaceId,
        name: parsed.name,
        description: parsed.description ?? null,
        type: parsed.type,
        status: parsed.status,
        current_version_number: parsed.currentVersionNumber,
        created_by: context.userId,
        updated_by: context.userId,
      })
      .select(creativeProjectColumns)
      .single();
    if (error) throw new Error('Unable to create creative project');
    return mapCreativeProject(data as unknown as CreativeProjectRow);
  }

  async listCreativeProjectVersions(context: MarketingRepositoryContext, projectId: string) {
    const supabase = await getAuthorizedSupabase(context, 'read');
    const { data, error } = await supabase
      .from('marketing_creative_project_versions')
      .select(creativeProjectVersionColumns)
      .eq('organization_id', context.organizationId)
      .eq('brand_id', context.brandId)
      .eq('workspace_id', context.workspaceId)
      .eq('project_id', projectId)
      .order('version_number', { ascending: false });
    if (error) throw new Error('Unable to load creative project versions');
    return ((data ?? []) as unknown as CreativeProjectVersionRow[]).map(mapCreativeProjectVersion);
  }

  async createCreativeProjectVersion(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeProjectVersionInput,
  ) {
    const parsed = CreateMarketingCreativeProjectVersionSchema.parse(input);
    assertCreativeScope(parsed, context);
    const supabase = await getAuthorizedSupabase(context, 'edit');
    const { data, error } = await supabase
      .from('marketing_creative_project_versions')
      .insert({
        organization_id: parsed.organizationId,
        brand_id: parsed.brandId,
        workspace_id: parsed.workspaceId,
        project_id: parsed.projectId,
        version_number: parsed.versionNumber,
        document: parsed.document as import('@/types/database.types').Json,
        change_summary: parsed.changeSummary ?? null,
        created_by: context.userId,
        updated_by: context.userId,
      })
      .select(creativeProjectVersionColumns)
      .single();
    if (error) throw new Error('Unable to create creative project version');
    return mapCreativeProjectVersion(data as unknown as CreativeProjectVersionRow);
  }

  async listCreativeVariants(context: MarketingRepositoryContext, projectVersionId: string) {
    const supabase = await getAuthorizedSupabase(context, 'read');
    const { data, error } = await supabase
      .from('marketing_creative_variants')
      .select(creativeVariantColumns)
      .eq('organization_id', context.organizationId)
      .eq('brand_id', context.brandId)
      .eq('workspace_id', context.workspaceId)
      .eq('project_version_id', projectVersionId)
      .order('created_at', { ascending: true });
    if (error) throw new Error('Unable to load creative variants');
    return ((data ?? []) as unknown as CreativeVariantRow[]).map(mapCreativeVariant);
  }

  async createCreativeVariant(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeVariantInput,
  ) {
    const parsed = CreateMarketingCreativeVariantSchema.parse(input);
    assertCreativeScope(parsed, context);
    const supabase = await getAuthorizedSupabase(context, 'edit');
    const { data, error } = await supabase
      .from('marketing_creative_variants')
      .insert({
        organization_id: parsed.organizationId,
        brand_id: parsed.brandId,
        workspace_id: parsed.workspaceId,
        project_id: parsed.projectId,
        project_version_id: parsed.projectVersionId,
        key: parsed.key,
        channel: parsed.channel,
        format: parsed.format,
        payload: parsed.payload as import('@/types/database.types').Json,
        width: parsed.width ?? null,
        height: parsed.height ?? null,
        status: parsed.status,
        created_by: context.userId,
        updated_by: context.userId,
      })
      .select(creativeVariantColumns)
      .single();
    if (error) throw new Error('Unable to create creative variant');
    return mapCreativeVariant(data as unknown as CreativeVariantRow);
  }
}

const creativeProjectColumns =
  'id, organization_id, brand_id, workspace_id, name, description, type, status, current_version_number, created_by, updated_by, created_at, updated_at';
const creativeProjectVersionColumns =
  'id, organization_id, brand_id, workspace_id, project_id, version_number, document, change_summary, created_by, updated_by, created_at, updated_at';
const creativeVariantColumns =
  'id, organization_id, brand_id, workspace_id, project_id, project_version_id, key, channel, format, payload, width, height, status, created_by, updated_by, created_at, updated_at';

type CreativeProjectRow = {
  id: string;
  organization_id: string;
  brand_id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  current_version_number: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};
type CreativeProjectVersionRow = {
  id: string;
  organization_id: string;
  brand_id: string;
  workspace_id: string;
  project_id: string;
  version_number: number;
  document: unknown;
  change_summary: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};
type CreativeVariantRow = {
  id: string;
  organization_id: string;
  brand_id: string;
  workspace_id: string;
  project_id: string;
  project_version_id: string;
  key: string;
  channel: string;
  format: string;
  payload: unknown;
  width: number | null;
  height: number | null;
  status: string;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

function mapCreativeProject(row: CreativeProjectRow): MarketingCreativeProject {
  return MarketingCreativeProjectSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    brandId: row.brand_id,
    workspaceId: row.workspace_id,
    name: row.name,
    description: row.description,
    type: row.type,
    status: row.status,
    currentVersionNumber: row.current_version_number,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapCreativeProjectVersion(row: CreativeProjectVersionRow): MarketingCreativeProjectVersion {
  return MarketingCreativeProjectVersionSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    brandId: row.brand_id,
    workspaceId: row.workspace_id,
    projectId: row.project_id,
    versionNumber: row.version_number,
    document: row.document,
    changeSummary: row.change_summary,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapCreativeVariant(row: CreativeVariantRow): MarketingCreativeVariant {
  return MarketingCreativeVariantSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    brandId: row.brand_id,
    workspaceId: row.workspace_id,
    projectId: row.project_id,
    projectVersionId: row.project_version_id,
    key: row.key,
    channel: row.channel,
    format: row.format,
    payload: row.payload,
    width: row.width,
    height: row.height,
    status: row.status,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

async function getAuthorizedSupabase(
  context: MarketingRepositoryContext,
  permission: 'read' | 'edit',
) {
  const supabase = await import('@/lib/supabase/server').then(({ createServerSupabaseClient }) =>
    createServerSupabaseClient(),
  );
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user || authData.user.id !== context.userId) {
    throw new MarketingAccessDeniedError();
  }
  const { data, error } = await supabase.rpc('has_organization_permission', {
    target_organization_id: context.organizationId,
    required_permission: permission === 'read' ? 'marketing.read' : 'marketing.manage',
  });
  if (error || data !== true) throw new MarketingAccessDeniedError();
  return supabase;
}