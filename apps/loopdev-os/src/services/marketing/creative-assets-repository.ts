import { createHash, randomUUID } from 'node:crypto';
import {
  CreateMarketingCreativeAssetReferenceSchema,
  CreateMarketingCreativeAssetSchema,
  CREATIVE_STUDIO_CAPACITY_LIMITS,
  MarketingCreativeAssetReferenceSchema,
  MarketingCreativeAssetSchema,
  MarketingCreativeStorageUsageSchema,
} from '@loopdev/contracts';
import type {
  CreateMarketingCreativeAssetInput,
  CreateMarketingCreativeAssetReferenceInput,
  MarketingCreativeAsset,
  MarketingCreativeAssetReference,
  MarketingCreativeStorageUsage,
} from '@loopdev/contracts';
import type { MarketingRepositoryContext } from './repository';
import { MarketingAccessDeniedError } from './repository';
import { hasMarketingAccess } from './access';

const DEFAULT_QUOTA_BYTES = 5 * 1024 * 1024 * 1024;

export type CreativeAssetRepository = {
  createAsset(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeAssetInput,
    content?: Uint8Array,
  ): Promise<MarketingCreativeAsset>;
  listAssets(context: MarketingRepositoryContext, projectId?: string): Promise<MarketingCreativeAsset[]>;
  createReference(
    context: MarketingRepositoryContext,
    input: CreateMarketingCreativeAssetReferenceInput,
  ): Promise<MarketingCreativeAssetReference>;
  listReferences(context: MarketingRepositoryContext, assetId?: string): Promise<MarketingCreativeAssetReference[]>;
  getUsage(context: MarketingRepositoryContext): Promise<MarketingCreativeStorageUsage>;
  cleanup(context: MarketingRepositoryContext, now?: Date): Promise<string[]>;
};

export function sha256Hex(content: Uint8Array): string {
  return createHash('sha256').update(content).digest('hex');
}

function assertAccess(context: MarketingRepositoryContext, permission: 'read' | 'edit') {
  if (!hasMarketingAccess(context.grants, { ...context, permission })) {
    throw new MarketingAccessDeniedError();
  }
}

function assertScope(
  context: MarketingRepositoryContext,
  scope: { organizationId: string; brandId: string; workspaceId: string },
) {
  if (
    scope.organizationId !== context.organizationId
    || scope.brandId !== context.brandId
    || scope.workspaceId !== context.workspaceId
  ) {
    throw new MarketingAccessDeniedError();
  }
}

export class InMemoryCreativeAssetRepository implements CreativeAssetRepository {
  private readonly assets: MarketingCreativeAsset[];
  private readonly references: MarketingCreativeAssetReference[];
  private readonly quotas = new Map<string, number>();

  constructor(seed?: {
    assets?: MarketingCreativeAsset[];
    references?: MarketingCreativeAssetReference[];
    quotas?: Array<{ organizationId: string; workspaceId: string; quotaBytes: number }>;
  }) {
    this.assets = (seed?.assets ?? []).map((asset) => MarketingCreativeAssetSchema.parse(asset));
    this.references = (seed?.references ?? []).map((reference) =>
      MarketingCreativeAssetReferenceSchema.parse(reference),
    );
    for (const quota of seed?.quotas ?? []) {
      this.quotas.set(this.scopeKey(quota.organizationId, quota.workspaceId), quota.quotaBytes);
    }
  }

