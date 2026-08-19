import {
  ActivityItemSchema,
  ActivitySourceSchema,
  AuthorizedNoteSummarySchema,
  CreateContextNoteCommandSchema,
  CreateContextTaskCommandSchema,
  CrmLeadSchema,
  CrmOpportunitySchema,
  Customer360ActivityPageSchema,
  Customer360ActivityQuerySchema,
  Customer360OverviewViewSchema,
  Customer360RecordViewSchema,
  Customer360SectionPageSchema,
  Customer360ScopeSchema,
  Customer360SplitViewSchema,
  TaskSchema,
  TimelineEventSchema,
} from '@loopdev/contracts';
import type {
  ActivityItem,
  AuthorizedNoteSummary,
  CreateContextNoteCommand,
  CreateContextTaskCommand,
  CrmLead,
  CrmOpportunity,
  Customer360ActivityPage,
  Customer360ActivityQuery,
  Customer360ReadQuery,
  Customer360RecordView,
  Customer360Section,
  Customer360SectionPage,
  Customer360SectionQuery,
  Customer360Scope,
  Task,
  TimelineEvent,
} from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getContactById } from './core';
import { createNote, createTask } from './tasks';

type DbRow = Record<string, unknown>;
const NIL_UUID = '00000000-0000-4000-8000-000000000000';

const leadColumns =
  'id, organization_id, contact_id, brand_id, workspace_id, status, source, source_provider, external_lead_id, campaign, interest, assigned_to_user_id, created_at, updated_at';
const opportunityColumns =
  'id, organization_id, lead_id, workspace_id, brand_id, contact_id, name, stage, stage_key, origin, product_key, amount, currency, probability, expected_close_at, assigned_to_user_id, version, created_at, updated_at';
const taskColumns =
  'id, organization_id, workspace_id, brand_id, relation_type, relation_id, title, description, status, priority, type, assigned_to_user_id, created_by_user_id, due_at, completed_at, version, created_at, updated_at';
const noteColumns =
  'id, organization_id, workspace_id, brand_id, relation_type, relation_id, author_user_id, body, visibility, version, created_at, updated_at';
const timelineColumns =
  'id, organization_id, workspace_id, brand_id, relation_type, relation_id, type, actor_id, actor_type, origin, occurred_at, summary, metadata, source_type, source_id';

const ALL_SECTIONS: Customer360Section[] = [
  'profile',
  'leads',
  'opportunities',
  'tasks',
  'notes',
  'timeline',
];

export class Customer360ServiceError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'NOT_FOUND'
      | 'CONFLICT'
      | 'FORBIDDEN'
      | 'CROSS_TENANT_REFERENCE'
      | 'ACTIVITY_DEDUPLICATION_ERROR',
  ) {
    super(message);
    this.name = 'Customer360ServiceError';
  }
}

function timestamp(value: unknown): string {
  const raw = String(value);
  return raw.includes('T')
    ? raw.replace(/\+00:00$/, 'Z')
    : raw.replace(' ', 'T').replace(/\+00:00$/, 'Z');
}

function mapLead(row: DbRow): CrmLead {
  const status =
    row.status === 'active'
      ? 'nuevo'
      : row.status === 'inactive'
        ? 'inactivo'
        : row.status === 'stalled'
          ? 'estancado'
          : row.status;
  return CrmLeadSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id ?? null,
    brandId: row.brand_id ?? null,
    contactId: row.contact_id,
    status,
    interest: row.interest ?? null,
    assignedUserId: row.assigned_to_user_id ?? null,
    source: {
      kind: row.source === 'whatsapp' ? 'whatsapp_simulated' : row.source,
      provider: row.source_provider ?? null,
      externalId: row.external_lead_id ?? null,
      campaign: row.campaign ?? null,
      utm: {},
    },
    duplicateReviewId: null,
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });
}

