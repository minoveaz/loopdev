import {
  CrmCaptureLeadCommandSchema,
  CrmCreateLeadCommandSchema,
  CrmCreateOpportunityFromLeadCommandSchema,
  CrmLeadPageSchema,
  CrmLeadQuerySchema,
  CrmLeadSchema,
  CrmMoveLeadStatusCommandSchema,
  CrmOpportunitySchema,
  CrmUpdateLeadCommandSchema,
} from '@loopdev/contracts';
import type {
  CrmCaptureLeadCommand,
  CrmCreateLeadCommand,
  CrmCreateOpportunityFromLeadCommand,
  CrmLead,
  CrmLeadPage,
  CrmLeadQuery,
  CrmMoveLeadStatusCommand,
  CrmOpportunity,
  CrmUpdateLeadCommand,
} from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { findOrCreateContact, getContactById } from './core';

type LeadRow = {
  id: string;
  organization_id: string;
  contact_id: string;
  brand_id: string | null;
  workspace_id: string | null;
  status: string;
  source: string;
  source_provider: string | null;
  external_lead_id: string | null;
  campaign: string | null;
  interest: string | null;
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
  origin: string;
  product_key: string | null;
  amount: number | null;
  currency: string;
  probability: number | null;
  expected_close_at: string | null;
  created_at: string;
  updated_at: string;
};

const leadColumns =
  'id, organization_id, contact_id, brand_id, workspace_id, status, source, source_provider, external_lead_id, campaign, interest, assigned_to_user_id, created_at, updated_at';
const opportunityColumns =
  'id, organization_id, lead_id, workspace_id, name, stage, origin, product_key, amount, currency, probability, expected_close_at, created_at, updated_at';

// Leads that already produced a conversion Opportunity keep that status;
// moveLeadStatus never sets or clears it directly (CRM_LEAD_CONTRACT.md).
const MANUAL_TARGET_STATUSES = new Set(['nuevo', 'contactado', 'cualificado', 'estancado', 'inactivo']);

function mapLead(row: LeadRow): CrmLead {
  return CrmLeadSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    brandId: row.brand_id,
    contactId: row.contact_id,
    status: row.status,
    interest: row.interest,
    assignedUserId: row.assigned_to_user_id,
    source: {
      kind: row.source,
      provider: row.source_provider,
      externalId: row.external_lead_id,
      campaign: row.campaign,
      utm: {},
    },
    // Duplicate review is prepared in the Contact contract only; this slice
    // never links a review from the Lead read model yet.
    duplicateReviewId: null,
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
    origin: row.origin,
    productKey: row.product_key,
    amount: row.amount,
    currency: row.currency,
    probability: row.probability,
    expectedCloseAt: row.expected_close_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export function normalizeProductKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

export async function listLeads(input: CrmLeadQuery): Promise<CrmLeadPage> {
  const parsed = CrmLeadQuerySchema.parse(input);
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('crm_leads')
    .select(leadColumns)
    .eq('organization_id', parsed.organizationId)
    .order('id', { ascending: true })
    .limit(parsed.limit + 1);

  if (parsed.workspaceId) query = query.eq('workspace_id', parsed.workspaceId);
  if (parsed.status) query = query.eq('status', parsed.status);
  if (parsed.source) query = query.eq('source', parsed.source);
  if (parsed.assignedUserId) query = query.eq('assigned_to_user_id', parsed.assignedUserId);
  if (parsed.cursor) query = query.gt('id', parsed.cursor);

  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM leads');
  const rows = (data ?? []) as unknown as LeadRow[];
  const hasMore = rows.length > parsed.limit;
  const items = rows.slice(0, parsed.limit).map(mapLead);
  return CrmLeadPageSchema.parse({
    items,
    nextCursor: hasMore ? (items.at(-1)?.id ?? null) : null,
    hasMore,
  });
}

export async function getLead(organizationId: string, leadId: string): Promise<CrmLead | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_leads')
    .select(leadColumns)
    .eq('id', leadId)
    .eq('organization_id', organizationId)
    .maybeSingle();
  if (error) throw new Error('Unable to load CRM lead');
  return data ? mapLead(data as unknown as LeadRow) : null;
}

