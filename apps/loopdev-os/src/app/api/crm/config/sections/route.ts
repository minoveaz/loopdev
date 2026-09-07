import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CrmSectionFieldConfigSchema } from '@loopdev/contracts';
import { authorizeCrm } from '../../_lib/access';
import { getSectionFieldConfig, saveSectionFieldConfig } from '@/services/crm/section-config';

const QuerySchema = z.object({
  organizationId: z.string().uuid(),
  sectionKey: z.string().min(1),
});

export async function GET(request: Request) {
  const parsed = QuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  }

  try {
    const config = await getSectionFieldConfig(parsed.data.organizationId, parsed.data.sectionKey);
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load section field config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CrmSectionFieldConfigSchema.safeParse(body);
  if (!parsed.success || !parsed.data.organizationId) {
    return NextResponse.json({ error: 'Invalid section field config body' }, { status: 400 });
  }

  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  }

  try {
    const saved = await saveSectionFieldConfig(parsed.data.organizationId, parsed.data);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json({ error: 'Unable to save section field config' }, { status: 500 });
  }
}
