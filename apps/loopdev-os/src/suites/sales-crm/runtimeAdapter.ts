'use client';

import {
  CrmContactSchema,
  CrmCreateManualOpportunityCommandSchema,
  CrmLeadSchema,
  CrmMoveOpportunityStageCommandSchema,
  CrmOpportunityQuerySchema,
  CrmOpportunitySchema,
  CrmUpdateOpportunityCommandSchema,
  CompleteTaskCommandSchema,
  CreateTaskCommandSchema,
  Customer360RecordViewSchema,
  PipelineStageSchema,
  ReopenTaskCommandSchema,
  TaskPageSchema,
  TaskQuerySchema,
  TaskSchema,
  UpdateTaskCommandSchema,
  type CrmContact,
  type CrmCreateContactCommand,
  type CrmCreateManualOpportunityCommand,
  type CrmMoveOpportunityStageCommand,
  type CrmUpdateContactCommand,
  type CrmUpdateOpportunityCommand,
  type CrmContactPage,
  type CrmLead,
  type CrmLeadPage,
  type CrmOpportunity,
  type CrmOpportunityQuery,
  type CompleteTaskCommand,
  type CreateTaskCommand,
  type Customer360RecordView,
  type PipelineStage,
  type PlatformEnvironmentMode,
  type CrmCaptureLeadCommand,
  type ReopenTaskCommand,
  type Task,
  type TaskPage,
  type TaskQuery,
  type UpdateTaskCommand,
} from '@loopdev/contracts';

const SEED_CONTACT = '11111111-1111-4111-8111-111111111111';
const SEED_LEAD = '22222222-2222-4222-8222-222222222222';
const SEED_OPPORTUNITY = '33333333-3333-4333-8333-333333333333';
const SEED_STAGE = '44444444-4444-4444-8444-444444444444';
const SEED_TASK = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SEED_TIME = '2026-01-01T00:00:00.000Z';
const LOCAL_ACTOR = '00000000-0000-4000-8000-000000000001';
const LOCAL_STORAGE_PREFIX = 'loopdev:crm-sandbox-state:v1:';

type LocalState = {
  contacts: CrmContact[];
  leads: CrmLead[];
  opportunities: CrmOpportunity[];
  stages: PipelineStage[];
  tasks: Task[];
};
const stores = new Map<string, LocalState>();

function storageKey(key: string) {
  return `${LOCAL_STORAGE_PREFIX}${encodeURIComponent(key)}`;
}

function readPersistedState(key: string): LocalState | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(storageKey(key));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<LocalState>;
    const contacts = CrmContactSchema.array().safeParse(parsed.contacts);
    const leads = CrmLeadSchema.array().safeParse(parsed.leads);
    const opportunities = CrmOpportunitySchema.array().safeParse(parsed.opportunities);
    const stages = PipelineStageSchema.array().safeParse(parsed.stages);
    const tasks = TaskSchema.array().safeParse(parsed.tasks ?? []);
    if (
      !contacts.success ||
      !leads.success ||
      !opportunities.success ||
      !stages.success ||
      !tasks.success
    ) {
      window.localStorage.removeItem(storageKey(key));
      return null;
    }
    return {
      contacts: contacts.data,
      leads: leads.data,
      opportunities: opportunities.data,
      stages: stages.data,
      tasks: tasks.data,
    };
  } catch {
    window.localStorage.removeItem(storageKey(key));
    return null;
  }
}

function persistState(key: string, state: LocalState) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey(key), JSON.stringify(state));
  }
}

function localOrganizationId(organizationId: string) {
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      organizationId,
    )
  ) {
    return organizationId;
  }
  const hex = Array.from(organizationId)
    .reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 2166136261)
    .toString(16)
    .padStart(8, '0');
  return `${hex}-0000-4000-8000-${hex}${hex.slice(0, 4)}`;
}

function localNullableId(value: string | null | undefined) {
  return value ? localOrganizationId(value) : null;
}

function localEntityId(prefix: string, index: number) {
  return `${prefix}-${String(index).padStart(12, '0')}`;
}