export async function createLead(input: CrmCreateLeadCommand): Promise<CrmLead> {
  const parsed = CrmCreateLeadCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_leads')
    .insert({
      organization_id: parsed.organizationId,
      contact_id: parsed.contactId,
      brand_id: parsed.brandId ?? null,
      workspace_id: parsed.workspaceId ?? null,
      status: 'nuevo',
      source: parsed.source.kind,
      source_provider: parsed.source.provider ?? null,
      external_lead_id: parsed.source.externalId ?? null,
      campaign: parsed.source.campaign ?? null,
      interest: parsed.interest ?? null,
      assigned_to_user_id: parsed.assignedUserId ?? null,
    })
    .select(leadColumns)
    .single();
  if (error) throw new Error('Unable to create CRM lead');
  return mapLead(data as unknown as LeadRow);
}

/**
 * Implements CRM_LEAD_CONTRACT.md `createLead`: accepts an existing
 * `contactId` or the input to create a new Contact, and is idempotent per
 * organization+source+externalId so provider retries never duplicate a Lead.
 */
export async function captureLead(command: CrmCaptureLeadCommand, actingUserId: string) {
  const parsed = CrmCaptureLeadCommandSchema.parse(command);
  const supabase = await createServerSupabaseClient();

  if (parsed.source.externalId) {
    const { data: existingLead, error: existingLeadError } = await supabase
      .from('crm_leads')
      .select(leadColumns)
      .eq('organization_id', parsed.organizationId)
      .eq('source', parsed.source.kind)
      .eq('external_lead_id', parsed.source.externalId)
      .maybeSingle();
    if (existingLeadError) throw new Error('Unable to resolve existing CRM lead');
    if (existingLead) {
      const leadRow = existingLead as unknown as LeadRow;
      const existingContact = await getContactById(parsed.organizationId, leadRow.contact_id);
      if (!existingContact) throw new Error('Unable to resolve existing CRM contact');
      return {
        contact: existingContact,
        lead: mapLead(leadRow),
        attribution: null,
        reused: true as const,
      };
    }
  }

  const contact = parsed.contactId
    ? await (async () => {
        const existing = await getContactById(parsed.organizationId, parsed.contactId as string);
        if (!existing) throw new Error('CRM contact required for lead capture');
        return existing;
      })()
    : await findOrCreateContact({
        organizationId: parsed.organizationId,
        firstName: parsed.firstName ?? '',
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        companyName: parsed.companyName,
      });

  const lead = await createLead({
    organizationId: parsed.organizationId,
    contactId: contact.id,
    brandId: parsed.brandId,
    workspaceId: parsed.workspaceId,
    interest: parsed.interest,
    assignedUserId: parsed.assignedUserId ?? actingUserId,
    source: parsed.source,
  });

  const { data: attribution, error } = await supabase
    .from('crm_lead_attributions')
    .insert({
      organization_id: parsed.organizationId,
      lead_id: lead.id,
      source: parsed.source.kind,
      provider: parsed.source.provider ?? null,
      campaign: parsed.source.campaign ?? null,
      medium: parsed.source.utm.medium ?? null,
      content: parsed.source.utm.content ?? null,
      term: parsed.source.utm.term ?? null,
    })
    .select()
    .single();
  if (error) {
    await supabase
      .from('crm_leads')
      .delete()
      .eq('id', lead.id)
      .eq('organization_id', parsed.organizationId);
    throw new Error('Unable to persist CRM lead attribution');
  }

  return { contact, lead, attribution, reused: false as const };
}

