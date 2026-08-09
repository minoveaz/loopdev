import { NextResponse } from 'next/server';
import { CreateMarketingCampaignSchema, MarketingIdSchema, UpdateMarketingCampaignSchema } from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createMarketingCampaign, deleteMarketingCampaign, listMarketingCampaigns, updateMarketingCampaign } from '@/services/marketing/campaigns';

async function authorizeMarketing(organizationId: string, permission: 'marketing.read' | 'marketing.manage') {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false as const, status: 401 as const };

  const { data, error } = await supabase.rpc('has_organization_permission', {
    target_organization_id: organizationId,
    required_permission: permission,
  });
  if (error || data !== true) return { allowed: false as const, status: 403 as const };
  return { allowed: true as const, userId: user.id };
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const organizationId = params.get('organizationId');
  const workspaceId = params.get('workspaceId');
  if (!organizationId || !workspaceId) {
    return NextResponse.json({ error: 'organizationId and workspaceId are required' }, { status: 400 });
  }

  const access = await authorizeMarketing(organizationId, 'marketing.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });

  try {
    return NextResponse.json(await listMarketingCampaigns(organizationId, workspaceId));
  } catch {
    return NextResponse.json({ error: 'Unable to load marketing campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CreateMarketingCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid marketing campaign payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const access = await authorizeMarketing(parsed.data.organizationId, 'marketing.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });

  try {
    return NextResponse.json(await createMarketingCampaign(parsed.data, access.userId), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to create marketing campaign' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = UpdateMarketingCampaignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid marketing campaign payload', details: parsed.error.flatten() }, { status: 400 });

  const access = await authorizeMarketing(parsed.data.organizationId, 'marketing.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });

  try {
    return NextResponse.json(await updateMarketingCampaign(parsed.data, access.userId));
  } catch {
    return NextResponse.json({ error: 'Unable to update marketing campaign' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const params = new URL(request.url).searchParams;
  const organizationId = MarketingIdSchema.safeParse(params.get('organizationId'));
  const workspaceId = MarketingIdSchema.safeParse(params.get('workspaceId'));
  const campaignId = MarketingIdSchema.safeParse(params.get('campaignId'));
  if (!organizationId.success || !workspaceId.success || !campaignId.success) {
    return NextResponse.json({ error: 'organizationId, workspaceId and campaignId are required' }, { status: 400 });
  }

  const access = await authorizeMarketing(organizationId.data, 'marketing.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });

  try {
    await deleteMarketingCampaign(organizationId.data, workspaceId.data, campaignId.data);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Unable to delete marketing campaign' }, { status: 500 });
  }
}