  async createAsset(context: MarketingRepositoryContext, input: CreateMarketingCreativeAssetInput, content?: Uint8Array) {
    assertAccess(context, 'edit');
    const parsed = CreateMarketingCreativeAssetSchema.parse(input);
    assertScope(context, parsed);
    const sizeBytes = content?.byteLength ?? parsed.sizeBytes;
    const contentHash = content ? sha256Hex(content) : parsed.contentHash;
    if (sizeBytes !== parsed.sizeBytes || contentHash.toLowerCase() !== parsed.contentHash.toLowerCase()) {
      throw new Error('Creative asset metadata does not match its content');
    }
    const duplicate = this.assets.find((asset) =>
      asset.organizationId === context.organizationId
      && asset.workspaceId === context.workspaceId
      && asset.kind === parsed.kind
      && asset.contentHash.toLowerCase() === contentHash.toLowerCase()
      && asset.status !== 'expired',
    );
    if (duplicate) return duplicate;
    const projectBytes = parsed.projectId
      ? this.assets
        .filter((asset) =>
          asset.organizationId === context.organizationId
          && asset.workspaceId === context.workspaceId
          && asset.projectId === parsed.projectId
          && asset.status === 'active',
        )
        .reduce((total, asset) => total + asset.sizeBytes, 0)
      : 0;
    if (parsed.projectId && projectBytes + sizeBytes > CREATIVE_STUDIO_CAPACITY_LIMITS.maxProjectBytes) {
      throw new Error('Creative project asset limit exceeded');
    }
    const usage = await this.getUsage(context);
    if (usage.usedBytes + sizeBytes > (usage.quotaBytes ?? DEFAULT_QUOTA_BYTES)) {
      throw new Error('Creative storage quota exceeded');
    }
    const timestamp = new Date().toISOString();
    const asset = MarketingCreativeAssetSchema.parse({
      ...parsed,
      id: randomUUID(),
      sizeBytes,
      contentHash,
      createdBy: context.userId,
      updatedBy: context.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    this.assets.push(asset);
    return asset;
  }

  async listAssets(context: MarketingRepositoryContext, projectId?: string) {
    assertAccess(context, 'read');
    return this.assets.filter((asset) =>
      asset.organizationId === context.organizationId
      && asset.brandId === context.brandId
      && asset.workspaceId === context.workspaceId
      && (projectId === undefined || asset.projectId === projectId),
    );
  }

  async createReference(context: MarketingRepositoryContext, input: CreateMarketingCreativeAssetReferenceInput) {
    assertAccess(context, 'edit');
    const parsed = CreateMarketingCreativeAssetReferenceSchema.parse(input);
    assertScope(context, parsed);
    if (!this.assets.some((asset) => asset.id === parsed.assetId && asset.organizationId === context.organizationId)) {
      throw new Error('Creative asset not found');
    }
    const duplicate = this.references.find((reference) =>
      reference.organizationId === parsed.organizationId
      && reference.assetId === parsed.assetId
      && reference.projectVersionId === parsed.projectVersionId
      && reference.variantId === parsed.variantId
      && reference.layerId === parsed.layerId
      && reference.referenceType === parsed.referenceType,
    );
    if (duplicate) return duplicate;
    const timestamp = new Date().toISOString();
    const reference = MarketingCreativeAssetReferenceSchema.parse({
      ...parsed,
      id: randomUUID(),
      createdBy: context.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    this.references.push(reference);
    return reference;
  }

  async listReferences(context: MarketingRepositoryContext, assetId?: string) {
    assertAccess(context, 'read');
    return this.references.filter((reference) =>
      reference.organizationId === context.organizationId
      && reference.brandId === context.brandId
      && reference.workspaceId === context.workspaceId
      && (assetId === undefined || reference.assetId === assetId),
    );
  }

  async getUsage(context: MarketingRepositoryContext) {
    assertAccess(context, 'read');
    const assets = this.assets.filter((asset) =>
      asset.organizationId === context.organizationId
      && asset.workspaceId === context.workspaceId
      && asset.status === 'active',
    );
    return MarketingCreativeStorageUsageSchema.parse({
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      usedBytes: assets.reduce((total, asset) => total + asset.sizeBytes, 0),
      assetCount: assets.length,
      quotaBytes: this.quotas.get(this.scopeKey(context.organizationId, context.workspaceId)) ?? DEFAULT_QUOTA_BYTES,
      indexedDbIsCacheOnly: true,
    });
  }

  async cleanup(context: MarketingRepositoryContext, now = new Date()) {
    assertAccess(context, 'edit');
    const cutoff = now.getTime() - CREATIVE_STUDIO_CAPACITY_LIMITS.orphanGracePeriodHours * 60 * 60 * 1_000;
    const referenced = new Set(
      this.references
        .filter((reference) => reference.organizationId === context.organizationId)
        .map((reference) => reference.assetId),
    );
    const removable = this.assets.filter((asset) =>
      asset.organizationId === context.organizationId
      && asset.workspaceId === context.workspaceId
      && !referenced.has(asset.id)
      && (
        (asset.kind === 'export' && asset.expiresAt && new Date(asset.expiresAt).getTime() <= now.getTime())
        || (asset.status === 'orphaned' && asset.orphanedAt
          && new Date(asset.orphanedAt).getTime() <= cutoff)
      ),
    );
    const ids = new Set(removable.map((asset) => asset.id));
    for (let index = this.assets.length - 1; index >= 0; index -= 1) {
      if (ids.has(this.assets[index]!.id)) this.assets.splice(index, 1);
    }
    return [...ids];
  }

  private scopeKey(organizationId: string, workspaceId: string) {
    return `${organizationId}:${workspaceId}`;
  }
}

export class SupabaseCreativeAssetRepository implements CreativeAssetRepository {
  async createAsset(context: MarketingRepositoryContext, input: CreateMarketingCreativeAssetInput, content?: Uint8Array) {
    assertAccess(context, 'edit');
    const parsed = CreateMarketingCreativeAssetSchema.parse(input);
    assertScope(context, parsed);
    if (content && (content.byteLength !== parsed.sizeBytes || sha256Hex(content) !== parsed.contentHash.toLowerCase())) {
      throw new Error('Creative asset metadata does not match its content');
    }
    const supabase = await getSupabase();
    const existing = await supabase
      .from('marketing_creative_assets')
      .select(CREATIVE_ASSET_COLUMNS)
      .eq('organization_id', parsed.organizationId)
      .eq('workspace_id', parsed.workspaceId)
      .eq('kind', parsed.kind)
      .eq('content_hash', parsed.contentHash)
      .neq('status', 'expired')
      .maybeSingle();
    if (existing.error) throw new Error('Unable to check for duplicate creative assets');
    if (existing.data) return mapAsset(existing.data);
    if (content) {
      const { error } = await supabase.storage
        .from('marketing-creative')
        .upload(parsed.storagePath, content, { contentType: parsed.mimeType, upsert: false });
      if (error) throw new Error('Unable to upload creative asset');
    }
    const { data, error } = await supabase
      .from('marketing_creative_assets')
      .insert({
        organization_id: parsed.organizationId,
        brand_id: parsed.brandId,
        workspace_id: parsed.workspaceId,
        project_id: parsed.projectId ?? null,
        kind: parsed.kind,
        status: parsed.status,
        storage_path: parsed.storagePath,
        mime_type: parsed.mimeType,
        size_bytes: parsed.sizeBytes,
        content_hash: parsed.contentHash.toLowerCase(),
        source_asset_id: parsed.sourceAssetId ?? null,
        compressed: parsed.compressed,
        width: parsed.width ?? null,
        height: parsed.height ?? null,
        expires_at: parsed.expiresAt ?? null,
        orphaned_at: parsed.orphanedAt ?? null,
        created_by: context.userId,
        updated_by: context.userId,
      })
      .select(CREATIVE_ASSET_COLUMNS)
      .single();
    if (error) {
      if (content) {
        const { error: cleanupError } = await supabase.storage
          .from('marketing-creative')
          .remove([parsed.storagePath]);
        if (cleanupError) throw new Error('Unable to roll back uploaded creative asset');
      }
      throw new Error('Unable to create creative asset');
    }
    return mapAsset(data);
  }

  async listAssets(context: MarketingRepositoryContext, projectId?: string) {
    assertAccess(context, 'read');
    const supabase = await getSupabase();
    let query = supabase
      .from('marketing_creative_assets')
      .select(CREATIVE_ASSET_COLUMNS)
      .eq('organization_id', context.organizationId)
      .eq('brand_id', context.brandId)
      .eq('workspace_id', context.workspaceId)
      .order('created_at', { ascending: true });
    if (projectId) query = query.eq('project_id', projectId);
    const { data, error } = await query;
    if (error) throw new Error('Unable to load creative assets');
    return (data ?? []).map(mapAsset);
  }

  async createReference(context: MarketingRepositoryContext, input: CreateMarketingCreativeAssetReferenceInput) {
    assertAccess(context, 'edit');
    const parsed = CreateMarketingCreativeAssetReferenceSchema.parse(input);
    assertScope(context, parsed);
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('marketing_creative_asset_references')
      .insert({
        organization_id: parsed.organizationId,
        brand_id: parsed.brandId,
        workspace_id: parsed.workspaceId,
        asset_id: parsed.assetId,
        project_id: parsed.projectId,
        project_version_id: parsed.projectVersionId ?? null,
        variant_id: parsed.variantId ?? null,
        layer_id: parsed.layerId ?? null,
        reference_type: parsed.referenceType,
        created_by: context.userId,
      })
      .select(CREATIVE_ASSET_REFERENCE_COLUMNS)
      .single();
    if (error) throw new Error('Unable to create creative asset reference');
    return mapReference(data);
  }

  async listReferences(context: MarketingRepositoryContext, assetId?: string) {
    assertAccess(context, 'read');
    const supabase = await getSupabase();
    let query = supabase
      .from('marketing_creative_asset_references')
      .select(CREATIVE_ASSET_REFERENCE_COLUMNS)
      .eq('organization_id', context.organizationId)
      .eq('brand_id', context.brandId)
      .eq('workspace_id', context.workspaceId)
      .order('created_at', { ascending: true });
    if (assetId) query = query.eq('asset_id', assetId);
    const { data, error } = await query;
    if (error) throw new Error('Unable to load creative asset references');
    return (data ?? []).map(mapReference);
  }

  async getUsage(context: MarketingRepositoryContext) {
    assertAccess(context, 'read');
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('marketing_creative_storage_usage')
      .select('organization_id, workspace_id, used_bytes, asset_count')
      .eq('organization_id', context.organizationId)
      .eq('workspace_id', context.workspaceId)
      .maybeSingle();
    if (error) throw new Error('Unable to load creative storage usage');
    const { data: quota, error: quotaError } = await supabase
      .from('marketing_creative_storage_quotas')
      .select('quota_bytes')
      .eq('organization_id', context.organizationId)
      .eq('workspace_id', context.workspaceId)
      .maybeSingle();
    if (quotaError) throw new Error('Unable to load creative storage quota');
    return MarketingCreativeStorageUsageSchema.parse({
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      usedBytes: data?.used_bytes ?? 0,
      assetCount: data?.asset_count ?? 0,
      quotaBytes: quota?.quota_bytes ?? DEFAULT_QUOTA_BYTES,
      indexedDbIsCacheOnly: true,
    });
  }

  async cleanup(context: MarketingRepositoryContext, now = new Date()) {
    assertAccess(context, 'edit');
    const assets = await this.listAssets(context);
    const references = await this.listReferences(context);
    const referenced = new Set(references.map((reference) => reference.assetId));
    const removable = assets.filter((asset) =>
      !referenced.has(asset.id)
      && (
        (asset.kind === 'export' && asset.expiresAt && new Date(asset.expiresAt).getTime() <= now.getTime())
        || (asset.status === 'orphaned' && asset.orphanedAt
          && new Date(asset.orphanedAt).getTime()
            <= now.getTime() - CREATIVE_STUDIO_CAPACITY_LIMITS.orphanGracePeriodHours * 60 * 60 * 1_000)
      ),
    );
    const supabase = await getSupabase();
    const { data, error } = await supabase.rpc('cleanup_marketing_creative_assets', {
      target_organization_id: context.organizationId,
      target_workspace_id: context.workspaceId,
      orphan_before: new Date(
        now.getTime() - CREATIVE_STUDIO_CAPACITY_LIMITS.orphanGracePeriodHours * 60 * 60 * 1_000,
      ).toISOString(),
    });
    if (error) throw new Error('Unable to clean up creative assets');
    const removedIds = new Set(data ?? []);
    const removedPaths = removable
      .filter((asset) => removedIds.has(asset.id))
      .map((asset) => asset.storagePath);
    if (removedPaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('marketing-creative')
        .remove(removedPaths);
      if (storageError) throw new Error('Unable to remove creative Storage objects');
    }
    return [...removedIds];
  }
}

const CREATIVE_ASSET_COLUMNS =
  'id, organization_id, brand_id, workspace_id, project_id, kind, status, storage_path, mime_type, size_bytes, content_hash, source_asset_id, compressed, width, height, expires_at, orphaned_at, created_by, updated_by, created_at, updated_at';
const CREATIVE_ASSET_REFERENCE_COLUMNS =
  'id, organization_id, brand_id, workspace_id, asset_id, project_id, project_version_id, variant_id, layer_id, reference_type, created_by, created_at';

type CreativeAssetRow = {
  id: string; organization_id: string; brand_id: string; workspace_id: string; project_id: string | null;
  kind: string; status: string; storage_path: string; mime_type: string; size_bytes: number; content_hash: string;
  source_asset_id: string | null; compressed: boolean; width: number | null; height: number | null;
  expires_at: string | null; orphaned_at: string | null; created_by: string | null; updated_by: string | null;
  created_at: string; updated_at: string;
};
type CreativeAssetReferenceRow = {
  id: string; organization_id: string; brand_id: string; workspace_id: string; asset_id: string; project_id: string;
  project_version_id: string | null; variant_id: string | null; layer_id: string | null; reference_type: string;
  created_by: string | null; created_at: string;
};

function mapAsset(row: CreativeAssetRow): MarketingCreativeAsset {
  return MarketingCreativeAssetSchema.parse({
    id: row.id, organizationId: row.organization_id, brandId: row.brand_id, workspaceId: row.workspace_id,
    projectId: row.project_id, kind: row.kind, status: row.status, storagePath: row.storage_path,
    mimeType: row.mime_type, sizeBytes: row.size_bytes, contentHash: row.content_hash,
    sourceAssetId: row.source_asset_id, compressed: row.compressed, width: row.width, height: row.height,
    expiresAt: row.expires_at, orphanedAt: row.orphaned_at, createdBy: row.created_by, updatedBy: row.updated_by,
    createdAt: row.created_at, updatedAt: row.updated_at,
  });
}

function mapReference(row: CreativeAssetReferenceRow): MarketingCreativeAssetReference {
  return MarketingCreativeAssetReferenceSchema.parse({
    id: row.id, organizationId: row.organization_id, brandId: row.brand_id, workspaceId: row.workspace_id,
    assetId: row.asset_id, projectId: row.project_id, projectVersionId: row.project_version_id,
    variantId: row.variant_id, layerId: row.layer_id, referenceType: row.reference_type,
    createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.created_at,
  });
}

async function getSupabase() {
  return import('@/lib/supabase/server').then(({ createServerSupabaseClient }) =>
    createServerSupabaseClient(),
  );
}
