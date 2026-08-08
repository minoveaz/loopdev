import { ContentBriefSchema, CreateContentBriefSchema } from '@loopdev/contracts';
import type { ContentBrief, CreateContentBriefInput } from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const briefColumns = 'id, organization_id, brand_id, brand_version_id, workspace_id, campaign_id, name, objective, audience, locale, call_to_action, created_by, updated_by, created_at, updated_at';

type BriefRow = Record<string, unknown>;

function mapBrief(row: BriefRow): ContentBrief {
  return ContentBriefSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    brandId: row.brand_id,
    brandVersionId: row.brand_version_id,
    workspaceId: row.workspace_id,
    campaignId: row.campaign_id,
    name: row.name,
    objective: row.objective,
    audience: row.audience,
    locale: row.locale,
    callToAction: row.call_to_action,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function listContentBriefs(organizationId: string, brandId: string, workspaceId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('content_briefs').select(briefColumns)
    .eq('organization_id', organizationId).eq('brand_id', brandId).order('updated_at', { ascending: false });
  if (workspaceId) query = query.eq('workspace_id', workspaceId);
  const { data, error } = await query;
  if (error) throw new Error('Unable to load content briefs');
  return ((data ?? []) as unknown as BriefRow[]).map(mapBrief);
}

export async function createContentBrief(input: CreateContentBriefInput, userId: string) {
  const parsed = CreateContentBriefSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const { data: publishedVersion } = await supabase.from('brand_context_versions').select('id')
    .eq('organization_id', parsed.organizationId).eq('brand_id', parsed.brandId)
    .eq('status', 'published').order('version_number', { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase.from('content_briefs').insert({
    organization_id: parsed.organizationId, brand_id: parsed.brandId,
    brand_version_id: parsed.brandVersionId ?? publishedVersion?.id ?? null,
    workspace_id: parsed.workspaceId ?? null, campaign_id: parsed.campaignId ?? null,
    name: parsed.name, objective: parsed.objective, audience: parsed.audience ?? null,
    locale: parsed.locale, call_to_action: parsed.callToAction ?? null,
    created_by: userId, updated_by: userId,
  }).select(briefColumns).single();
  if (error) throw new Error('Unable to create content brief');
  return mapBrief(data as unknown as BriefRow);
}
