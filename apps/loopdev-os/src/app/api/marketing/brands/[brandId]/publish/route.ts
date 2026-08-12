import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { publishBrandContextVersion } from '@/services/marketing/brandContext';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ brandId: string }> },
) {
  const organizationId = new URL(request.url).searchParams.get('organizationId');
  const { brandId } = await params;
  if (!organizationId || !brandId) {
    return NextResponse.json({ error: 'organizationId and brandId are required' }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: allowed, error } = await supabase.rpc('has_organization_permission', {
    target_organization_id: organizationId,
    required_permission: 'marketing.manage',
  });
  if (error || allowed !== true) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    return NextResponse.json(await publishBrandContextVersion(organizationId, brandId, user.id), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to publish brand context' }, { status: 500 });
  }
}
