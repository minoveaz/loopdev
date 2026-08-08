import { NextResponse } from 'next/server';
import { getBrandContextSnapshot } from '@/services/marketing/brandContext';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(
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

  const { data: allowed, error: permissionError } = await supabase.rpc('has_organization_permission', {
    target_organization_id: organizationId,
    required_permission: 'marketing.read',
  });
  if (permissionError || allowed !== true) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const snapshot = await getBrandContextSnapshot(organizationId, brandId);
    if (!snapshot) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    return NextResponse.json(snapshot);
  } catch {
    return NextResponse.json({ error: 'Unable to load brand context' }, { status: 500 });
  }
}
