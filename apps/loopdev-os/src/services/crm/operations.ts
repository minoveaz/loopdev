import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Json } from '@/types/database.types';

function toJson(value: Record<string, unknown> | null | undefined): Json | null {
  return value == null ? null : (JSON.parse(JSON.stringify(value)) as Json);
}

export async function createCrmActivity(input: {
  organizationId: string;
  leadId: string;
  actorUserId?: string | null;
  type: string;
  summary: string;
  details?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('crm_activities')
    .insert({
      organization_id: input.organizationId,
      lead_id: input.leadId,
      actor_user_id: input.actorUserId ?? null,
      type: input.type,
      summary: input.summary,
      details: input.details ?? null,
      metadata: toJson(input.metadata) ?? {},
    })
    .select()
    .single();
  if (error) throw new Error('Unable to create CRM activity');
  return data;
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
    .select()
    .single();
  if (error) throw new Error('Unable to create CRM note');
  return data;
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
