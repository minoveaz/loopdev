import { NextResponse } from 'next/server';
import { CreateContentBriefSchema } from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createContentBrief, listContentBriefs } from '@/services/marketing/content';

async function authorize(organizationId: string, permission: 'marketing.read' | 'marketing.manage') {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false as const, status: 401 as const };
  const { data, error } = await supabase.rpc('has_organization_permission', { target_organization_id: organizationId, required_permission: permission });
  if (error || data !== true) return { allowed: false as const, status: 403 as const };
  return { allowed: true as const, userId: user.id };
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const organizationId = params.get('organizationId');
  const brandId = params.get('brandId');
  if (!organizationId || !brandId) return NextResponse.json({ error: 'organizationId and brandId are required' }, { status: 400 });
  const access = await authorize(organizationId, 'marketing.read');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await listContentBriefs(organizationId, brandId, params.get('workspaceId') ?? undefined)); }
  catch { return NextResponse.json({ error: 'Unable to load content briefs' }, { status: 500 }); }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CreateContentBriefSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid content brief payload', details: parsed.error.flatten() }, { status: 400 });
  const access = await authorize(parsed.data.organizationId, 'marketing.manage');
  if (!access.allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try { return NextResponse.json(await createContentBrief(parsed.data, access.userId), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Unable to create content brief' }, { status: 500 }); }
}