export async function updateLead(input: CrmUpdateLeadCommand): Promise<CrmLead> {
  const parsed = CrmUpdateLeadCommandSchema.parse(input);
  const supabase = await createServerSupabaseClient();
  const changes = {
    ...(parsed.interest !== undefined ? { interest: parsed.interest } : {}),
    ...(parsed.assignedUserId !== undefined ? { assigned_to_user_id: parsed.assignedUserId } : {}),
    ...(parsed.brandId !== undefined ? { brand_id: parsed.brandId } : {}),
    ...(parsed.workspaceId !== undefined ? { workspace_id: parsed.workspaceId } : {}),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from('crm_leads')
    .update(changes)
    .eq('id', parsed.leadId)
    .eq('organization_id', parsed.organizationId)
    .eq('updated_at', parsed.expectedUpdatedAt)
    .select(leadColumns)
    .maybeSingle();
  if (error) throw new Error('Unable to update CRM lead');
  if (!data) throw new Error('CRM lead update conflict or not found');
  return mapLead(data as unknown as LeadRow);
}

/**
 * Implements CRM_LEAD_CONTRACT.md `moveLeadStatus`. `convertido` is a side
 * effect of a successful `lead_conversion` Opportunity only (see
 * `createOpportunityFromLead`); it can never be a manual target here, and a
 * Lead already `convertido` cannot be moved away from it through this path.
 */
export async function moveLeadStatus(input: CrmMoveLeadStatusCommand): Promise<CrmLead> {
  const parsed = CrmMoveLeadStatusCommandSchema.parse(input);
  if (!MANUAL_TARGET_STATUSES.has(parsed.status)) {
    throw new Error('CRM lead status transition is not allowed');
  }
  const current = await getLead(parsed.organizationId, parsed.leadId);
  if (!current) throw new Error('CRM lead not found');
  if (current.status === 'convertido') {
    throw new Error('CRM lead status transition is not allowed');
  }
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_leads')
    .update({ status: parsed.status, updated_at: new Date().toISOString() })
    .eq('id', parsed.leadId)
    .eq('organization_id', parsed.organizationId)
    .eq('updated_at', parsed.expectedUpdatedAt)
    .select(leadColumns)
    .maybeSingle();
  if (error) throw new Error('Unable to update CRM lead status');
  if (!data) throw new Error('CRM lead update conflict or not found');
  return mapLead(data as unknown as LeadRow);
}

/**
 * Implements CRM_LEAD_CONTRACT.md `createOpportunityFromLead`. Idempotent per
 * (organization, lead, normalized product key): a repeated conversion for the
 * same product returns the existing Opportunity instead of creating a
 * duplicate, enforced at the database with a partial unique index so
 * concurrent retries cannot race past it. The first successful conversion
 * moves the Lead from `cualificado` to `convertido`.
 */
export async function createOpportunityFromLead(
  input: CrmCreateOpportunityFromLeadCommand,
): Promise<{ opportunity: CrmOpportunity; created: boolean }> {
  const parsed = CrmCreateOpportunityFromLeadCommandSchema.parse(input);
  const productKey = normalizeProductKey(parsed.productKey);
  const supabase = await createServerSupabaseClient();

  const lead = await getLead(parsed.organizationId, parsed.leadId);
  if (!lead) throw new Error('CRM lead not found');
  if (lead.status !== 'cualificado' && lead.status !== 'convertido') {
    throw new Error('CRM lead is not qualified for conversion');
  }

  const { data: existing, error: existingError } = await supabase
    .from('crm_opportunities')
    .select(opportunityColumns)
    .eq('organization_id', parsed.organizationId)
    .eq('lead_id', parsed.leadId)
    .eq('product_key', productKey)
    .eq('origin', 'lead_conversion')
    .maybeSingle();
  if (existingError) throw new Error('Unable to resolve existing CRM opportunity');
  if (existing) {
    return { opportunity: mapOpportunity(existing as unknown as OpportunityRow), created: false };
  }

  const { data: inserted, error: insertError } = await supabase
    .from('crm_opportunities')
    .insert({
      organization_id: parsed.organizationId,
      lead_id: parsed.leadId,
      workspace_id: lead.workspaceId ?? null,
      name: parsed.name,
      stage: 'qualified',
      origin: 'lead_conversion',
      product_key: productKey,
      amount: parsed.amount ?? null,
      currency: parsed.currency ?? 'EUR',
      probability: parsed.probability ?? null,
      expected_close_at: parsed.expectedCloseAt ?? null,
    })
    .select(opportunityColumns)
    .maybeSingle();

  if (insertError) {
    // Another concurrent request won the unique (organization, lead,
    // product_key) race; fetch and return its Opportunity instead of failing.
    if (insertError.code === '23505') {
      const { data: raced, error: racedError } = await supabase
        .from('crm_opportunities')
        .select(opportunityColumns)
        .eq('organization_id', parsed.organizationId)
        .eq('lead_id', parsed.leadId)
        .eq('product_key', productKey)
        .eq('origin', 'lead_conversion')
        .single();
      if (racedError) throw new Error('Unable to resolve concurrent CRM opportunity conversion');
      return { opportunity: mapOpportunity(raced as unknown as OpportunityRow), created: false };
    }
    throw new Error('Unable to create CRM opportunity');
  }

  if (lead.status === 'cualificado') {
    // Best-effort follow-up: it only flips a status flag and is itself
    // idempotent, so a failure here never invalidates the Opportunity above.
    await supabase
      .from('crm_leads')
      .update({ status: 'convertido', updated_at: new Date().toISOString() })
      .eq('id', parsed.leadId)
      .eq('organization_id', parsed.organizationId)
      .eq('status', 'cualificado');
  }

  return { opportunity: mapOpportunity(inserted as unknown as OpportunityRow), created: true };
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
      origin: 'manual',
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
