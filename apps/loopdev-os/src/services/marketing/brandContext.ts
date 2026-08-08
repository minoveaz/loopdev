import { BrandContextSnapshotSchema } from '@loopdev/contracts';
import type { BrandContextSnapshot } from '@loopdev/contracts';
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
