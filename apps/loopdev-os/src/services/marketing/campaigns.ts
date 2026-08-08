import { CreateMarketingCampaignSchema, MarketingCampaignSchema } from '@loopdev/contracts';
import type { CreateMarketingCampaignInput, MarketingCampaign } from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const campaignColumns = [
  'id',
  'organization_id',
  'brand_id',
  'workspace_id',
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
