import {
  AssignTaskCommandSchema,
  CompleteTaskCommandSchema,
  CreateNoteCommandSchema,
  CreateTaskCommandSchema,
  NoteReadSchema,
  ReopenTaskCommandSchema,
  TaskPageSchema,
  TaskQuerySchema,
  TaskSchema,
  TimelinePageSchema,
  TimelineQuerySchema,
  TimelineEventSchema,
  UpdateNoteCommandSchema,
  UpdateTaskCommandSchema,
} from '@loopdev/contracts';
import type {
  AssignTaskCommand,
  CompleteTaskCommand,
  CreateNoteCommand,
  CreateTaskCommand,
  NoteRead,
  ReopenTaskCommand,
  Task,
  TaskQuery,
  TimelineEvent,
  TimelineQuery,
  UpdateNoteCommand,
  UpdateTaskCommand,
} from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type DbRow = Record<string, unknown>;

const NIL_UUID = '00000000-0000-4000-8000-000000000000';
const taskColumns =
  'id, organization_id, workspace_id, brand_id, relation_type, relation_id, title, description, status, priority, type, assigned_to_user_id, created_by_user_id, due_at, completed_at, version, idempotency_fingerprint, created_at, updated_at';
const noteColumns =
  'id, organization_id, workspace_id, brand_id, relation_type, relation_id, author_user_id, body, visibility, version, idempotency_fingerprint, created_at, updated_at';
const timelineColumns =
  'id, organization_id, workspace_id, brand_id, relation_type, relation_id, type, actor_id, actor_type, origin, occurred_at, summary, metadata, source_type, source_id';

export class TaskServiceError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'NOT_FOUND'
      | 'CONFLICT'
      | 'IDEMPOTENCY_CONFLICT'
      | 'RELATION_REQUIRED'
      | 'RELATION_NOT_FOUND'
      | 'INVALID_STATUS_TRANSITION'
      | 'ASSIGNMENT_FORBIDDEN'
      | 'DUE_DATE_INVALID'
      | 'NOTE_EDIT_FORBIDDEN'
      | 'NOTE_MODERATION_FORBIDDEN'
      | 'RELATION_CHANGE_FORBIDDEN'
      | 'CROSS_TENANT_REFERENCE',
  ) {
    super(message);
    this.name = 'TaskServiceError';
  }
}

type ActorInput = { actorUserId: string };

function timestamp(value: unknown): string {
  const raw = String(value);
  return raw.includes('T')
    ? raw.replace(/\+00:00$/, 'Z')
    : raw.replace(' ', 'T').replace(/\+00:00$/, 'Z');
}

