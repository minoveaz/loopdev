import { BrandContextSnapshotSchema } from '@loopdev/contracts';
import type { BrandContextSnapshot } from '@loopdev/contracts';
import { BrandContextVersionSchema } from '@loopdev/contracts';
import type { BrandContextVersion } from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const brandContextColumns = [
  'id',
  'organization_id',
  'name',
  'description',
  'status',
  'logo_url',
  'identity',
  'palette',
  'typography',
  'logos',
  'rules_engine',
  'created_at',
  'updated_at',
  'created_by',
].join(', ');

type BrandContextRow = {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  logo_url: string | null;
  identity: unknown;
  palette: unknown;
  typography: unknown;
  logos: unknown;
  rules_engine: unknown;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export async function getBrandContextSnapshot(
  organizationId: string,
  brandId: string,
): Promise<BrandContextSnapshot | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('brands')
    .select(brandContextColumns)
    .eq('organization_id', organizationId)
    .eq('id', brandId)
    .maybeSingle();

  if (error) throw new Error('Unable to load brand context');
  if (!data) return null;

  const { data: publishedVersion, error: versionError } = await supabase
    .from('brand_context_versions')
    .select('id, version_number, status, snapshot, published_at')
    .eq('organization_id', organizationId)
    .eq('brand_id', brandId)
    .eq('status', 'published')
    .order('version_number', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (versionError) throw new Error('Unable to load published brand context version');

  const row = data as unknown as BrandContextRow;
  const snapshot = BrandContextSnapshotSchema.parse({
    organizationId,
    brand: {
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      description: row.description ?? undefined,
      status: row.status,
      logoUrl: row.logo_url,
      identity: isRecord(row.identity) ? row.identity : undefined,
      palette: isRecord(row.palette) ? row.palette : undefined,
      typography: isRecord(row.typography) ? row.typography : undefined,
      logos: isRecord(row.logos) ? row.logos : undefined,
      rulesEngine: isRecord(row.rules_engine) ? row.rules_engine : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
    },
    version: {
      id: publishedVersion?.id ?? null,
      number: publishedVersion?.version_number ?? null,
      status: publishedVersion?.status ?? 'draft',
      publishedAt: publishedVersion?.published_at ?? null,
    },
    assets: [],
    approvedClaims: [],
    forbiddenClaims: [],
    rules: {
      engine: isRecord(row.rules_engine) ? row.rules_engine : undefined,
      evaluatedAt: null,
    },
    generatedAt: new Date().toISOString(),
  });

  return snapshot;
}

export async function publishBrandContextVersion(
  organizationId: string,
  brandId: string,
  userId: string,
): Promise<BrandContextVersion> {
  const supabase = await createServerSupabaseClient();
  const current = await getBrandContextSnapshot(organizationId, brandId);
  if (!current) throw new Error('Brand not found');

  const { data: latest, error: latestError } = await supabase
    .from('brand_context_versions')
    .select('version_number')
    .eq('organization_id', organizationId)
    .eq('brand_id', brandId)
    .order('version_number', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (latestError) throw new Error('Unable to determine brand version');

  const versionNumber = (latest?.version_number ?? 0) + 1;
  const publishedAt = new Date().toISOString();
  const snapshot = {
    ...current,
    version: {
      id: null,
      number: versionNumber,
      status: 'published' as const,
      publishedAt,
    },
    generatedAt: publishedAt,
  };

  const { error: demoteError } = await supabase
    .from('brand_context_versions')
    .update({ status: 'approved' })
    .eq('organization_id', organizationId)
    .eq('brand_id', brandId)
    .eq('status', 'published');
  if (demoteError) throw new Error('Unable to close previous brand version');

  const { data, error } = await supabase
    .from('brand_context_versions')
    .insert({
      organization_id: organizationId,
      brand_id: brandId,
      version_number: versionNumber,
      status: 'published',
      snapshot: toJson(snapshot),
      published_at: publishedAt,
      created_by: userId,
    })
    .select(
      'id, organization_id, brand_id, version_number, status, snapshot, published_at, created_by, created_at',
    )
    .single();
  if (error) throw new Error('Unable to publish brand context');

  return BrandContextVersionSchema.parse({
    id: data.id,
    organizationId: data.organization_id,
    brandId: data.brand_id,
    versionNumber: data.version_number,
    status: data.status,
    snapshot: data.snapshot,
    publishedAt: data.published_at,
    createdBy: data.created_by,
    createdAt: data.created_at,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toJson(value: unknown): import('@/types/database.types').Json {
  return JSON.parse(JSON.stringify(value)) as import('@/types/database.types').Json;
}
