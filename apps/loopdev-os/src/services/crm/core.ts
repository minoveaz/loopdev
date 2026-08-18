import {
  CrmContactSchema,
  CrmContactPageSchema,
  CrmContactQuerySchema,
  CrmCreateContactCommandSchema,
  CrmUpdateContactCommandSchema,
} from '@loopdev/contracts';
import type {
  CrmContact,
  CrmContactPage,
  CrmContactQuery,
  CrmCreateContactCommand,
  CrmUpdateContactCommand,
} from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type ContactRow = {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
};

const contactColumns =
  'id, organization_id, first_name, last_name, email, phone, company_name, created_at, updated_at';

export function normalizeEmail(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();
  return normalized || null;
}

export function normalizePhone(value: string | null | undefined) {
  const normalized = value?.trim().replace(/[\s().-]/g, '');
  return normalized || null;
}

function mapContact(row: ContactRow): CrmContact {
  return CrmContactSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    companyName: row.company_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export type UpsertContactInput = {
  organizationId: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
};

export async function getContactById(
  organizationId: string,
  contactId: string,
): Promise<CrmContact | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_contacts')
    .select(contactColumns)
    .eq('id', contactId)
    .eq('organization_id', organizationId)
    .maybeSingle();
  if (error) throw new Error('Unable to resolve CRM contact');
  return data ? mapContact(data as unknown as ContactRow) : null;
}

export async function findOrCreateContact(input: UpsertContactInput): Promise<CrmContact> {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const supabase = await createServerSupabaseClient();

  const findExisting = async (column: 'email' | 'phone', value: string) => {
    const { data, error } = await supabase
      .from('crm_contacts')
      .select(contactColumns)
      .eq('organization_id', input.organizationId)
      .eq(column, value)
      .maybeSingle();
    if (error) throw new Error('Unable to resolve existing CRM contact');
    return data as unknown as ContactRow | null;
  };

  const existing =
    (email && (await findExisting('email', email))) ||
    (phone && (await findExisting('phone', phone)));
  if (existing) return mapContact(existing);

  const { data, error } = await supabase
    .from('crm_contacts')
    .insert({
      organization_id: input.organizationId,
      first_name: input.firstName.trim(),
      last_name: input.lastName?.trim() || null,
      email,
      phone,
      company_name: input.companyName?.trim() || null,
    })
    .select(contactColumns)
    .single();
  if (error) throw new Error('Unable to create CRM contact');
  return mapContact(data as unknown as ContactRow);
}

export async function listContacts(input: CrmContactQuery): Promise<CrmContactPage> {
  const parsed = CrmContactQuerySchema.parse(input);
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('crm_contacts')
    .select(contactColumns)
    .eq('organization_id', parsed.organizationId)
    .order('id', { ascending: true })
    .limit(parsed.limit + 1);

  if (parsed.cursor) query = query.gt('id', parsed.cursor);
  if (parsed.query) {
    const term = parsed.query.replaceAll(',', ' ');
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM contacts');
  const rows = (data ?? []) as unknown as ContactRow[];
  const hasMore = rows.length > parsed.limit;
  const items = rows.slice(0, parsed.limit).map(mapContact);
  return CrmContactPageSchema.parse({
    items,
    nextCursor: hasMore ? (items.at(-1)?.id ?? null) : null,
    hasMore,
  });
}

export async function createContact(input: CrmCreateContactCommand): Promise<CrmContact> {
  const parsed = CrmCreateContactCommandSchema.parse(input);
  return findOrCreateContact({
    organizationId: parsed.organizationId,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    email: parsed.email,
    phone: parsed.phone,
    companyName: parsed.companyName,
  });
}

export async function updateContact(input: CrmUpdateContactCommand): Promise<CrmContact> {
  const parsed = CrmUpdateContactCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const changes = {
    ...(parsed.firstName !== undefined ? { first_name: parsed.firstName } : {}),
    ...(parsed.lastName !== undefined ? { last_name: parsed.lastName } : {}),
    ...(parsed.email !== undefined ? { email: normalizeEmail(parsed.email) } : {}),
    ...(parsed.phone !== undefined ? { phone: normalizePhone(parsed.phone) } : {}),
    ...(parsed.companyName !== undefined ? { company_name: parsed.companyName } : {}),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from('crm_contacts')
    .update(changes)
    .eq('id', parsed.contactId)
    .eq('organization_id', parsed.organizationId)
    .eq('updated_at', parsed.expectedUpdatedAt)
    .select(contactColumns)
    .maybeSingle();
  if (error) throw new Error('Unable to update CRM contact');
  if (!data) throw new Error('CRM contact update conflict or not found');
  return mapContact(data as unknown as ContactRow);
}