function localState(organizationId: string, workspaceId: string | null = null): LocalState {
  const key = `${organizationId}:${workspaceId ?? 'global'}`;
  const existing = stores.get(key);
  if (existing) return existing;
  const persisted = readPersistedState(key);
  if (persisted) {
    stores.set(key, persisted);
    return persisted;
  }
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
    tasks: [
      TaskSchema.parse({
        id: SEED_TASK,
        organizationId: storedOrganizationId,
        tenantId: storedOrganizationId,
        workspaceId: null,
        brandId: null,
        title: 'Follow up Enterprise platform',
        description: 'Confirm proposal requirements with Ana Garcia.',
        status: 'open',
        priority: 'high',
        type: 'call',
        assignedUserId: null,
        dueAt: '2026-01-02T10:00:00.000Z',
        relationType: 'opportunity',
        relationId: SEED_OPPORTUNITY,
        createdBy: LOCAL_ACTOR,
        completedAt: null,
        version: 1,
        createdAt: SEED_TIME,
        updatedAt: SEED_TIME,
      }),
    ],
  } satisfies LocalState;
  stores.set(key, state);
  persistState(key, state);
  return state;
}

function isLocal(mode: PlatformEnvironmentMode) {
  return mode !== 'real';
}

export async function crmContacts(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  query = '',
  signal?: AbortSignal,
): Promise<CrmContactPage> {
  if (!isLocal(mode)) {
    const response = await fetch(
      `/api/crm/contacts?organizationId=${encodeURIComponent(organizationId)}&limit=100&query=${encodeURIComponent(query)}`,
      { signal },
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
  persistState(`${input.organizationId}:global`, state);
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
  persistState(`${input.organizationId}:global`, state);
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
    (lead) =>
      (!query.status || lead.status === query.status) &&
      (!query.workspaceId || lead.workspaceId === query.workspaceId),
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
      organizationId: localOrganizationId(input.organizationId),
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
    organizationId: localOrganizationId(input.organizationId),
    workspaceId: localNullableId(input.workspaceId),
    brandId: localNullableId(input.brandId),
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
  persistState(`${input.organizationId}:${input.workspaceId ?? 'global'}`, state);
  return { contact, lead, reused: false, attribution: null };
}

export function updateCrmLead(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  leadId: string,
  changes: Pick<CrmLead, 'interest' | 'assignedUserId'>,
): CrmLead {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(organizationId);
  const index = state.leads.findIndex((lead) => lead.id === leadId);
  if (index < 0) throw new Error('Lead not found.');
  state.leads[index] = CrmLeadSchema.parse({
    ...state.leads[index],
    ...changes,
    updatedAt: SEED_TIME,
  });
  persistState(`${organizationId}:global`, state);
  return state.leads[index];
}

export function moveCrmLead(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  leadId: string,
  status: CrmLead['status'],
) {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(organizationId);
  const index = state.leads.findIndex((lead) => lead.id === leadId);
  if (index < 0) throw new Error('Lead not found.');
  state.leads[index] = CrmLeadSchema.parse({ ...state.leads[index], status, updatedAt: SEED_TIME });
  persistState(`${organizationId}:global`, state);
  return state.leads[index];
}

export function moveCrmOpportunity(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  opportunityId: string,
  stageKey: string,
): CrmOpportunity {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  const state = localState(organizationId);
  const index = state.opportunities.findIndex((item) => item.id === opportunityId);
  if (index < 0) throw new Error('Opportunity not found.');
  state.opportunities[index] = CrmOpportunitySchema.parse({
    ...state.opportunities[index],
    stageKey,
    version: state.opportunities[index].version + 1,
    updatedAt: SEED_TIME,
  });
  persistState(`${organizationId}:global`, state);
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
  const existing = state.opportunities.find(
    (item) => item.leadId === leadId && item.productKey === productKey,
  );
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
  persistState(`${organizationId}:global`, state);
  return opportunity;
}

async function readJsonError(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  return new Error(payload?.error ?? fallback);
}

function activeDefaultStage(state: LocalState) {
  return (
    state.stages.find((stage) => stage.active && stage.terminalType === 'open') ??
    state.stages.find((stage) => stage.active)
  );
}

export async function crmOpportunities(
  mode: PlatformEnvironmentMode,
  query: CrmOpportunityQuery,
  signal?: AbortSignal,
): Promise<{ items: CrmOpportunity[]; nextCursor: string | null; hasMore: boolean }> {
  if (!isLocal(mode)) {
    const parsed = CrmOpportunityQuerySchema.parse(query);
    const params = new URLSearchParams({
      organizationId: parsed.organizationId,
      limit: String(parsed.limit),
    });
    for (const key of [
      'workspaceId',
      'brandId',
      'contactId',
      'stageKey',
      'origin',
      'cursor',
    ] as const) {
      const value = parsed[key];
      if (value) params.set(key, value);
    }
    const response = await fetch(`/api/crm/opportunities?${params.toString()}`, { signal });
    if (!response.ok) throw await readJsonError(response, 'Unable to list CRM opportunities.');
    const page = (await response.json().catch(() => null)) as {
      items?: unknown[];
      nextCursor?: unknown;
      hasMore?: unknown;
    } | null;
    const parsedItems = CrmOpportunitySchema.array().safeParse(page?.items ?? []);
    if (!parsedItems.success) throw new Error('The opportunity response is invalid.');
    return {
      items: parsedItems.data,
      nextCursor: typeof page?.nextCursor === 'string' ? page.nextCursor : null,
      hasMore: page?.hasMore === true,
    };
  }

  const state = localState(query.organizationId, query.workspaceId ?? null);
  const items = state.opportunities.filter(
    (opportunity) =>
      (!query.workspaceId || opportunity.workspaceId === localNullableId(query.workspaceId)) &&
      (!query.brandId || opportunity.brandId === localNullableId(query.brandId)) &&
      (!query.contactId || opportunity.contactId === query.contactId) &&
      (!query.stageKey || opportunity.stageKey === query.stageKey) &&
      (!query.origin || opportunity.origin === query.origin),
  );
  return { items, nextCursor: null, hasMore: false };
}

export async function crmOpportunity(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  opportunityId: string,
  signal?: AbortSignal,
): Promise<CrmOpportunity | null> {
  if (!isLocal(mode)) {
    const response = await fetch(
      `/api/crm/opportunities/${encodeURIComponent(opportunityId)}?organizationId=${encodeURIComponent(organizationId)}`,
      { signal },
    );
    if (response.status === 404) return null;
    if (response.status === 403)
      throw new Error('You do not have permission to view this opportunity.');
    if (!response.ok) throw await readJsonError(response, 'Unable to load CRM opportunity.');
    return CrmOpportunitySchema.parse(await response.json());
  }
  return (
    localState(organizationId).opportunities.find(
      (opportunity) => opportunity.id === opportunityId,
    ) ?? null
  );
}

export async function createCrmOpportunity(
  mode: PlatformEnvironmentMode,
  input: CrmCreateManualOpportunityCommand,
): Promise<CrmOpportunity> {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  if (!isLocal(mode)) {
    const command = CrmCreateManualOpportunityCommandSchema.parse(input);
    const response = await fetch('/api/crm/opportunities', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'idempotency-key': command.idempotencyKey,
      },
      body: JSON.stringify(command),
    });
    if (!response.ok) throw await readJsonError(response, 'Opportunity could not be created.');
    return CrmOpportunitySchema.parse(await response.json());
  }

  const state = localState(input.organizationId, input.workspaceId ?? null);
  if (!state.contacts.some((contact) => contact.id === input.contactId)) {
    throw new Error('CRM contact is required.');
  }
  const stage = activeDefaultStage(state);
  if (!stage) throw new Error('CRM pipeline has no active stage.');
  const opportunity = CrmOpportunitySchema.parse({
    id: localEntityId('33333333-3333-4333-8333', state.opportunities.length + 10),
    organizationId: localOrganizationId(input.organizationId),
    tenantId: localOrganizationId(input.organizationId),
    workspaceId: localNullableId(input.workspaceId),
    brandId: localNullableId(input.brandId),
    contactId: input.contactId,
    leadId: null,
    productKey: input.productKey,
    stageKey: stage.key,
    name: input.name,
    origin: 'manual',
    amount: input.amount ?? null,
    currency: input.currency ?? 'EUR',
    probability: input.probability ?? null,
    expectedCloseAt:
      input.expectedCloseAt ??
      (input.expectedCloseDate ? `${input.expectedCloseDate}T00:00:00.000Z` : null),
    expectedCloseDate: input.expectedCloseDate ?? null,
    assignedUserId: localNullableId(input.assignedUserId),
    activityHealth: 'unknown',
    version: 1,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
  });
  state.opportunities.push(opportunity);
  persistState(`${input.organizationId}:${input.workspaceId ?? 'global'}`, state);
  return opportunity;
}

