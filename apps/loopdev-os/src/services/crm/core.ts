import {
  CrmContactSchema,
  CrmCreateLeadCommandSchema,
  CrmLeadSchema,
  CrmOpportunitySchema,
} from '@loopdev/contracts';
import type { CrmContact, CrmCreateLeadCommand, CrmLead, CrmOpportunity } from '@loopdev/contracts';
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

type LeadRow = {
  id: string;
  organization_id: string;
  contact_id: string;
  brand_id: string | null;
  workspace_id: string | null;
  stage: string;
  status: string;
  source: string;
  campaign: string | null;
  assigned_to_user_id: string | null;
  created_at: string;
  updated_at: string;
};

type OpportunityRow = {
  id: string;
  organization_id: string;
  lead_id: string;
  workspace_id: string | null;
  name: string;
  stage: string;
  amount: number | null;
  currency: string;
  probability: number | null;
  expected_close_at: string | null;
  created_at: string;
  updated_at: string;
};

const contactColumns =
  'id, organization_id, first_name, last_name, email, phone, company_name, created_at, updated_at';
const leadColumns =
  'id, organization_id, contact_id, brand_id, workspace_id, stage, status, source, campaign, assigned_to_user_id, created_at, updated_at';
const opportunityColumns =
  'id, organization_id, lead_id, workspace_id, name, stage, amount, currency, probability, expected_close_at, created_at, updated_at';

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

function mapLead(row: LeadRow): CrmLead {
  return CrmLeadSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    contactId: row.contact_id,
    brandId: row.brand_id,
    workspaceId: row.workspace_id,
    stage: row.stage,
    status: row.status,
    source: row.source,
    campaign: row.campaign,
    assignedToUserId: row.assigned_to_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapOpportunity(row: OpportunityRow): CrmOpportunity {
  return CrmOpportunitySchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    leadId: row.lead_id,
    workspaceId: row.workspace_id,
    name: row.name,
    stage: row.stage,
    amount: row.amount,
    currency: row.currency,
    probability: row.probability,
    expectedCloseAt: row.expected_close_at,
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

export async function createLead(input: CrmCreateLeadCommand, userId: string): Promise<CrmLead> {
  const parsed = CrmCreateLeadCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_leads')
    .insert({
      organization_id: parsed.organizationId,
      contact_id: parsed.contactId,
      brand_id: parsed.brandId ?? null,
      workspace_id: parsed.workspaceId ?? null,
      source: parsed.source,
      campaign: parsed.campaign ?? null,
      assigned_to_user_id: userId,
    })
    .select(leadColumns)
    .single();
  if (error) throw new Error('Unable to create CRM lead');
  return mapLead(data as unknown as LeadRow);
}

export async function listLeads(organizationId: string, workspaceId?: string): Promise<CrmLead[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('crm_leads').select(leadColumns).eq('organization_id', organizationId);
  if (workspaceId) query = query.eq('workspace_id', workspaceId);
  const { data, error } = await query.order('updated_at', { ascending: false });
  if (error) throw new Error('Unable to load CRM leads');
  return ((data ?? []) as unknown as LeadRow[]).map(mapLead);
}

export async function createOpportunity(input: {
  organizationId: string;
  leadId: string;
  workspaceId?: string | null;
  name: string;
  amount?: number | null;
  currency?: string;
  probability?: number | null;
  expectedCloseAt?: string | null;
}): Promise<CrmOpportunity> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_opportunities')
    .insert({
      organization_id: input.organizationId,
      lead_id: input.leadId,
      workspace_id: input.workspaceId ?? null,
      name: input.name,
      amount: input.amount ?? null,
      currency: input.currency ?? 'EUR',
      probability: input.probability ?? null,
      expected_close_at: input.expectedCloseAt ?? null,
    })
    .select(opportunityColumns)
    .single();
  if (error) throw new Error('Unable to create CRM opportunity');
  return mapOpportunity(data as unknown as OpportunityRow);
}