function fingerprint(value: unknown) {
  return JSON.stringify(value);
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

function mapNote(row: DbRow, actorUserId: string, canModerate: boolean, redact = true): NoteRead {
  const canEdit = row.author_user_id === actorUserId || canModerate;
  const canReadBody = canEdit || row.visibility !== 'private';
  return NoteReadSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    tenantId: row.organization_id,
    workspaceId: row.workspace_id ?? null,
    brandId: row.brand_id ?? null,
    relationType: row.relation_type,
    relationId: row.relation_id,
    authorId: row.author_user_id,
    body: redact && !canReadBody ? null : row.body,
    permissions: { canEdit, canModerate },
    version: Number(row.version ?? 1),
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
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

async function getDb() {
  return createServerSupabaseClient();
}

async function loadTask(organizationId: string, taskId: string) {
  const supabase = await getDb();
  const { data, error } = await supabase
    .from('crm_tasks')
    .select(taskColumns)
    .eq('organization_id', organizationId)
    .eq('id', taskId)
    .maybeSingle();
  if (error) throw new Error('Unable to load CRM task');
  return (data as DbRow | null) ?? null;
}

async function loadNote(organizationId: string, noteId: string) {
  const supabase = await getDb();
  const { data, error } = await supabase
    .from('crm_notes')
    .select(noteColumns)
    .eq('organization_id', organizationId)
    .eq('id', noteId)
    .maybeSingle();
  if (error) throw new Error('Unable to load CRM note');
  return (data as DbRow | null) ?? null;
}

async function loadRelationScope(
  organizationId: string,
  relationType: CreateTaskCommand['relationType'],
  relationId: string,
) {
  const supabase = await getDb();
  const table = relationType === 'contact'
    ? 'crm_contacts'
    : relationType === 'lead'
      ? 'crm_leads'
      : 'crm_opportunities';
  const columns = relationType === 'contact' ? 'id, organization_id' : 'id, organization_id, workspace_id, brand_id';
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq('id', relationId)
    .eq('organization_id', organizationId)
    .maybeSingle();
  if (error) throw new Error('Unable to resolve CRM task relation');
  if (!data) throw new TaskServiceError('CRM relation was not found', 'RELATION_NOT_FOUND');
  return data as unknown as DbRow;
}

function scopedRelation(
  input: { workspaceId?: string | null; brandId?: string | null },
  relation: DbRow,
) {
  const workspaceId = (relation.workspace_id as string | null | undefined) ?? input.workspaceId ?? null;
  const brandId = (relation.brand_id as string | null | undefined) ?? input.brandId ?? null;
  if (relation.workspace_id && input.workspaceId && relation.workspace_id !== input.workspaceId)
    throw new TaskServiceError('CRM relation is outside the workspace scope', 'CROSS_TENANT_REFERENCE');
  if (relation.brand_id && input.brandId && relation.brand_id !== input.brandId)
    throw new TaskServiceError('CRM relation is outside the brand scope', 'CROSS_TENANT_REFERENCE');
  return { workspaceId, brandId };
}

async function existingOperation(organizationId: string, operationKey: string, operationFingerprint: string) {
  const supabase = await getDb();
  const { data, error } = await supabase
    .from('crm_timeline_events')
    .select('source_type, source_id, operation_fingerprint')
    .eq('organization_id', organizationId)
    .eq('operation_key', operationKey)
    .maybeSingle();
  if (error) throw new Error('Unable to resolve CRM task idempotency');
  if (!data) return null;
  if (data.operation_fingerprint !== operationFingerprint)
    throw new TaskServiceError('CRM operation idempotency key was reused', 'IDEMPOTENCY_CONFLICT');
  return data as DbRow;
}

async function assignedUserAllowed(organizationId: string, userId: string | null) {
  if (!userId) return true;
  const supabase = await getDb();
  const { data, error } = await supabase
    .from('organization_memberships')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error('Unable to resolve CRM assignee');
  return Boolean(data && ['owner', 'admin', 'agent'].includes(String(data.role)));
}

async function isModerator(organizationId: string, userId: string) {
  const supabase = await getDb();
  const { data, error } = await supabase
    .from('organization_memberships')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error('Unable to resolve CRM note permissions');
  return Boolean(data && ['owner', 'admin'].includes(String(data.role)));
}

function operationReplay(
  operation: DbRow | null,
  expectedSourceType: 'task' | 'note',
) {
  if (!operation) return null;
  if (operation.source_type !== expectedSourceType)
    throw new TaskServiceError('CRM operation idempotency key was reused', 'IDEMPOTENCY_CONFLICT');
  return String(operation.source_id);
}

export async function createTask(input: CreateTaskCommand & ActorInput) {
  const parsed = CreateTaskCommandSchema.parse(input);
  const relation = await loadRelationScope(parsed.organizationId, parsed.relationType, parsed.relationId);
  const scope = scopedRelation(parsed, relation);
  if (!(await assignedUserAllowed(parsed.organizationId, parsed.assignedUserId)))
    throw new TaskServiceError('Task assignee is not allowed', 'ASSIGNMENT_FORBIDDEN');

  const operationFingerprint = fingerprint({
    title: parsed.title,
    description: parsed.description ?? null,
    priority: parsed.priority,
    type: parsed.type ?? null,
    assignedUserId: parsed.assignedUserId,
    dueAt: parsed.dueAt,
    relationType: parsed.relationType,
    relationId: parsed.relationId,
    workspaceId: scope.workspaceId,
    brandId: scope.brandId,
  });
  const priorOperation = await existingOperation(
    parsed.organizationId,
    parsed.idempotencyKey,
    operationFingerprint,
  );
  const priorTaskId = operationReplay(priorOperation, 'task');
  if (priorTaskId) {
    const replay = await loadTask(parsed.organizationId, priorTaskId);
    if (!replay) throw new TaskServiceError('CRM task was not found', 'NOT_FOUND');
    return { task: mapTask(replay), created: false };
  }
  const supabase = await getDb();
  const { data: existing, error: existingError } = await supabase
    .from('crm_tasks')
    .select(taskColumns)
    .eq('organization_id', parsed.organizationId)
    .eq('idempotency_key', parsed.idempotencyKey)
    .maybeSingle();
  if (existingError) throw new Error('Unable to resolve CRM task idempotency');
  if (existing) {
    if (existing.idempotency_fingerprint !== operationFingerprint)
      throw new TaskServiceError('CRM operation idempotency key was reused', 'IDEMPOTENCY_CONFLICT');
    return { task: mapTask(existing as DbRow), created: false };
  }

  const payload = {
    organization_id: parsed.organizationId,
    workspace_id: scope.workspaceId,
    brand_id: scope.brandId,
    relation_type: parsed.relationType,
    relation_id: parsed.relationId,
    lead_id: parsed.relationType === 'lead' ? parsed.relationId : null,
    title: parsed.title,
    description: parsed.description ?? null,
    status: 'open',
    priority: parsed.priority,
    type: parsed.type ?? null,
    assigned_to_user_id: parsed.assignedUserId,
    created_by_user_id: input.actorUserId,
    last_actor_user_id: input.actorUserId,
    due_at: parsed.dueAt,
    version: 1,
    idempotency_key: parsed.idempotencyKey,
    idempotency_fingerprint: operationFingerprint,
    last_operation_key: parsed.idempotencyKey,
    last_operation_fingerprint: operationFingerprint,
  };
  const { data, error } = await supabase
    .from('crm_tasks')
    .insert(payload as never)
    .select(taskColumns)
    .single();
  if (error) {
    if (error.code === '23505') {
      const raced = await supabase
        .from('crm_tasks')
        .select(taskColumns)
        .eq('organization_id', parsed.organizationId)
        .eq('idempotency_key', parsed.idempotencyKey)
        .maybeSingle();
      if (raced.data && raced.data.idempotency_fingerprint === operationFingerprint)
        return { task: mapTask(raced.data as DbRow), created: false };
    }
    throw new Error('Unable to create CRM task');
  }
  return { task: mapTask(data as DbRow), created: true };
}

async function mutateTask(
  command:
    | UpdateTaskCommand
    | CompleteTaskCommand
    | ReopenTaskCommand
    | AssignTaskCommand,
  actorUserId: string,
  action: 'update' | 'complete' | 'reopen' | 'assign',
) {
  const parsed = command;
  const operationFingerprint = fingerprint({ action, ...parsed });
  const operation = await existingOperation(parsed.organizationId, parsed.idempotencyKey, operationFingerprint);
  const replayId = operationReplay(operation, 'task');
  if (replayId) {
    const replay = await loadTask(parsed.organizationId, replayId);
    if (!replay) throw new TaskServiceError('CRM task was not found', 'NOT_FOUND');
    return mapTask(replay);
  }

  const current = await loadTask(parsed.organizationId, parsed.taskId);
  if (!current) throw new TaskServiceError('CRM task was not found', 'NOT_FOUND');
  if (Number(current.version) !== parsed.expectedVersion)
    throw new TaskServiceError('CRM task update conflict', 'CONFLICT');

  const changes: Record<string, unknown> = {
    version: parsed.expectedVersion + 1,
    updated_at: new Date().toISOString(),
    last_actor_user_id: actorUserId,
    last_operation_key: parsed.idempotencyKey,
    last_operation_fingerprint: operationFingerprint,
  };
  if (action === 'update') {
    const update = UpdateTaskCommandSchema.parse(command);
    Object.assign(changes, {
      ...(update.title !== undefined ? { title: update.title } : {}),
      ...(update.description !== undefined ? { description: update.description } : {}),
      ...(update.priority !== undefined ? { priority: update.priority } : {}),
      ...(update.type !== undefined ? { type: update.type } : {}),
      ...(update.dueAt !== undefined ? { due_at: update.dueAt } : {}),
    });
  } else if (action === 'complete') {
    if (!['open', 'in_progress'].includes(String(current.status)))
      throw new TaskServiceError('CRM task status transition is not allowed', 'INVALID_STATUS_TRANSITION');
    changes.status = 'completed';
  } else if (action === 'reopen') {
    const reopen = ReopenTaskCommandSchema.parse(command);
    if (!['completed', 'cancelled'].includes(String(current.status)))
      throw new TaskServiceError('CRM task status transition is not allowed', 'INVALID_STATUS_TRANSITION');
    changes.status = 'open';
    changes.reopen_reason = reopen.reason;
  } else {
    const assign = AssignTaskCommandSchema.parse(command);
    if (!(await assignedUserAllowed(parsed.organizationId, assign.assignedUserId)))
      throw new TaskServiceError('Task assignee is not allowed', 'ASSIGNMENT_FORBIDDEN');
    changes.assigned_to_user_id = assign.assignedUserId;
  }

  const supabase = await getDb();
  const { data, error } = await supabase
    .from('crm_tasks')
    .update(changes as never)
    .eq('organization_id', parsed.organizationId)
    .eq('id', parsed.taskId)
    .eq('version', parsed.expectedVersion)
    .select(taskColumns)
    .maybeSingle();
  if (error) {
    if (error.code === '23505') {
      const raced = await existingOperation(parsed.organizationId, parsed.idempotencyKey, operationFingerprint);
      const racedId = operationReplay(raced, 'task');
      if (racedId) {
        const replay = await loadTask(parsed.organizationId, racedId);
        if (replay) return mapTask(replay);
      }
    }
    if (error.code === '23514') throw new TaskServiceError('CRM task status transition is not allowed', 'INVALID_STATUS_TRANSITION');
    throw new Error('Unable to update CRM task');
  }
  if (!data) throw new TaskServiceError('CRM task update conflict', 'CONFLICT');
  return mapTask(data as DbRow);
}

export function updateTask(input: UpdateTaskCommand & ActorInput) {
  const parsed = UpdateTaskCommandSchema.parse(input);
  return mutateTask(parsed, input.actorUserId, 'update');
}

export function completeTask(input: CompleteTaskCommand & ActorInput) {
  const parsed = CompleteTaskCommandSchema.parse(input);
  return mutateTask(parsed, input.actorUserId, 'complete');
}

export function reopenTask(input: ReopenTaskCommand & ActorInput) {
  const parsed = ReopenTaskCommandSchema.parse(input);
  return mutateTask(parsed, input.actorUserId, 'reopen');
}

export function assignTask(input: AssignTaskCommand & ActorInput) {
  const parsed = AssignTaskCommandSchema.parse(input);
  return mutateTask(parsed, input.actorUserId, 'assign');
}

export async function listTasks(input: TaskQuery): Promise<ReturnType<typeof TaskPageSchema.parse>> {
  const parsed = TaskQuerySchema.parse(input);
  const supabase = await getDb();
  let query = supabase
    .from('crm_tasks')
    .select(taskColumns)
    .eq('organization_id', parsed.organizationId)
    .order('id', { ascending: true })
    .limit(parsed.limit + 1);
  if (parsed.workspaceId) query = query.eq('workspace_id', parsed.workspaceId);
  if (parsed.brandId) query = query.eq('brand_id', parsed.brandId);
  if (parsed.status) query = query.eq('status', parsed.status);
  if (parsed.assignedUserId) query = query.eq('assigned_to_user_id', parsed.assignedUserId);
  if (parsed.priority) query = query.eq('priority', parsed.priority);
  if (parsed.relationType) query = query.eq('relation_type', parsed.relationType);
  if (parsed.cursor) query = query.gt('id', parsed.cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM tasks');
  const rows = (data ?? []) as DbRow[];
  const items = rows.slice(0, parsed.limit).map(mapTask);
  return TaskPageSchema.parse({
    items,
    nextCursor: rows.length > parsed.limit ? items.at(-1)?.id ?? null : null,
    hasMore: rows.length > parsed.limit,
  });
}

export async function getTask(organizationId: string, taskId: string) {
  const row = await loadTask(organizationId, taskId);
  return row ? mapTask(row) : null;
}

export async function createNote(input: CreateNoteCommand & ActorInput) {
  const parsed = CreateNoteCommandSchema.parse(input);
  const relation = await loadRelationScope(parsed.organizationId, parsed.relationType, parsed.relationId);
  const scope = scopedRelation(parsed, relation);
  const operationFingerprint = fingerprint({
    relationType: parsed.relationType,
    relationId: parsed.relationId,
    body: parsed.body,
    workspaceId: scope.workspaceId,
    brandId: scope.brandId,
  });
  const supabase = await getDb();
  const { data: existing, error: existingError } = await supabase
    .from('crm_notes')
    .select(noteColumns)
    .eq('organization_id', parsed.organizationId)
    .eq('idempotency_key', parsed.idempotencyKey)
    .maybeSingle();
  if (existingError) throw new Error('Unable to resolve CRM note idempotency');
  if (existing) {
    if (existing.idempotency_fingerprint !== operationFingerprint)
      throw new TaskServiceError('CRM operation idempotency key was reused', 'IDEMPOTENCY_CONFLICT');
    return { note: mapNote(existing as DbRow, input.actorUserId, await isModerator(parsed.organizationId, input.actorUserId), false), created: false };
  }

  const payload = {
    organization_id: parsed.organizationId,
    workspace_id: scope.workspaceId,
    brand_id: scope.brandId,
    relation_type: parsed.relationType,
    relation_id: parsed.relationId,
    contact_id: parsed.relationType === 'contact' ? parsed.relationId : null,
    lead_id: parsed.relationType === 'lead' ? parsed.relationId : null,
    opportunity_id: parsed.relationType === 'opportunity' ? parsed.relationId : null,
    author_user_id: input.actorUserId,
    last_actor_user_id: input.actorUserId,
    body: parsed.body,
    visibility: 'team',
    version: 1,
    idempotency_key: parsed.idempotencyKey,
    idempotency_fingerprint: operationFingerprint,
    last_operation_key: parsed.idempotencyKey,
    last_operation_fingerprint: operationFingerprint,
  };
  const { data, error } = await supabase
    .from('crm_notes')
    .insert(payload as never)
    .select(noteColumns)
    .single();
  if (error) {
    if (error.code === '23505') {
      const raced = await existingOperation(
        parsed.organizationId,
        parsed.idempotencyKey,
        operationFingerprint,
      );
      const racedNoteId = operationReplay(raced, 'note');
      if (racedNoteId) {
        const replay = await loadNote(parsed.organizationId, racedNoteId);
        if (replay) {
          return {
            note: mapNote(
              replay,
              input.actorUserId,
              await isModerator(parsed.organizationId, input.actorUserId),
              false,
            ),
            created: false,
          };
        }
      }
    }
    throw new Error('Unable to create CRM note');
  }
  return {
    note: mapNote(data as DbRow, input.actorUserId, await isModerator(parsed.organizationId, input.actorUserId), false),
    created: true,
  };
}

export async function updateNote(input: UpdateNoteCommand & ActorInput) {
  const parsed = UpdateNoteCommandSchema.parse(input);
  const operationFingerprint = fingerprint(parsed);
  const operation = await existingOperation(parsed.organizationId, parsed.idempotencyKey, operationFingerprint);
  const replayId = operationReplay(operation, 'note');
  const moderator = await isModerator(parsed.organizationId, input.actorUserId);
  if (replayId) {
    const replay = await loadNote(parsed.organizationId, replayId);
    if (!replay) throw new TaskServiceError('CRM note was not found', 'NOT_FOUND');
    return mapNote(replay, input.actorUserId, moderator, false);
  }

  const current = await loadNote(parsed.organizationId, parsed.noteId);
  if (!current) throw new TaskServiceError('CRM note was not found', 'NOT_FOUND');
  if (current.author_user_id !== input.actorUserId && !moderator)
    throw new TaskServiceError('CRM note edit is forbidden', 'NOTE_EDIT_FORBIDDEN');
  if (Number(current.version) !== parsed.expectedVersion)
    throw new TaskServiceError('CRM note update conflict', 'CONFLICT');

  const supabase = await getDb();
  const { data, error } = await supabase
    .from('crm_notes')
    .update({
      body: parsed.body,
      version: parsed.expectedVersion + 1,
      last_actor_user_id: input.actorUserId,
      last_operation_key: parsed.idempotencyKey,
      last_operation_fingerprint: operationFingerprint,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('organization_id', parsed.organizationId)
    .eq('id', parsed.noteId)
    .eq('version', parsed.expectedVersion)
    .select(noteColumns)
    .maybeSingle();
  if (error) throw new Error('Unable to update CRM note');
  if (!data) throw new TaskServiceError('CRM note update conflict', 'CONFLICT');
  return mapNote(data as DbRow, input.actorUserId, moderator, false);
}

export async function listNotes(
  organizationId: string,
  actorUserId: string,
  input: { workspaceId?: string; cursor?: string; limit: number },
) {
  const supabase = await getDb();
  let query = supabase
    .from('crm_notes')
    .select(noteColumns)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(input.limit + 1);
  if (input.workspaceId) query = query.eq('workspace_id', input.workspaceId);
  if (input.cursor) query = query.lt('id', input.cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM notes');
  const moderator = await isModerator(organizationId, actorUserId);
  const rows = (data ?? []) as DbRow[];
  const items = rows.slice(0, input.limit).map((row) => mapNote(row, actorUserId, moderator));
  return { items, nextCursor: rows.length > input.limit ? items.at(-1)?.id ?? null : null, hasMore: rows.length > input.limit };
}

export async function listTimeline(input: TimelineQuery) {
  const parsed = TimelineQuerySchema.parse(input);
  const supabase = await getDb();
  let query = supabase
    .from('crm_timeline_events')
    .select(timelineColumns)
    .eq('organization_id', parsed.organizationId)
    .eq('relation_type', parsed.relationType)
    .eq('relation_id', parsed.relationId)
    .order('occurred_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(parsed.limit + 1);
  if (parsed.workspaceId) query = query.eq('workspace_id', parsed.workspaceId);
  if (parsed.brandId) query = query.eq('brand_id', parsed.brandId);
  if (parsed.cursor) query = query.lt('id', parsed.cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM timeline');
  const rows = (data ?? []) as DbRow[];
  const items = rows.slice(0, parsed.limit).map(mapTimeline);
  return TimelinePageSchema.parse({
    items,
    nextCursor: rows.length > parsed.limit ? items.at(-1)?.id ?? null : null,
    hasMore: rows.length > parsed.limit,
  });
}
