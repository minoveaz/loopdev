'use client';

import {
  CrmContactSchema,
  CrmLeadSchema,
  CrmOpportunitySchema,
  Customer360RecordViewSchema,
  PipelineStageSchema,
  type CrmContact,
  type CrmCreateContactCommand,
  type CrmUpdateContactCommand,
  type CrmContactPage,
  type CrmLead,
  type CrmLeadPage,
  type CrmOpportunity,
  type Customer360RecordView,
  type PipelineStage,
  type PlatformEnvironmentMode,
  type CrmCaptureLeadCommand,
} from '@loopdev/contracts';

const SEED_CONTACT = '11111111-1111-4111-8111-111111111111';
const SEED_LEAD = '22222222-2222-4222-8222-222222222222';
const SEED_OPPORTUNITY = '33333333-3333-4333-8333-333333333333';
const SEED_STAGE = '44444444-4444-4444-8444-444444444444';
const SEED_TIME = '2026-01-01T00:00:00.000Z';

type LocalState = {
  contacts: CrmContact[];
  leads: CrmLead[];
  opportunities: CrmOpportunity[];
  stages: PipelineStage[];
};
const stores = new Map<string, LocalState>();
function localOrganizationId(organizationId: string) {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(organizationId)) {
    return organizationId;
  }
  const hex = Array.from(organizationId).reduce((value, char) => ((value * 31 + char.charCodeAt(0)) >>> 0), 2166136261).toString(16).padStart(8, '0');
  return `${hex}-0000-4000-8000-${hex}${hex.slice(0, 4)}`;
}

function localState(organizationId: string, workspaceId: string | null = null): LocalState {
  const key = `${organizationId}:${workspaceId ?? 'global'}`;
  const existing = stores.get(key);
  if (existing) return existing;
  const storedOrganizationId = localOrganizationId(organizationId);
  const contact = CrmContactSchema.parse({
    id: SEED_CONTACT,
    organizationId: storedOrganizationId,
    firstName: 'Ana',
    lastName: 'Garcia',
    email: 'ana.garcia@example.com',
    phone: '+1 555 0100',
    companyName: 'Acme Industries',
    identityStatus: 'verified',
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
  });
  const lead = CrmLeadSchema.parse({
    id: SEED_LEAD,
    organizationId: storedOrganizationId,
    contactId: contact.id,
    status: 'cualificado',
    interest: 'Enterprise SaaS',
    source: { kind: 'referral', campaign: null, provider: null, externalId: null, utm: {} },
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
  });
  const state = {
    contacts: [
      contact,
      CrmContactSchema.parse({
        id: '88888888-8888-4888-8888-888888888888',
        organizationId: storedOrganizationId,
        firstName: 'Luis',
        lastName: 'Martinez',
        email: 'luis.martinez@example.com',
        phone: '+1 555 0101',
        companyName: 'Northstar Health',
        createdAt: SEED_TIME,
        updatedAt: SEED_TIME,
      }),
    ],
    leads: [lead],
    opportunities: [
      CrmOpportunitySchema.parse({
        id: SEED_OPPORTUNITY,
        organizationId: storedOrganizationId,
        tenantId: storedOrganizationId,
        contactId: contact.id,
        leadId: lead.id,
        productKey: 'loopdev-platform',
        stageKey: 'qualified',
        name: 'Enterprise platform',
        origin: 'lead_conversion',
        amount: 48000,
        currency: 'EUR',
        probability: 60,
        version: 1,
        createdAt: SEED_TIME,
        updatedAt: SEED_TIME,
      }),
    ],
    stages: ['qualified', 'proposal', 'won'].map((key, position) =>
      PipelineStageSchema.parse({
        id: position === 0 ? SEED_STAGE : `44444444-4444-4444-8444-44444444444${position + 2}`,
        organizationId: storedOrganizationId,
        tenantId: storedOrganizationId,
        key,
        name: key[0].toUpperCase() + key.slice(1),
        label: key[0].toUpperCase() + key.slice(1),
        position,
        stageOrder: position,
        active: true,
        terminalType: key === 'won' ? 'won' : 'open',
        createdAt: SEED_TIME,
        updatedAt: SEED_TIME,
      }),
    ),
  } satisfies LocalState;
  stores.set(key, state);
  return state;
}

