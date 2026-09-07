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
  second_last_name?: string | null;
  preferred_name?: string | null;
  email: string | null;
  secondary_email?: string | null;
  phone: string | null;
  secondary_phone?: string | null;
  preferred_channel?: string | null;
  preferred_language?: string | null;
  document_type?: string | null;
  document_number?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state_province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  company_name: string | null;
  job_title?: string | null;
  department?: string | null;
  attributes?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

const contactColumns =
  'id, organization_id, first_name, last_name, second_last_name, preferred_name, email, secondary_email, phone, secondary_phone, preferred_channel, preferred_language, document_type, document_number, birth_date, gender, address_line1, address_line2, city, state_province, postal_code, country, company_name, job_title, department, attributes, created_at, updated_at';

function timestamp(value: string): string {
  return new Date(value).toISOString();
}

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
    secondLastName: row.second_last_name,
    preferredName: row.preferred_name,
    email: row.email,
    secondaryEmail: row.secondary_email,
    phone: row.phone,
    secondaryPhone: row.secondary_phone,
    preferredChannel: row.preferred_channel as CrmContact['preferredChannel'],
    preferredLanguage: row.preferred_language ?? 'es',
    documentType: row.document_type,
    documentNumber: row.document_number,
    birthDate: row.birth_date,
    gender: row.gender,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    stateProvince: row.state_province,
    postalCode: row.postal_code,
    country: row.country ?? 'ES',
    companyName: row.company_name,
    jobTitle: row.job_title,
    department: row.department,
    attributes: row.attributes ?? {},
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });
}

export type UpsertContactInput = {
  organizationId: string;
  firstName: string;
  lastName?: string | null;
  secondLastName?: string | null;
  preferredName?: string | null;
  email?: string | null;
  secondaryEmail?: string | null;
  phone?: string | null;
  secondaryPhone?: string | null;
  preferredChannel?: 'whatsapp' | 'phone' | 'email' | null;
  preferredLanguage?: string | null;
  documentType?: string | null;
  documentNumber?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  postalCode?: string | null;
  country?: string | null;
  companyName?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  attributes?: Record<string, unknown>;
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
      second_last_name: input.secondLastName?.trim() || null,
      preferred_name: input.preferredName?.trim() || null,
      email,
      secondary_email: normalizeEmail(input.secondaryEmail),
      phone,
      secondary_phone: normalizePhone(input.secondaryPhone),
      preferred_channel: input.preferredChannel || null,
      preferred_language: input.preferredLanguage || 'es',
      document_type: input.documentType || null,
      document_number: input.documentNumber?.trim() || null,
      birth_date: input.birthDate || null,
      gender: input.gender || null,
      address_line1: input.addressLine1?.trim() || null,
      address_line2: input.addressLine2?.trim() || null,
      city: input.city?.trim() || null,
      state_province: input.stateProvince?.trim() || null,
      postal_code: input.postalCode?.trim() || null,
      country: input.country || 'ES',
      company_name: input.companyName?.trim() || null,
      job_title: input.jobTitle?.trim() || null,
      department: input.department?.trim() || null,
      attributes: input.attributes || {},
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
    secondLastName: parsed.secondLastName,
    preferredName: parsed.preferredName,
    email: parsed.email,
    secondaryEmail: parsed.secondaryEmail,
    phone: parsed.phone,
    secondaryPhone: parsed.secondaryPhone,
    preferredChannel: parsed.preferredChannel,
    preferredLanguage: parsed.preferredLanguage,
    documentType: parsed.documentType,
    documentNumber: parsed.documentNumber,
    birthDate: parsed.birthDate,
    gender: parsed.gender,
    addressLine1: parsed.addressLine1,
    addressLine2: parsed.addressLine2,
    city: parsed.city,
    stateProvince: parsed.stateProvince,
    postalCode: parsed.postalCode,
    country: parsed.country,
    companyName: parsed.companyName,
    jobTitle: parsed.jobTitle,
    department: parsed.department,
    attributes: parsed.attributes ?? {},
  });
}

export async function updateContact(input: CrmUpdateContactCommand): Promise<CrmContact> {
  const parsed = CrmUpdateContactCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const changes = {
    ...(parsed.firstName !== undefined ? { first_name: parsed.firstName } : {}),
    ...(parsed.lastName !== undefined ? { last_name: parsed.lastName } : {}),
    ...(parsed.secondLastName !== undefined ? { second_last_name: parsed.secondLastName } : {}),
    ...(parsed.preferredName !== undefined ? { preferred_name: parsed.preferredName } : {}),
    ...(parsed.email !== undefined ? { email: normalizeEmail(parsed.email) } : {}),
    ...(parsed.secondaryEmail !== undefined ? { secondary_email: normalizeEmail(parsed.secondaryEmail) } : {}),
    ...(parsed.phone !== undefined ? { phone: normalizePhone(parsed.phone) } : {}),
    ...(parsed.secondaryPhone !== undefined ? { secondary_phone: normalizePhone(parsed.secondaryPhone) } : {}),
    ...(parsed.preferredChannel !== undefined ? { preferred_channel: parsed.preferredChannel } : {}),
    ...(parsed.preferredLanguage !== undefined ? { preferred_language: parsed.preferredLanguage } : {}),
    ...(parsed.documentType !== undefined ? { document_type: parsed.documentType } : {}),
    ...(parsed.documentNumber !== undefined ? { document_number: parsed.documentNumber } : {}),
    ...(parsed.birthDate !== undefined ? { birth_date: parsed.birthDate } : {}),
    ...(parsed.gender !== undefined ? { gender: parsed.gender } : {}),
    ...(parsed.addressLine1 !== undefined ? { address_line1: parsed.addressLine1 } : {}),
    ...(parsed.addressLine2 !== undefined ? { address_line2: parsed.addressLine2 } : {}),
    ...(parsed.city !== undefined ? { city: parsed.city } : {}),
    ...(parsed.stateProvince !== undefined ? { state_province: parsed.stateProvince } : {}),
    ...(parsed.postalCode !== undefined ? { postal_code: parsed.postalCode } : {}),
    ...(parsed.country !== undefined ? { country: parsed.country } : {}),
    ...(parsed.companyName !== undefined ? { company_name: parsed.companyName } : {}),
    ...(parsed.jobTitle !== undefined ? { job_title: parsed.jobTitle } : {}),
    ...(parsed.department !== undefined ? { department: parsed.department } : {}),
    ...(parsed.attributes !== undefined ? { attributes: parsed.attributes } : {}),
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
