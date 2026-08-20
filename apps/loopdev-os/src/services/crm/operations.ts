import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Json } from '@/types/database.types';

type NoteRow = { id: string; [key: string]: unknown };

function toJson(value: Record<string, unknown> | null | undefined): Json | null {
  return value == null ? null : (JSON.parse(JSON.stringify(value)) as Json);
}

export async function createCrmActivity(input: {
  organizationId: string;
  workspaceId?: string | null;
  leadId: string;
  sourceType?: string;
  sourceId?: string;
  actorUserId?: string | null;
  type: string;
  summary: string;
  details?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createServerSupabaseClient();
  const sourceKey =
    input.sourceType && input.sourceId ? `${input.sourceType}:${input.sourceId}` : null;
  const payload = {
    organization_id: input.organizationId,
    workspace_id: input.workspaceId ?? null,
    lead_id: input.leadId,
    source_type: input.sourceType ?? null,
    source_id: input.sourceId ?? null,
    source_key: sourceKey,
    actor_user_id: input.actorUserId ?? null,
    type: input.type,
    summary: input.summary,
    details: input.details ?? null,
    metadata: toJson(input.metadata) ?? {},
  };
  const query = sourceKey
    ? supabase.from('crm_activities').upsert(payload, {
        onConflict: 'organization_id,source_key',
        ignoreDuplicates: false,
      })
    : supabase.from('crm_activities').insert(payload);
  const { data, error } = await query.select().single();
  if (error) throw new Error('Unable to create CRM activity');
  return data;
}

export async function listCrmActivities(input: {
  organizationId: string;
  workspaceId?: string;
  cursor?: string;
  limit: number;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('crm_activities')
    .select('*')
    .eq('organization_id', input.organizationId)
    .order('occurred_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(input.limit + 1);
  if (input.workspaceId) query = query.eq('workspace_id', input.workspaceId);
  if (input.cursor) query = query.lt('id', input.cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM activities');
  const items = (data as unknown as NoteRow[]).slice(0, input.limit);
  return {
    items,
    nextCursor: data.length > input.limit ? (items[items.length - 1]?.id ?? null) : null,
    hasMore: data.length > input.limit,
  };
}

export async function createCrmTask(input: {
  organizationId: string;
  leadId: string;
  assignedToUserId?: string | null;
  title: string;
  description?: string | null;
  priority?: string;
  dueAt?: string | null;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_tasks')
    .insert({
      organization_id: input.organizationId,
      lead_id: input.leadId,
      assigned_to_user_id: input.assignedToUserId ?? null,
      title: input.title,
      description: input.description ?? null,
      priority: input.priority ?? 'medium',
      due_at: input.dueAt ?? null,
    })
    .select()
    .single();
  if (error) throw new Error('Unable to create CRM task');
  return data;
}

export async function createCrmNote(input: {
  organizationId: string;
  contactId?: string | null;
  leadId?: string | null;
  opportunityId?: string | null;
  authorUserId: string;
  body: string;
  visibility?: string;
}) {
  if (!input.contactId && !input.leadId && !input.opportunityId)
    throw new Error('CRM note requires an entity');
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_notes')
    .insert({
      organization_id: input.organizationId,
      contact_id: input.contactId ?? null,
      lead_id: input.leadId ?? null,
      opportunity_id: input.opportunityId ?? null,
      author_user_id: input.authorUserId,
      body: input.body,
      visibility: input.visibility ?? 'team',
    })
    .select('id')
    .single();
  if (error) throw new Error('Unable to create CRM note');
  const { data: visibleNote, error: visibleError } = await supabase
    .from('crm_notes_visible' as never)
    .select('*')
    .eq('id', (data as unknown as NoteRow).id)
    .eq('organization_id', input.organizationId)
    .single();
  if (visibleError || !visibleNote) throw new Error('Unable to load CRM note');
  return visibleNote as unknown as NoteRow;
}

export async function listCrmNotes(input: {
  organizationId: string;
  workspaceId?: string;
  cursor?: string;
  limit: number;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('crm_notes_visible' as never)
    .select('*')
    .eq('organization_id', input.organizationId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(input.limit + 1);
  if (input.workspaceId) query = query.eq('workspace_id', input.workspaceId);
  if (input.cursor) query = query.lt('id', input.cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM notes');
  const items = (data as unknown as NoteRow[]).slice(0, input.limit);
  return {
    items,
    nextCursor: data.length > input.limit ? (items[items.length - 1]?.id ?? null) : null,
    hasMore: data.length > input.limit,
  };
}

export async function lookupCrmEntities(input: {
  organizationId: string;
  workspaceId?: string;
  query: string;
  cursor?: string;
  limit: number;
}) {
  const supabase = await createServerSupabaseClient();
  let contacts = supabase
    .from('crm_contacts')
    .select('id, first_name, last_name, email')
    .eq('organization_id', input.organizationId)
    .or(
      `first_name.ilike.%${input.query}%,last_name.ilike.%${input.query}%,email.ilike.%${input.query}%`,
    )
    .order('id')
    .limit(input.limit + 1);
  if (input.cursor) contacts = contacts.gt('id', input.cursor);
  const { data, error } = await contacts;
  if (error) throw new Error('Unable to lookup CRM entities');
  const items = data.slice(0, input.limit).map((contact) => ({
    id: contact.id,
    entityType: 'contact' as const,
    label: `${contact.first_name}${contact.last_name ? ` ${contact.last_name}` : ''}`,
    subtitle: contact.email ?? null,
  }));
  return {
    items,
    nextCursor: data.length > input.limit ? (items.at(-1)?.id ?? null) : null,
    hasMore: data.length > input.limit,
  };
}

export async function recordCrmAuditEvent(input: {
  organizationId: string;
  actorUserId?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_audit_events')
    .insert({
      organization_id: input.organizationId,
      actor_user_id: input.actorUserId ?? null,
      entity_type: input.entityType,
      entity_id: input.entityId,
      action: input.action,
      before_state: toJson(input.before),
      after_state: toJson(input.after),
      metadata: toJson(input.metadata) ?? {},
    })
    .select()
    .single();
  if (error) throw new Error('Unable to record CRM audit event');
  return data;
}