export async function updateCrmOpportunity(
  mode: PlatformEnvironmentMode,
  input: CrmUpdateOpportunityCommand,
): Promise<CrmOpportunity> {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  if (!isLocal(mode)) {
    const command = CrmUpdateOpportunityCommandSchema.parse(input);
    const response = await fetch(`/api/crm/opportunities/${command.opportunityId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(command),
    });
    if (!response.ok) throw await readJsonError(response, 'Opportunity could not be updated.');
    return CrmOpportunitySchema.parse(await response.json());
  }

  const state = localState(input.organizationId);
  const index = state.opportunities.findIndex((item) => item.id === input.opportunityId);
  if (index < 0) throw new Error('Opportunity not found.');
  if (state.opportunities[index].version !== input.expectedVersion) {
    throw new Error('Opportunity update conflict.');
  }
  const updated = CrmOpportunitySchema.parse({
    ...state.opportunities[index],
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.brandId !== undefined ? { brandId: localNullableId(input.brandId) } : {}),
    ...(input.productKey !== undefined ? { productKey: input.productKey } : {}),
    ...(input.amount !== undefined ? { amount: input.amount } : {}),
    ...(input.currency !== undefined ? { currency: input.currency } : {}),
    ...(input.probability !== undefined ? { probability: input.probability } : {}),
    ...(input.expectedCloseDate !== undefined
      ? {
          expectedCloseDate: input.expectedCloseDate,
          expectedCloseAt: input.expectedCloseDate
            ? `${input.expectedCloseDate}T00:00:00.000Z`
            : null,
        }
      : {}),
    ...(input.expectedCloseAt !== undefined ? { expectedCloseAt: input.expectedCloseAt } : {}),
    ...(input.assignedUserId !== undefined
      ? { assignedUserId: localNullableId(input.assignedUserId) }
      : {}),
    version: input.expectedVersion + 1,
    updatedAt: SEED_TIME,
  });
  state.opportunities[index] = updated;
  persistState(`${input.organizationId}:global`, state);
  return updated;
}

export async function moveCrmOpportunityStage(
  mode: PlatformEnvironmentMode,
  input: CrmMoveOpportunityStageCommand,
): Promise<CrmOpportunity> {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  if (!isLocal(mode)) {
    const command = CrmMoveOpportunityStageCommandSchema.parse(input);
    const response = await fetch(`/api/crm/opportunities/${command.opportunityId}/stage`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(command),
    });
    if (!response.ok)
      throw await readJsonError(response, 'Opportunity stage could not be updated.');
    return CrmOpportunitySchema.parse(await response.json());
  }
  const current = localState(input.organizationId).opportunities.find(
    (item) => item.id === input.opportunityId,
  );
  if (!current) throw new Error('Opportunity not found.');
  if (current.version !== input.expectedVersion) throw new Error('Opportunity update conflict.');
  const updated = moveCrmOpportunity(
    mode,
    input.organizationId,
    input.opportunityId,
    input.stageKey,
  );
  return updated;
}

export async function crmPipelineStages(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  signal?: AbortSignal,
): Promise<PipelineStage[]> {
  if (!isLocal(mode)) {
    const scope = `organizationId=${encodeURIComponent(organizationId)}`;
    const response = await fetch(`/api/crm/pipeline/stages?${scope}`, { signal });
    if (!response.ok) throw await readJsonError(response, 'Pipeline stages could not be loaded.');
    return PipelineStageSchema.array().parse(await response.json());
  }
  return localState(organizationId).stages;
}

export async function crmPipeline(
  mode: PlatformEnvironmentMode,
  organizationId: string,
): Promise<{ stages: PipelineStage[]; opportunities: CrmOpportunity[] }> {
  if (!isLocal(mode)) {
    const scope = `organizationId=${encodeURIComponent(organizationId)}`;
    const [stages, opportunities] = await Promise.all([
      crmPipelineStages(mode, organizationId),
      fetch(`/api/crm/opportunities?${scope}&limit=100`).then((response) => response.json()),
    ]);
    return {
      stages,
      opportunities: (opportunities as { items: CrmOpportunity[] }).items,
    };
  }
  const state = localState(organizationId);
  return { stages: state.stages, opportunities: state.opportunities };
}

export async function crmTasks(
  mode: PlatformEnvironmentMode,
  query: TaskQuery,
  signal?: AbortSignal,
): Promise<TaskPage> {
  if (!isLocal(mode)) {
    const parsed = TaskQuerySchema.parse(query);
    const params = new URLSearchParams({
      organizationId: parsed.organizationId,
      limit: String(parsed.limit),
    });
    for (const key of [
      'workspaceId',
      'brandId',
      'status',
      'assignedUserId',
      'priority',
      'relationType',
      'cursor',
    ] as const) {
      const value = parsed[key];
      if (value) params.set(key, value);
    }
    const response = await fetch(`/api/crm/tasks?${params.toString()}`, { signal });
    if (!response.ok) throw await readJsonError(response, 'Tasks could not be loaded.');
    return TaskPageSchema.parse(await response.json());
  }

  const state = localState(query.organizationId, query.workspaceId ?? null);
  const items = state.tasks.filter(
    (task) =>
      (!query.workspaceId || task.workspaceId === localNullableId(query.workspaceId)) &&
      (!query.brandId || task.brandId === localNullableId(query.brandId)) &&
      (!query.status || task.status === query.status) &&
      (!query.assignedUserId || task.assignedUserId === localNullableId(query.assignedUserId)) &&
      (!query.priority || task.priority === query.priority) &&
      (!query.relationType || task.relationType === query.relationType),
  );
  return TaskPageSchema.parse({ items, nextCursor: null, hasMore: false });
}

export async function crmTask(
  mode: PlatformEnvironmentMode,
  organizationId: string,
  taskId: string,
  signal?: AbortSignal,
): Promise<Task | null> {
  if (!isLocal(mode)) {
    const response = await fetch(
      `/api/crm/tasks/${encodeURIComponent(taskId)}?organizationId=${encodeURIComponent(organizationId)}`,
      { signal },
    );
    if (response.status === 404) return null;
    if (response.status === 403) throw new Error('You do not have permission to view this task.');
    if (!response.ok) throw await readJsonError(response, 'Task could not be loaded.');
    return TaskSchema.parse(await response.json());
  }
  return localState(organizationId).tasks.find((task) => task.id === taskId) ?? null;
}

function localRelationExists(
  state: LocalState,
  input: Pick<CreateTaskCommand, 'relationType' | 'relationId'>,
) {
  if (input.relationType === 'contact')
    return state.contacts.some((item) => item.id === input.relationId);
  if (input.relationType === 'lead')
    return state.leads.some((item) => item.id === input.relationId);
  return state.opportunities.some((item) => item.id === input.relationId);
}

export async function createCrmTask(
  mode: PlatformEnvironmentMode,
  input: CreateTaskCommand,
): Promise<Task> {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  if (!isLocal(mode)) {
    const command = CreateTaskCommandSchema.parse(input);
    const response = await fetch('/api/crm/tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'idempotency-key': command.idempotencyKey,
      },
      body: JSON.stringify(command),
    });
    if (!response.ok) throw await readJsonError(response, 'Task could not be created.');
    return TaskSchema.parse(await response.json());
  }

  const state = localState(input.organizationId, input.workspaceId ?? null);
  if (!localRelationExists(state, input)) throw new Error('CRM task relation was not found.');
  const task = TaskSchema.parse({
    id: localEntityId('aaaaaaaa-aaaa-4aaa-8aaa', state.tasks.length + 10),
    organizationId: localOrganizationId(input.organizationId),
    tenantId: localOrganizationId(input.organizationId),
    workspaceId: localNullableId(input.workspaceId),
    brandId: localNullableId(input.brandId),
    title: input.title,
    description: input.description ?? null,
    status: 'open',
    priority: input.priority ?? 'normal',
    type: input.type ?? null,
    assignedUserId: localNullableId(input.assignedUserId),
    dueAt: input.dueAt ?? null,
    relationType: input.relationType,
    relationId: input.relationId,
    createdBy: LOCAL_ACTOR,
    completedAt: null,
    version: 1,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
  });
  state.tasks.push(task);
  persistState(`${input.organizationId}:${input.workspaceId ?? 'global'}`, state);
  return task;
}

function updateLocalTask(
  organizationId: string,
  taskId: string,
  expectedVersion: number,
  changes: Partial<Task>,
) {
  const state = localState(organizationId);
  const index = state.tasks.findIndex((task) => task.id === taskId);
  if (index < 0) throw new Error('Task not found.');
  if (state.tasks[index].version !== expectedVersion) throw new Error('Task update conflict.');
  const updated = TaskSchema.parse({
    ...state.tasks[index],
    ...changes,
    version: expectedVersion + 1,
    updatedAt: SEED_TIME,
  });
  state.tasks[index] = updated;
  persistState(`${organizationId}:global`, state);
  return updated;
}

export async function updateCrmTask(
  mode: PlatformEnvironmentMode,
  input: UpdateTaskCommand,
): Promise<Task> {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  if (!isLocal(mode)) {
    const command = UpdateTaskCommandSchema.parse(input);
    const response = await fetch(`/api/crm/tasks/${command.taskId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'idempotency-key': command.idempotencyKey,
      },
      body: JSON.stringify(command),
    });
    if (!response.ok) throw await readJsonError(response, 'Task could not be updated.');
    return TaskSchema.parse(await response.json());
  }
  return updateLocalTask(input.organizationId, input.taskId, input.expectedVersion, {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.type !== undefined ? { type: input.type } : {}),
    ...(input.dueAt !== undefined ? { dueAt: input.dueAt } : {}),
  });
}

