import { CreateMarketingCampaignSchema, MarketingCampaignSchema, UpdateMarketingCampaignSchema } from '@loopdev/contracts';
import type { CreateMarketingCampaignInput, MarketingCampaign, UpdateMarketingCampaignInput } from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const campaignColumns = [
  'id',
  'organization_id',
  'brand_id',
  'workspace_id',
  'brand_version_id',
  'name',
  'objective',
  'status',
  'starts_at',
  'ends_at',
  'budget',
  'currency',
  'created_by',
  'updated_by',
  'created_at',
  'updated_at',
].join(', ');

type CampaignRow = {
  id: string;
  organization_id: string;
  brand_id: string;
  workspace_id: string;
  brand_version_id: string | null;
  name: string;
  objective: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  budget: number | null;
  currency: string;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

function mapCampaign(row: CampaignRow): MarketingCampaign {
  return MarketingCampaignSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    brandId: row.brand_id,
    workspaceId: row.workspace_id,
    brandVersionId: row.brand_version_id,
    name: row.name,
    objective: row.objective,
    status: row.status,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    budget: row.budget,
    currency: row.currency,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function listMarketingCampaigns(organizationId: string, workspaceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('marketing_campaign_records')
    .select(campaignColumns)
    .eq('organization_id', organizationId)
    .eq('workspace_id', workspaceId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error('Unable to load marketing campaigns');
  return ((data ?? []) as unknown as CampaignRow[]).map(mapCampaign);
}

export async function createMarketingCampaign(input: CreateMarketingCampaignInput, userId: string) {
  const parsed = CreateMarketingCampaignSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('marketing_campaign_records')
    .insert({
      organization_id: parsed.organizationId,
      brand_id: parsed.brandId,
      workspace_id: parsed.workspaceId,
      brand_version_id: parsed.brandVersionId ?? null,
      name: parsed.name,
      objective: parsed.objective,
      status: parsed.status,
      starts_at: parsed.startsAt ?? null,
      ends_at: parsed.endsAt ?? null,
      budget: parsed.budget ?? null,
      currency: parsed.currency,
      created_by: userId,
      updated_by: userId,
    })
    .select(campaignColumns)
    .single();

  if (error) throw new Error('Unable to create marketing campaign');
  return mapCampaign(data as unknown as CampaignRow);
}

export async function updateMarketingCampaign(input: UpdateMarketingCampaignInput, userId: string) {
  const parsed = UpdateMarketingCampaignSchema.parse(input);
  const { organizationId, workspaceId, campaignId, ...updates } = parsed;
  const databaseUpdates = {
    ...(updates.brandId !== undefined ? { brand_id: updates.brandId } : {}),
    ...(updates.brandVersionId !== undefined ? { brand_version_id: updates.brandVersionId } : {}),
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.objective !== undefined ? { objective: updates.objective } : {}),
    ...(updates.status !== undefined ? { status: updates.status } : {}),
    ...(updates.startsAt !== undefined ? { starts_at: updates.startsAt } : {}),
    ...(updates.endsAt !== undefined ? { ends_at: updates.endsAt } : {}),
    ...(updates.budget !== undefined ? { budget: updates.budget } : {}),
    ...(updates.currency !== undefined ? { currency: updates.currency } : {}),
    updated_by: userId,
  };
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('marketing_campaign_records')
    .update(databaseUpdates)
    .eq('id', campaignId)
    .eq('organization_id', organizationId)
    .eq('workspace_id', workspaceId)
    .select(campaignColumns)
    .single();

  if (error) throw new Error('Unable to update marketing campaign');
  return mapCampaign(data as unknown as CampaignRow);
}

export async function deleteMarketingCampaign(organizationId: string, workspaceId: string, campaignId: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('marketing_campaign_records')
    .delete()
    .eq('id', campaignId)
    .eq('organization_id', organizationId)
    .eq('workspace_id', workspaceId);

  if (error) throw new Error('Unable to delete marketing campaign');
}