function isLocal(mode: PlatformEnvironmentMode) {
  return mode !== 'real';
}

export async function crmContacts(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  query = '',
): Promise<CrmContactPage> {
  if (!isLocal(mode)) {
    const response = await fetch(
      `/api/crm/contacts?organizationId=${encodeURIComponent(organizationId)}&limit=100&query=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error('Contacts could not be loaded.');
    return (await response.json()) as CrmContactPage;
  }
  const normalized = query.trim().toLowerCase();
  const items = localState(organizationId).contacts.filter((contact) =>
    !normalized
      ? true
      : [contact.firstName, contact.lastName, contact.email, contact.companyName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalized),
  );
  return { items, nextCursor: null, hasMore: false };
}

export function createCrmContact(
  mode: PlatformEnvironmentMode,
  input: CrmCreateContactCommand,
): CrmContact {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(input.organizationId);
  const contact = CrmContactSchema.parse({
    id: `99999999-9999-4999-8999-${String(state.contacts.length + 1).padStart(12, '0')}`,
    organizationId: localOrganizationId(input.organizationId),
    firstName: input.firstName,
    lastName: input.lastName ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    companyName: input.companyName ?? null,
    identityStatus: 'verified',
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
  });
  state.contacts.push(contact);
  return contact;
}

export function updateCrmContact(
  mode: PlatformEnvironmentMode,
  input: CrmUpdateContactCommand,
): CrmContact {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(input.organizationId);
  const index = state.contacts.findIndex((item) => item.id === input.contactId);
  if (index < 0) throw new Error('Contact not found.');
  const updated = CrmContactSchema.parse({
    ...state.contacts[index],
    ...input,
    organizationId: localOrganizationId(input.organizationId),
    updatedAt: SEED_TIME,
  });
  state.contacts[index] = updated;
  return updated;
}

export async function crmLeads(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  query: { status?: string; limit?: number; workspaceId?: string } = {},
): Promise<CrmLeadPage> {
  if (!isLocal(mode)) {
    const params = new URLSearchParams({ organizationId, limit: String(query.limit ?? 50) });
    if (query.status) params.set('status', query.status);
    const response = await fetch(`/api/crm/leads?${params}`);
    if (!response.ok) throw new Error('Unable to load leads.');
    return (await response.json()) as CrmLeadPage;
  }

  const items = localState(organizationId, query.workspaceId ?? null).leads.filter(
    (lead) => (!query.status || lead.status === query.status) && (!query.workspaceId || lead.workspaceId === query.workspaceId),
  );
  return { items, nextCursor: null, hasMore: false };
}

export function createCrmLead(
  mode: PlatformEnvironmentMode,
  input: CrmCaptureLeadCommand,
): { contact: CrmContact; lead: CrmLead; reused: boolean; attribution: null } {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(input.organizationId, input.workspaceId ?? null);
  const existingContact = input.contactId
    ? state.contacts.find((item) => item.id === input.contactId)
    : undefined;
  const contact =
    existingContact ??
    CrmContactSchema.parse({
      id: '66666666-6666-4666-8666-666666666666',
      organizationId: input.organizationId,
      firstName: input.firstName,
      lastName: input.lastName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      companyName: input.companyName ?? null,
      createdAt: SEED_TIME,
      updatedAt: SEED_TIME,
    });
  if (!state.contacts.some((item) => item.id === contact.id)) state.contacts.push(contact);
  const lead = CrmLeadSchema.parse({
    id: '77777777-7777-4777-8777-777777777777',
    organizationId: input.organizationId,
    workspaceId: input.workspaceId ?? null,
    brandId: input.brandId ?? null,
    contactId: contact.id,
    status: 'nuevo',
    interest: input.interest,
    estimatedBudget: input.estimatedBudget ?? null,
    purchaseTimeline: input.purchaseTimeline ?? null,
    leadScore: input.leadScore ?? null,
    assignedUserId: input.assignedUserId ?? null,
    source: input.source,
    attributes: input.attributes ?? {},
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
  });
  state.leads.push(lead);
  return { contact, lead, reused: false, attribution: null };
}

export function updateCrmLead(mode: PlatformEnvironmentMode, organizationId: string, leadId: string, changes: Pick<CrmLead, 'interest' | 'assignedUserId'>): CrmLead {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(organizationId);
  const index = state.leads.findIndex((lead) => lead.id === leadId);
  if (index < 0) throw new Error('Lead not found.');
  state.leads[index] = CrmLeadSchema.parse({ ...state.leads[index], ...changes, updatedAt: SEED_TIME });
  return state.leads[index];
}

export function moveCrmLead(mode: PlatformEnvironmentMode, organizationId: string, leadId: string, status: CrmLead['status']) {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(organizationId);
  const index = state.leads.findIndex((lead) => lead.id === leadId);
  if (index < 0) throw new Error('Lead not found.');
  state.leads[index] = CrmLeadSchema.parse({ ...state.leads[index], status, updatedAt: SEED_TIME });
  return state.leads[index];
}

export function moveCrmOpportunity(mode: PlatformEnvironmentMode, organizationId: string, opportunityId: string, stageKey: string): CrmOpportunity {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(organizationId);
  const index = state.opportunities.findIndex((item) => item.id === opportunityId);
  if (index < 0) throw new Error('Opportunity not found.');
  state.opportunities[index] = CrmOpportunitySchema.parse({ ...state.opportunities[index], stageKey, version: state.opportunities[index].version + 1 });
  return state.opportunities[index];
}

export function createCrmOpportunityFromLead(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  leadId: string,
  productKey: string,
): CrmOpportunity {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(organizationId);
  const lead = state.leads.find((item) => item.id === leadId);
  if (!lead) throw new Error('Lead not found.');
  const existing = state.opportunities.find((item) => item.leadId === leadId && item.productKey === productKey);
  if (existing) return existing;
  const opportunity = CrmOpportunitySchema.parse({
    ...state.opportunities[0],
    id: '55555555-5555-4555-8555-555555555555',
    leadId,
    contactId: lead.contactId,
    productKey,
    name: productKey,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
  });
  state.opportunities.push(opportunity);
  return opportunity;
}

export async function crmPipeline(
  mode: PlatformEnvironmentMode,
  organizationId: string,
): Promise<{ stages: PipelineStage[]; opportunities: CrmOpportunity[] }> {
  if (!isLocal(mode)) {
    const scope = `organizationId=${encodeURIComponent(organizationId)}`;
    const [stages, opportunities] = await Promise.all([
      fetch(`/api/crm/pipeline/stages?${scope}`).then((response) => response.json()),
      fetch(`/api/crm/opportunities?${scope}&limit=100`).then((response) => response.json()),
    ]);
    return { stages: stages as PipelineStage[], opportunities: (opportunities as { items: CrmOpportunity[] }).items };
  }
  const state = localState(organizationId);
  return { stages: state.stages, opportunities: state.opportunities };
}

export async function crmCustomer360(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  contactId: string,
): Promise<Customer360RecordView> {
  if (!isLocal(mode)) {
    const response = await fetch(
      `/api/crm/contacts/${encodeURIComponent(contactId)}/customer-360?organizationId=${encodeURIComponent(organizationId)}&view=record&sections=profile,leads,opportunities,tasks,notes,timeline`,
    );
    if (!response.ok) throw new Error('Customer 360 could not be loaded.');
    return (await response.json()) as Customer360RecordView;
  }
  const state = localState(organizationId);
  const contact = state.contacts.find((item) => item.id === contactId);
  if (!contact) throw new Error('This contact could not be found.');
  return Customer360RecordViewSchema.parse({
    view: 'record',
    contact,
    leads: state.leads.filter((item) => item.contactId === contactId),
    opportunities: state.opportunities.filter((item) => item.contactId === contactId),
    tasks: [],
    notes: [],
    timeline: [],
    cursors: { leads: null, opportunities: null, tasks: null, notes: null, timeline: null },
    sectionState: { profile: 'fresh', leads: 'fresh', opportunities: 'fresh', tasks: 'fresh', notes: 'fresh', timeline: 'fresh' },
    sectionPermissions: { profile: true, leads: true, opportunities: true, tasks: true, notes: true, timeline: true },
  });
}

export function resetCrmRuntime() {
  stores.clear();
}

export const CRM_SEED_IDS = { contact: SEED_CONTACT, lead: SEED_LEAD, opportunity: SEED_OPPORTUNITY };