export async function completeCrmTask(
  mode: PlatformEnvironmentMode,
  input: CompleteTaskCommand,
): Promise<Task> {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  if (!isLocal(mode)) {
    const command = CompleteTaskCommandSchema.parse(input);
    const response = await fetch(`/api/crm/tasks/${command.taskId}/complete`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'idempotency-key': command.idempotencyKey,
      },
      body: JSON.stringify(command),
    });
    if (!response.ok) throw await readJsonError(response, 'Task could not be completed.');
    return TaskSchema.parse(await response.json());
  }
  return updateLocalTask(input.organizationId, input.taskId, input.expectedVersion, {
    status: 'completed',
    completedAt: SEED_TIME,
  });
}

export async function reopenCrmTask(
  mode: PlatformEnvironmentMode,
  input: ReopenTaskCommand,
): Promise<Task> {
  if (mode === 'preview') throw new Error('Preview is read-only.');
  if (!isLocal(mode)) {
    const command = ReopenTaskCommandSchema.parse(input);
    const response = await fetch(`/api/crm/tasks/${command.taskId}/reopen`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'idempotency-key': command.idempotencyKey,
      },
      body: JSON.stringify(command),
    });
    if (!response.ok) throw await readJsonError(response, 'Task could not be reopened.');
    return TaskSchema.parse(await response.json());
  }
  return updateLocalTask(input.organizationId, input.taskId, input.expectedVersion, {
    status: 'open',
    completedAt: null,
  });
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
  const contactOpportunityIds = new Set(
    state.opportunities.filter((item) => item.contactId === contactId).map((item) => item.id),
  );
  return Customer360RecordViewSchema.parse({
    view: 'record',
    contact,
    leads: state.leads.filter((item) => item.contactId === contactId),
    opportunities: state.opportunities.filter((item) => item.contactId === contactId),
    tasks: state.tasks.filter(
      (task) =>
        (task.relationType === 'contact' && task.relationId === contactId) ||
        (task.relationType === 'opportunity' && contactOpportunityIds.has(task.relationId)),
    ),
    notes: [],
    timeline: [],
    cursors: { leads: null, opportunities: null, tasks: null, notes: null, timeline: null },
    sectionState: {
      profile: 'fresh',
      leads: 'fresh',
      opportunities: 'fresh',
      tasks: 'fresh',
      notes: 'fresh',
      timeline: 'fresh',
    },
    sectionPermissions: {
      profile: true,
      leads: true,
      opportunities: true,
      tasks: true,
      notes: true,
      timeline: true,
    },
  });
}

export function resetCrmRuntime() {
  stores.clear();
  if (typeof window !== 'undefined') {
    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith(LOCAL_STORAGE_PREFIX)) window.localStorage.removeItem(key);
    }
  }
}

export const CRM_SEED_IDS = {
  contact: SEED_CONTACT,
  lead: SEED_LEAD,
  opportunity: SEED_OPPORTUNITY,
};