function mapOpportunity(row: DbRow): CrmOpportunity {
  const stageKey = String(row.stage_key ?? row.stage);
  return CrmOpportunitySchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    tenantId: row.organization_id,
    workspaceId: row.workspace_id ?? null,
    brandId: row.brand_id ?? null,
    contactId: row.contact_id,
    leadId: row.lead_id ?? null,
    name: row.name,
    productKey: row.product_key,
    stageKey,
    stage: [
      'lead',
      'contacted',
      'proposal',
      'negotiation',
      'won',
      'lost',
      'rejected',
      'discarded',
      'qualified',
    ].includes(stageKey)
      ? stageKey
      : undefined,
    origin: row.origin,
    amount: row.amount ?? null,
    currency: row.currency,
    probability: row.probability ?? null,
    expectedCloseAt: row.expected_close_at ?? null,
    expectedCloseDate: row.expected_close_at ? String(row.expected_close_at).slice(0, 10) : null,
    assignedUserId: row.assigned_to_user_id ?? null,
    version: Number(row.version ?? 1),
    activityHealth: 'unknown',
    lastActivity: null,
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });
}

function mapTask(row: DbRow): Task {
  return TaskSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    tenantId: row.organization_id,
    workspaceId: row.workspace_id ?? null,
    brandId: row.brand_id ?? null,
    title: row.title,
    description: row.description ?? null,
    status: row.status,
    priority: row.priority,
    type: row.type ?? null,
    assignedUserId: row.assigned_to_user_id ?? null,
    dueAt: row.due_at ? timestamp(row.due_at) : null,
    relationType: row.relation_type,
    relationId: row.relation_id,
    createdBy: row.created_by_user_id ?? row.assigned_to_user_id ?? NIL_UUID,
    completedAt: row.completed_at ? timestamp(row.completed_at) : null,
    version: Number(row.version ?? 1),
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });
}

function mapNote(row: DbRow, actorUserId: string, moderator: boolean): AuthorizedNoteSummary {
  const canEdit = row.author_user_id === actorUserId || moderator;
  const canReadBody = canEdit || row.visibility !== 'private';
  return AuthorizedNoteSummarySchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    tenantId: row.organization_id,
    workspaceId: row.workspace_id ?? null,
    brandId: row.brand_id ?? null,
    relationType: row.relation_type,
    relationId: row.relation_id,
    authorId: row.author_user_id,
    body: canReadBody ? row.body : null,
    permissions: { canEdit, canModerate: moderator },
    version: Number(row.version ?? 1),
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
    source: { sourceType: 'note', sourceId: row.id },
  });
}

function mapTimeline(row: DbRow): TimelineEvent {
  return TimelineEventSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    tenantId: row.organization_id,
    workspaceId: row.workspace_id ?? null,
    brandId: row.brand_id ?? null,
    relationType: row.relation_type,
    relationId: row.relation_id,
    type: row.type,
    actorId: row.actor_id ?? null,
    actorType: row.actor_type,
    origin: row.origin,
    occurredAt: timestamp(row.occurred_at),
    summary: row.summary,
    metadata: Object.fromEntries(
      Object.entries((row.metadata as Record<string, unknown> | null) ?? {}).map(([key, value]) => [
        key,
        String(value),
      ]),
    ),
  });
}

function mapActivity(row: DbRow): ActivityItem {
  const source = ActivitySourceSchema.parse({
    sourceType: row.source_type,
    sourceId: row.source_id,
  });
  return ActivityItemSchema.parse({
    kind: 'event',
    source,
    event: mapTimeline(row),
  });
}

export function activitySourceKey(item: Pick<ActivityItem, 'source'>) {
  return `${item.source.sourceType}:${item.source.sourceId}`;
}

export function deduplicateActivityItems(items: ActivityItem[]): ActivityItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = activitySourceKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function scopeQuery<T extends { eq(column: string, value: string): T }>(
  query: T,
  scope: Customer360Scope,
) {
  let scoped = query.eq('organization_id', scope.tenantId);
  if (scope.workspaceId) scoped = scoped.eq('workspace_id', scope.workspaceId);
  if (scope.brandId) scoped = scoped.eq('brand_id', scope.brandId);
  return scoped;
}

function relationFilter(contactId: string, leadIds: string[], opportunityIds: string[]) {
  const filters = [`and(relation_type.eq.contact,relation_id.eq.${contactId})`];
  for (const leadId of leadIds) filters.push(`and(relation_type.eq.lead,relation_id.eq.${leadId})`);
  for (const opportunityId of opportunityIds)
    filters.push(`and(relation_type.eq.opportunity,relation_id.eq.${opportunityId})`);
  return filters.join(',');
}

