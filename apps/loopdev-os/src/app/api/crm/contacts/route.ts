import { NextResponse } from 'next/server';
import {
  CrmContactQuerySchema,
  CrmCreateContactCommandSchema,
  CrmUpdateContactCommandSchema,
} from '@loopdev/contracts';
import { authorizeCrm } from '../_lib/access';
import { createContact, listContacts, updateContact } from '@/services/crm/core';

function serviceErrorResponse(error: unknown, fallback: string) {
  if (error instanceof Error && error.message === 'CRM contact update conflict or not found') {
    return NextResponse.json({ error: 'Contact not found or has changed' }, { status: 409 });
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export async function GET(request: Request) {
  const parsed = CrmContactQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid CRM contact query' }, { status: 400 });
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.read');
  if (!access.allowed)
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await listContacts(parsed.data));
  } catch (error) {
    return serviceErrorResponse(error, 'Unable to list CRM contacts');
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CrmCreateContactCommandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid CRM contact command' }, { status: 400 });
  }
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await createContact(parsed.data), { status: 201 });
  } catch (error) {
    return serviceErrorResponse(error, 'Unable to create CRM contact');
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CrmUpdateContactCommandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid CRM contact update' }, { status: 400 });
  }
  const access = await authorizeCrm(parsed.data.organizationId, 'crm.manage');
  if (!access.allowed)
    return NextResponse.json({ error: 'Unauthorized' }, { status: access.status });
  try {
    return NextResponse.json(await updateContact(parsed.data));
  } catch (error) {
    return serviceErrorResponse(error, 'Unable to update CRM contact');
  }
}
