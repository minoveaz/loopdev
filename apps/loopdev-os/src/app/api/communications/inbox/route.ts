import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { listCommunicationInbox } from '@/services/communications/inbox';

const querySchema = z.object({
  organizationId: z.string().uuid(),
});

async function authorizeCommunicationRead(organizationId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allowed: false as const, status: 401 as const };

  const { data, error } = await supabase.rpc('has_organization_permission', {
    target_organization_id: organizationId,
    required_permission: 'communications.read',
  });
  if (error || data !== true) return { allowed: false as const, status: 403 as const };

  return { allowed: true as const, userId: user.id };
}

export async function GET(request: Request) {
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid communications inbox query' }, { status: 400 });
  }

  const access = await authorizeCommunicationRead(parsed.data.organizationId);
  if (!access.allowed)
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });

  try {
    const model = await listCommunicationInbox(parsed.data.organizationId, access.userId);
    return NextResponse.json({ model });
  } catch {
    return NextResponse.json({ error: 'Unable to load communications inbox' }, { status: 500 });
  }
}