async function loadLeads(scope: Customer360Scope, limit: number, cursor?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('crm_leads')
    .select(leadColumns)
    .eq('organization_id', scope.tenantId)
    .eq('contact_id', scope.contactId)
    .order('id', { ascending: true })
    .limit(limit + 1);
  if (scope.workspaceId) query = query.eq('workspace_id', scope.workspaceId);
  if (scope.brandId) query = query.eq('brand_id', scope.brandId);
  if (cursor) query = query.gt('id', cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to load Customer 360 leads');
  const rows = (data ?? []) as unknown as DbRow[];
  const items = rows.slice(0, limit).map(mapLead);
  return {
    items,
    nextCursor: rows.length > limit ? (items.at(-1)?.id ?? null) : null,
    hasMore: rows.length > limit,
  };
}

async function loadOpportunities(scope: Customer360Scope, limit: number, cursor?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('crm_opportunities')
    .select(opportunityColumns)
    .eq('organization_id', scope.tenantId)
    .eq('contact_id', scope.contactId)
    .order('id', { ascending: true })
    .limit(limit + 1);
  if (scope.workspaceId) query = query.eq('workspace_id', scope.workspaceId);
  if (scope.brandId) query = query.eq('brand_id', scope.brandId);
  if (cursor) query = query.gt('id', cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to load Customer 360 opportunities');
  const rows = (data ?? []) as unknown as DbRow[];
  const items = rows.slice(0, limit).map(mapOpportunity);
  return {
    items,
    nextCursor: rows.length > limit ? (items.at(-1)?.id ?? null) : null,
    hasMore: rows.length > limit,
  };
}

async function loadRelationIds(scope: Customer360Scope) {
  const supabase = await createServerSupabaseClient();
  let leadsQuery = supabase
    .from('crm_leads')
    .select('id')
    .eq('organization_id', scope.tenantId)
    .eq('contact_id', scope.contactId)
    .limit(101);
  let opportunitiesQuery = supabase
    .from('crm_opportunities')
    .select('id')
    .eq('organization_id', scope.tenantId)
    .eq('contact_id', scope.contactId)
    .limit(101);
  if (scope.workspaceId) {
    leadsQuery = leadsQuery.eq('workspace_id', scope.workspaceId);
    opportunitiesQuery = opportunitiesQuery.eq('workspace_id', scope.workspaceId);
  }
  if (scope.brandId) {
    leadsQuery = leadsQuery.eq('brand_id', scope.brandId);
    opportunitiesQuery = opportunitiesQuery.eq('brand_id', scope.brandId);
  }
  const [leads, opportunities] = await Promise.all([leadsQuery, opportunitiesQuery]);
  if (leads.error || opportunities.error)
    throw new Error('Unable to resolve Customer 360 relations');
  return {
    leadIds: (leads.data ?? []).map((row) => row.id as string),
    opportunityIds: (opportunities.data ?? []).map((row) => row.id as string),
  };
}

async function loadTasks(
  scope: Customer360Scope,
  relationIds: { leadIds: string[]; opportunityIds: string[] },
  limit: number,
  cursor?: string,
) {
  const supabase = await createServerSupabaseClient();
  let query = scopeQuery(
    supabase
      .from('crm_tasks')
      .select(taskColumns)
      .or(relationFilter(scope.contactId, relationIds.leadIds, relationIds.opportunityIds))
      .order('id', { ascending: true })
      .limit(limit + 1),
    scope,
  );
  if (cursor) query = query.gt('id', cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to load Customer 360 tasks');
  const rows = (data ?? []) as unknown as DbRow[];
  const items = rows.slice(0, limit).map(mapTask);
  return {
    items,
    nextCursor: rows.length > limit ? (items.at(-1)?.id ?? null) : null,
    hasMore: rows.length > limit,
  };
}

async function loadModerator(organizationId: string, actorUserId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('organization_memberships')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', actorUserId)
    .maybeSingle();
  if (error) throw new Error('Unable to resolve Customer 360 note permissions');
  return Boolean(data && ['owner', 'admin'].includes(String(data.role)));
}

async function loadNotes(
  scope: Customer360Scope,
  relationIds: { leadIds: string[]; opportunityIds: string[] },
  actorUserId: string,
  limit: number,
  cursor?: string,
) {
  const supabase = await createServerSupabaseClient();
  let query = scopeQuery(
    supabase
      .from('crm_notes')
      .select(noteColumns)
      .or(relationFilter(scope.contactId, relationIds.leadIds, relationIds.opportunityIds))
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit + 1),
    scope,
  );
  if (cursor) query = query.lt('id', cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to load Customer 360 notes');
  const moderator = await loadModerator(scope.tenantId, actorUserId);
  const rows = (data ?? []) as unknown as DbRow[];
  const items = rows.slice(0, limit).map((row) => mapNote(row, actorUserId, moderator));
  return {
    items,
    nextCursor: rows.length > limit ? (items.at(-1)?.id ?? null) : null,
    hasMore: rows.length > limit,
  };
}

async function loadTimeline(
  scope: Customer360Scope,
  relationIds: { leadIds: string[]; opportunityIds: string[] },
  limit: number,
  cursor?: string,
  filters?: Pick<Customer360ActivityQuery, 'type' | 'from' | 'to'>,
): Promise<Customer360ActivityPage> {
  const supabase = await createServerSupabaseClient();
  let query = scopeQuery(
    supabase
      .from('crm_timeline_events')
      .select(timelineColumns)
      .or(relationFilter(scope.contactId, relationIds.leadIds, relationIds.opportunityIds))
      .order('occurred_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit + 1),
    scope,
  );
  if (cursor) query = query.lt('id', cursor);
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.from) query = query.gte('occurred_at', filters.from);
  if (filters?.to) query = query.lte('occurred_at', filters.to);
  const { data, error } = await query;
  if (error) throw new Error('Unable to load Customer 360 timeline');
  const rows = (data ?? []) as unknown as DbRow[];
  let items: ActivityItem[];
  try {
    items = deduplicateActivityItems(rows.map(mapActivity));
  } catch {
    throw new Customer360ServiceError(
      'Customer 360 activity could not be deduplicated',
      'ACTIVITY_DEDUPLICATION_ERROR',
    );
  }
  items = items.slice(0, limit);
  return Customer360ActivityPageSchema.parse({
    items,
    nextCursor:
      rows.length > limit ? ((rows.at(limit - 1)?.id as string | undefined) ?? null) : null,
    hasMore: rows.length > limit,
  });
}

async function assertContact(scope: Customer360Scope) {
  const contact = await getContactById(scope.tenantId, scope.contactId);
  if (!contact)
    throw new Customer360ServiceError('Customer 360 contact was not found', 'NOT_FOUND');
  return contact;
}

async function buildRecord(
  scope: Customer360Scope,
  actorUserId: string,
  options: {
    sections?: Customer360Section[];
    limits: Customer360ReadQuery['limits'];
  },
): Promise<Customer360RecordView> {
  const contact = await assertContact(scope);
  const requested = new Set(options.sections ?? ALL_SECTIONS);
  requested.add('profile');
  const leadsPromise = requested.has('leads')
    ? loadLeads(scope, options.limits.leads)
    : Promise.resolve({ items: [] as CrmLead[], nextCursor: null, hasMore: false });
  const opportunitiesPromise = requested.has('opportunities')
    ? loadOpportunities(scope, options.limits.opportunities)
    : Promise.resolve({ items: [] as CrmOpportunity[], nextCursor: null, hasMore: false });
  const relationIdsPromise =
    requested.has('tasks') || requested.has('notes') || requested.has('timeline')
      ? loadRelationIds(scope)
      : Promise.resolve({ leadIds: [], opportunityIds: [] });
  const [leadsResult, opportunitiesResult, relationIdsResult] = await Promise.allSettled([
    leadsPromise,
    opportunitiesPromise,
    relationIdsPromise,
  ]);
  const leads = leadsResult.status === 'fulfilled' ? leadsResult.value : null;
  const opportunities =
    opportunitiesResult.status === 'fulfilled' ? opportunitiesResult.value : null;
  const relationIds =
    relationIdsResult.status === 'fulfilled'
      ? relationIdsResult.value
      : {
          leadIds: leads?.items.map((lead) => lead.id) ?? [],
          opportunityIds: opportunities?.items.map((opportunity) => opportunity.id) ?? [],
        };

  const tasksPromise = requested.has('tasks')
    ? loadTasks(scope, relationIds, options.limits.tasks)
    : Promise.resolve({ items: [] as Task[], nextCursor: null, hasMore: false });
  const notesPromise = requested.has('notes')
    ? loadNotes(scope, relationIds, actorUserId, options.limits.notes)
    : Promise.resolve({ items: [] as AuthorizedNoteSummary[], nextCursor: null, hasMore: false });
  const timelinePromise = requested.has('timeline')
    ? loadTimeline(scope, relationIds, options.limits.timeline)
    : Promise.resolve({ items: [], nextCursor: null, hasMore: false });
  const [tasksResult, notesResult, timelineResult] = await Promise.allSettled([
    tasksPromise,
    notesPromise,
    timelinePromise,
  ]);
  const tasks = tasksResult.status === 'fulfilled' ? tasksResult.value : null;
  const notes = notesResult.status === 'fulfilled' ? notesResult.value : null;
  const timeline = timelineResult.status === 'fulfilled' ? timelineResult.value : null;
  const state = {
    profile: 'fresh' as const,
    leads: leads
      ? ('fresh' as const)
      : requested.has('leads')
        ? ('error' as const)
        : ('loading' as const),
    opportunities: opportunities
      ? ('fresh' as const)
      : requested.has('opportunities')
        ? ('error' as const)
        : ('loading' as const),
    tasks: tasks
      ? ('fresh' as const)
      : requested.has('tasks')
        ? ('error' as const)
        : ('loading' as const),
    notes: notes
      ? ('fresh' as const)
      : requested.has('notes')
        ? ('error' as const)
        : ('loading' as const),
    timeline: timeline
      ? ('fresh' as const)
      : requested.has('timeline')
        ? ('error' as const)
        : ('loading' as const),
  };
  return Customer360RecordViewSchema.parse({
    view: 'record',
    contact,
    leads: leads?.items ?? [],
    opportunities: opportunities?.items ?? [],
    tasks: tasks?.items ?? [],
    notes: notes?.items ?? [],
    timeline: timeline?.items ?? [],
    cursors: {
      leads: leads?.nextCursor ?? null,
      opportunities: opportunities?.nextCursor ?? null,
      tasks: tasks?.nextCursor ?? null,
      notes: notes?.nextCursor ?? null,
      timeline: timeline?.nextCursor ?? null,
    },
    sectionState: state,
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

const defaultLimits: Customer360ReadQuery['limits'] = {
  leads: 25,
  opportunities: 25,
  tasks: 25,
  notes: 25,
  timeline: 25,
};

export async function getCustomer360(
  input: Customer360Scope & {
    actorUserId: string;
    limits?: Partial<Customer360ReadQuery['limits']>;
  },
) {
  return buildRecord(input, input.actorUserId, {
    limits: { ...defaultLimits, ...input.limits },
  });
}

export async function getCustomer360Read(input: Customer360ReadQuery, actorUserId: string) {
  const limits = input.limits;
  if (input.view === 'record')
    return buildRecord(input, actorUserId, { sections: input.sections, limits });

  const record = await buildRecord(input, actorUserId, {
    sections:
      input.view === 'split'
        ? (input.sections ?? ['profile', 'leads', 'opportunities', 'tasks', 'timeline'])
        : (input.sections ?? ALL_SECTIONS),
    limits,
  });
  if (input.view === 'split')
    return Customer360SplitViewSchema.parse({
      view: 'split',
      contact: record.contact,
      leads: record.leads,
      opportunities: record.opportunities,
      tasks: record.tasks,
      timeline: record.timeline,
      cursors: {
        leads: record.cursors.leads,
        opportunities: record.cursors.opportunities,
        tasks: record.cursors.tasks,
        timeline: record.cursors.timeline,
      },
      sectionState: record.sectionState,
      sectionPermissions: record.sectionPermissions,
    });

  return Customer360OverviewViewSchema.parse({
    view: 'overview',
    contact: record.contact,
    summary: {
      leadCount: record.leads.length,
      opportunityCount: record.opportunities.length,
      openTaskCount: record.tasks.filter((task) => ['open', 'in_progress'].includes(task.status))
        .length,
      overdueTaskCount: record.tasks.filter(
        (task) =>
          task.dueAt && new Date(task.dueAt).getTime() < Date.now() && task.status !== 'completed',
      ).length,
      noteCount: record.notes.length,
      activityCount: record.timeline.length,
    },
    timeline: record.timeline,
    cursors: { timeline: record.cursors.timeline },
    sectionState: record.sectionState,
    sectionPermissions: record.sectionPermissions,
  });
}

export async function listCustomer360Section(
  input: Customer360SectionQuery,
  actorUserId: string,
): Promise<Customer360SectionPage> {
  const scope = Customer360ScopeSchema.parse(input);
  await assertContact(scope);
  const relationIds = ['tasks', 'notes', 'timeline'].includes(input.section)
    ? await loadRelationIds(scope)
    : { leadIds: [], opportunityIds: [] };
  try {
    const result =
      input.section === 'profile'
        ? { items: [await assertContact(scope)], nextCursor: null, hasMore: false }
        : input.section === 'leads'
          ? await loadLeads(scope, input.limit, input.cursor)
          : input.section === 'opportunities'
            ? await loadOpportunities(scope, input.limit, input.cursor)
            : input.section === 'tasks'
              ? await loadTasks(scope, relationIds, input.limit, input.cursor)
              : input.section === 'notes'
                ? await loadNotes(scope, relationIds, actorUserId, input.limit, input.cursor)
                : await loadTimeline(scope, relationIds, input.limit, input.cursor);
    return Customer360SectionPageSchema.parse({
      section: input.section,
      items: result.items,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      state: 'fresh',
    });
  } catch (error) {
    if (error instanceof Customer360ServiceError) throw error;
    return Customer360SectionPageSchema.parse({
      section: input.section,
      items: [],
      nextCursor: null,
      hasMore: false,
      state: 'error',
    });
  }
}

export async function listCustomer360Activity(
  input: Customer360ActivityQuery,
): Promise<Customer360ActivityPage> {
  const parsed = Customer360ActivityQuerySchema.parse(input);
  const scope = Customer360ScopeSchema.parse(parsed);
  await assertContact(scope);
  return loadTimeline(scope, await loadRelationIds(scope), parsed.limit, parsed.cursor, parsed);
}

async function assertContextRelation(
  scope: Customer360Scope,
  relationType: 'contact' | 'lead' | 'opportunity',
  relationId: string,
) {
  if (relationType === 'contact') {
    if (relationId !== scope.contactId)
      throw new Customer360ServiceError(
        'Context relation is outside the contact scope',
        'CROSS_TENANT_REFERENCE',
      );
    return;
  }
  const supabase = await createServerSupabaseClient();
  const table = relationType === 'lead' ? 'crm_leads' : 'crm_opportunities';
  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('id', relationId)
    .eq('organization_id', scope.tenantId)
    .eq('contact_id', scope.contactId)
    .maybeSingle();
  if (error) throw new Error('Unable to resolve Customer 360 context relation');
  if (!data)
    throw new Customer360ServiceError(
      'Context relation is outside the contact scope',
      'CROSS_TENANT_REFERENCE',
    );
}

export async function createContextTask(input: CreateContextTaskCommand & { actorUserId: string }) {
  const parsed = CreateContextTaskCommandSchema.parse(input);
  const scope = Customer360ScopeSchema.parse(parsed);
  const relationId = parsed.relationId ?? scope.contactId;
  await assertContact(scope);
  await assertContextRelation(scope, parsed.relationType, relationId);
  return createTask({
    organizationId: scope.tenantId,
    workspaceId: scope.workspaceId,
    brandId: scope.brandId,
    title: parsed.title,
    description: parsed.description,
    priority: parsed.priority,
    type: parsed.type,
    assignedUserId: parsed.assignedUserId ?? null,
    dueAt: parsed.dueAt ?? null,
    relationType: parsed.relationType,
    relationId,
    idempotencyKey: parsed.idempotencyKey,
    actorUserId: input.actorUserId,
  });
}

export async function createContextNote(input: CreateContextNoteCommand & { actorUserId: string }) {
  const parsed = CreateContextNoteCommandSchema.parse(input);
  const scope = Customer360ScopeSchema.parse(parsed);
  const relationId = parsed.relationId ?? scope.contactId;
  await assertContact(scope);
  await assertContextRelation(scope, parsed.relationType, relationId);
  return createNote({
    organizationId: scope.tenantId,
    workspaceId: scope.workspaceId,
    brandId: scope.brandId,
    relationType: parsed.relationType,
    relationId,
    body: parsed.body,
    idempotencyKey: parsed.idempotencyKey,
    actorUserId: input.actorUserId,
  });
}
