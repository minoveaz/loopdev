import {
  CrmConfigurePipelineStageCommandSchema,
  CrmCreateManualOpportunityCommandSchema,
  CrmMoveOpportunityStageCommandSchema,
  CrmOpportunityQuerySchema,
  CrmOpportunitySchema,
  CrmReopenOpportunityCommandSchema,
  CrmUpdateOpportunityCommandSchema,
  PipelineStageSchema,
} from '@loopdev/contracts';
import type {
  CrmConfigurePipelineStageCommand,
  CrmCreateManualOpportunityCommand,
  CrmMoveOpportunityStageCommand,
  CrmOpportunity,
  CrmOpportunityQuery,
  CrmReopenOpportunityCommand,
  CrmUpdateOpportunityCommand,
  PipelineStage,
} from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database.types';
import { recordCrmAuditEvent } from './operations';
import { normalizeProductKey } from './leads';

export class OpportunityServiceError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'NOT_FOUND'
      | 'CONFLICT'
      | 'IDEMPOTENCY_CONFLICT'
      | 'CONTACT_REQUIRED'
      | 'LEAD_REQUIRED'
      | 'INVALID_STAGE'
      | 'STAGE_TRANSITION_FORBIDDEN'
      | 'INVALID_STAGE_CONFIGURATION'
      | 'REOPEN_FORBIDDEN'
      | 'REOPEN_REASON_REQUIRED',
  ) {
    super(message);
    this.name = 'OpportunityServiceError';
  }
}

type DbRow = Record<string, unknown>;

const opportunityColumns =
  'id, organization_id, workspace_id, brand_id, contact_id, lead_id, name, product_key, stage, stage_key, origin, amount, currency, probability, expected_close_at, assigned_to_user_id, version, idempotency_key, idempotency_fingerprint, created_at, updated_at';
const stageColumns =
  'id, organization_id, workspace_id, key, stage_key, label, position, active, terminal_type, created_at, updated_at';

async function getDb() {
  return createServerSupabaseClient();
}

function timestamp(value: unknown): string {
  const raw = String(value);
  return raw.includes('T')
    ? raw.replace(/\+00:00$/, 'Z')
    : raw.replace(' ', 'T').replace(/\+00:00$/, 'Z');
}

function mapStage(row: DbRow): PipelineStage {
  return PipelineStageSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    tenantId: row.organization_id,
    workspaceId: row.workspace_id,
    key: row.stage_key ?? row.key,
    name: row.label,
    label: row.label,
    stageOrder: row.position,
    position: row.position,
    active: row.active,
    terminalType: row.terminal_type,
    isTerminal: row.terminal_type !== 'open',
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });
}

function mapOpportunity(row: DbRow): CrmOpportunity {
  const stageKey = String(row.stage_key ?? row.stage);
  const legacyStage = [
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
    : undefined;
  return CrmOpportunitySchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    tenantId: row.organization_id,
    workspaceId: row.workspace_id,
    brandId: row.brand_id ?? null,
    contactId: row.contact_id,
    leadId: row.lead_id ?? null,
    productKey: row.product_key,
    stageKey,
    name: row.name,
    stage: legacyStage,
    origin: row.origin,
    amount: row.amount,
    currency: row.currency,
    probability: row.probability,
    expectedCloseAt: row.expected_close_at,
    expectedCloseDate: row.expected_close_at ? String(row.expected_close_at).slice(0, 10) : null,
    assignedUserId: row.assigned_to_user_id ?? null,
    activityHealth: 'unknown',
    lastActivity: null,
    version: row.version ?? 1,
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });
}

function fingerprint(input: CrmCreateManualOpportunityCommand) {
  return JSON.stringify({
    workspaceId: input.workspaceId ?? null,
    brandId: input.brandId ?? null,
    contactId: input.contactId,
    productKey: normalizeProductKey(input.productKey),
    name: input.name,
    amount: input.amount ?? null,
    currency: input.currency,
    probability: input.probability ?? null,
    expectedCloseDate: input.expectedCloseDate ?? null,
    expectedCloseAt: input.expectedCloseAt ?? null,
    assignedUserId: input.assignedUserId ?? null,
  });
}

async function loadOpportunity(
  organizationId: string,
  opportunityId: string,
): Promise<DbRow | null> {
  const supabase = await getDb();
  const { data, error } = await supabase
    .from('crm_opportunities')
    .select(opportunityColumns)
    .eq('organization_id', organizationId)
    .eq('id', opportunityId)
    .maybeSingle();
  if (error) throw new Error('Unable to load CRM opportunity');
  return (data as DbRow | null) ?? null;
}

async function loadStage(
  organizationId: string,
  stageKey: string,
  workspaceId?: string | null,
  activeOnly = true,
): Promise<DbRow | null> {
  const supabase = await getDb();
  let query = supabase
    .from('crm_pipeline_stages')
    .select(stageColumns)
    .eq('organization_id', organizationId)
    .eq('stage_key', stageKey)
    .order('workspace_id', { ascending: false, nullsFirst: false })
    .limit(1);
  if (workspaceId) query = query.or(`workspace_id.eq.${workspaceId},workspace_id.is.null`);
  else query = query.is('workspace_id', null);
  if (activeOnly) query = query.eq('active', true);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error('Unable to resolve CRM pipeline stage');
  return (data as DbRow | null) ?? null;
}

async function loadDefaultStage(organizationId: string, workspaceId?: string | null) {
  const supabase = await getDb();
  let query = supabase
    .from('crm_pipeline_stages')
    .select(stageColumns)
    .eq('organization_id', organizationId)
    .eq('active', true)
    .eq('terminal_type', 'open')
    .order('position', { ascending: true })
    .limit(1);
  if (workspaceId) query = query.or(`workspace_id.eq.${workspaceId},workspace_id.is.null`);
  else query = query.is('workspace_id', null);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error('Unable to resolve CRM default stage');
  return (data as DbRow | null) ?? null;
}

async function appendStageHistory(
  organizationId: string,
  opportunityId: string,
  fromStageKey: string | null,
  toStageKey: string,
  version: number,
  origin: string,
  reason: string | null | undefined,
  actorUserId: string | null | undefined,
) {
  const supabase = await getDb();
  const { error } = await supabase.from('crm_opportunity_stage_history').insert({
    organization_id: organizationId,
    opportunity_id: opportunityId,
    from_stage_key: fromStageKey,
    to_stage_key: toStageKey,
    opportunity_version: version,
    origin,
    reason: reason ?? null,
    actor_user_id: actorUserId ?? null,
  });
  if (error) throw new Error('Unable to append CRM opportunity stage history');
}

export async function listPipelineStages(input: {
  organizationId: string;
  workspaceId?: string;
}): Promise<PipelineStage[]> {
  const supabase = await getDb();
  let query = supabase
    .from('crm_pipeline_stages')
    .select(stageColumns)
    .eq('organization_id', input.organizationId)
    .order('position', { ascending: true });
  if (input.workspaceId)
    query = query.or(`workspace_id.eq.${input.workspaceId},workspace_id.is.null`);
  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM pipeline stages');
  return ((data ?? []) as DbRow[]).map(mapStage);
}

export async function listOpportunities(input: CrmOpportunityQuery) {
  const parsed = CrmOpportunityQuerySchema.parse(input);
  const supabase = await getDb();
  let query = supabase
    .from('crm_opportunities')
    .select(opportunityColumns)
    .eq('organization_id', parsed.organizationId)
    .order('id', { ascending: true })
    .limit(parsed.limit + 1);
  if (parsed.workspaceId) query = query.eq('workspace_id', parsed.workspaceId);
  if (parsed.brandId) query = query.eq('brand_id', parsed.brandId);
  if (parsed.contactId) query = query.eq('contact_id', parsed.contactId);
  if (parsed.stageKey) query = query.eq('stage_key', parsed.stageKey);
  if (parsed.origin) query = query.eq('origin', parsed.origin);
  if (parsed.cursor) query = query.gt('id', parsed.cursor);
  const { data, error } = await query;
  if (error) throw new Error('Unable to list CRM opportunities');
  const rows = (data ?? []) as DbRow[];
  const items = rows.slice(0, parsed.limit).map(mapOpportunity);
  return {
    items,
    nextCursor: rows.length > parsed.limit ? (items.at(-1)?.id ?? null) : null,
    hasMore: rows.length > parsed.limit,
  };
}

export async function getOpportunity(organizationId: string, opportunityId: string) {
  const row = await loadOpportunity(organizationId, opportunityId);
  return row ? mapOpportunity(row) : null;
}

export async function createManualOpportunity(
  input: CrmCreateManualOpportunityCommand,
  actorUserId: string,
) {
  const parsed = CrmCreateManualOpportunityCommandSchema.parse(input);
  const productKey = normalizeProductKey(parsed.productKey);
  const expectedFingerprint = fingerprint(parsed);
  const supabase = await getDb();
  const { data: existing, error: existingError } = await supabase
    .from('crm_opportunities')
    .select(opportunityColumns)
    .eq('organization_id', parsed.organizationId)
    .eq('idempotency_key', parsed.idempotencyKey)
    .maybeSingle();
  if (existingError) throw new Error('Unable to resolve CRM opportunity idempotency');
  if (existing) {
    if ((existing as DbRow).idempotency_fingerprint !== expectedFingerprint)
      throw new OpportunityServiceError(
        'CRM opportunity idempotency key was reused',
        'IDEMPOTENCY_CONFLICT',
      );
    return { opportunity: mapOpportunity(existing as DbRow), created: false };
  }

  const { data: contact, error: contactError } = await supabase
    .from('crm_contacts')
    .select('id')
    .eq('id', parsed.contactId)
    .eq('organization_id', parsed.organizationId)
    .maybeSingle();
  if (contactError) throw new Error('Unable to resolve CRM contact');
  if (!contact) throw new OpportunityServiceError('CRM contact is required', 'CONTACT_REQUIRED');

  const stage = await loadDefaultStage(parsed.organizationId, parsed.workspaceId);
  if (!stage)
    throw new OpportunityServiceError('CRM pipeline has no active open stage', 'INVALID_STAGE');
  const opportunityInsert: Database['public']['Tables']['crm_opportunities']['Insert'] = {
    organization_id: parsed.organizationId,
    workspace_id: parsed.workspaceId ?? null,
    brand_id: parsed.brandId ?? null,
    contact_id: parsed.contactId,
    lead_id: null,
    name: parsed.name,
    product_key: productKey,
    stage: String(stage.stage_key),
    stage_key: String(stage.stage_key),
    origin: 'manual',
    amount: parsed.amount ?? null,
    currency: parsed.currency,
    probability: parsed.probability ?? null,
    expected_close_at:
      parsed.expectedCloseAt ??
      (parsed.expectedCloseDate ? `${parsed.expectedCloseDate}T00:00:00.000Z` : null),
    assigned_to_user_id: parsed.assignedUserId ?? null,
    version: 1,
    idempotency_key: parsed.idempotencyKey,
    idempotency_fingerprint: expectedFingerprint,
  };
  const { data, error } = await supabase
    .from('crm_opportunities')
    .insert(opportunityInsert)
    .select(opportunityColumns)
    .single();
  if (error) {
    if (error.code === '23505') {
      const raced = await loadOpportunityByIdempotency(
        parsed.organizationId,
        parsed.idempotencyKey,
      );
      if (raced && raced.idempotency_fingerprint === expectedFingerprint)
        return { opportunity: mapOpportunity(raced), created: false };
    }
    throw new Error('Unable to create CRM opportunity');
  }
  const opportunity = mapOpportunity(data as DbRow);
  await appendStageHistory(
    parsed.organizationId,
    opportunity.id,
    null,
    String(stage.stage_key),
    1,
    'system',
    null,
    null,
  );
  await recordCrmAuditEvent({
    organizationId: parsed.organizationId,
    actorUserId,
    entityType: 'opportunity',
    entityId: opportunity.id,
    action: 'created',
    after: opportunity,
  });
  return { opportunity, created: true };
}

async function loadOpportunityByIdempotency(organizationId: string, idempotencyKey: string) {
  const supabase = await getDb();
  const { data } = await supabase
    .from('crm_opportunities')
    .select(opportunityColumns)
    .eq('organization_id', organizationId)
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle();
  return (data as DbRow | null) ?? null;
}

export async function moveOpportunityStage(input: CrmMoveOpportunityStageCommand) {
  const parsed = CrmMoveOpportunityStageCommandSchema.parse(input);
  const current = await loadOpportunity(parsed.organizationId, parsed.opportunityId);
  if (!current) throw new OpportunityServiceError('CRM opportunity not found', 'NOT_FOUND');
  if (Number(current.version) !== parsed.expectedVersion)
    throw new OpportunityServiceError('CRM opportunity update conflict', 'CONFLICT');
  const currentStage = await loadStage(
    parsed.organizationId,
    String(current.stage_key),
    current.workspace_id as string | null,
    false,
  );
  const targetStage = await loadStage(
    parsed.organizationId,
    parsed.stageKey,
    current.workspace_id as string | null,
  );
  if (!targetStage)
    throw new OpportunityServiceError('CRM stage is invalid or inactive', 'INVALID_STAGE');
  if (currentStage?.terminal_type !== 'open' && parsed.origin !== 'reopen')
    throw new OpportunityServiceError(
      'Terminal opportunities require reopen',
      'STAGE_TRANSITION_FORBIDDEN',
    );
  if (String(current.stage_key) === parsed.stageKey)
    throw new OpportunityServiceError(
      'CRM opportunity is already in this stage',
      'STAGE_TRANSITION_FORBIDDEN',
    );
  const supabase = await getDb();
  const { data, error } = await supabase
    .from('crm_opportunities')
    .update({
      stage: parsed.stageKey,
      stage_key: parsed.stageKey,
      version: parsed.expectedVersion + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('organization_id', parsed.organizationId)
    .eq('id', parsed.opportunityId)
    .eq('version', parsed.expectedVersion)
    .select(opportunityColumns)
    .maybeSingle();
  if (error) throw new Error('Unable to move CRM opportunity stage');
  if (!data) throw new OpportunityServiceError('CRM opportunity update conflict', 'CONFLICT');
  const opportunity = mapOpportunity(data as DbRow);
  await appendStageHistory(
    parsed.organizationId,
    opportunity.id,
    String(current.stage_key),
    parsed.stageKey,
    opportunity.version,
    parsed.origin,
    parsed.reason,
    parsed.actorUserId,
  );
  await recordCrmAuditEvent({
    organizationId: parsed.organizationId,
    actorUserId: parsed.actorUserId,
    entityType: 'opportunity',
    entityId: opportunity.id,
    action: 'stage_changed',
    before: current,
    after: opportunity,
    metadata: { origin: parsed.origin, reason: parsed.reason ?? null },
  });
  return opportunity;
}

export async function reopenOpportunity(input: CrmReopenOpportunityCommand) {
  const parsed = CrmReopenOpportunityCommandSchema.parse(input);
  const current = await loadOpportunity(parsed.organizationId, parsed.opportunityId);
  if (!current) throw new OpportunityServiceError('CRM opportunity not found', 'NOT_FOUND');
  if (!parsed.reason.trim())
    throw new OpportunityServiceError('A reopen reason is required', 'REOPEN_REASON_REQUIRED');
  const currentStage = await loadStage(
    parsed.organizationId,
    String(current.stage_key),
    current.workspace_id as string | null,
    false,
  );
  if (!currentStage || currentStage.terminal_type === 'open')
    throw new OpportunityServiceError(
      'Only won or lost opportunities can be reopened',
      'REOPEN_FORBIDDEN',
    );
  if (Number(current.version) !== parsed.expectedVersion)
    throw new OpportunityServiceError('CRM opportunity update conflict', 'CONFLICT');
  const targetStage = await loadStage(
    parsed.organizationId,
    parsed.targetStageKey,
    current.workspace_id as string | null,
  );
  if (!targetStage || targetStage.terminal_type !== 'open')
    throw new OpportunityServiceError(
      'Reopen target must be an active open stage',
      'INVALID_STAGE',
    );
  return moveOpportunityStage({
    organizationId: parsed.organizationId,
    opportunityId: parsed.opportunityId,
    stageKey: parsed.targetStageKey,
    expectedVersion: parsed.expectedVersion,
    reason: parsed.reason,
    origin: 'reopen',
    actorUserId: parsed.actorUserId,
  });
}

export async function updateOpportunity(input: CrmUpdateOpportunityCommand, actorUserId: string) {
  const parsed = CrmUpdateOpportunityCommandSchema.parse(input);
  const current = await loadOpportunity(parsed.organizationId, parsed.opportunityId);
  if (!current) throw new OpportunityServiceError('CRM opportunity not found', 'NOT_FOUND');
  if (Number(current.version) !== parsed.expectedVersion)
    throw new OpportunityServiceError('CRM opportunity update conflict', 'CONFLICT');
  const supabase = await getDb();
  const changes = {
    ...(parsed.name !== undefined ? { name: parsed.name } : {}),
    ...(parsed.brandId !== undefined ? { brand_id: parsed.brandId } : {}),
    ...(parsed.productKey !== undefined
      ? { product_key: normalizeProductKey(parsed.productKey) }
      : {}),
    ...(parsed.amount !== undefined ? { amount: parsed.amount } : {}),
    ...(parsed.currency !== undefined ? { currency: parsed.currency } : {}),
    ...(parsed.probability !== undefined ? { probability: parsed.probability } : {}),
    ...(parsed.expectedCloseAt !== undefined ? { expected_close_at: parsed.expectedCloseAt } : {}),
    ...(parsed.expectedCloseDate !== undefined
      ? {
          expected_close_at: parsed.expectedCloseDate
            ? `${parsed.expectedCloseDate}T00:00:00.000Z`
            : null,
        }
      : {}),
    ...(parsed.assignedUserId !== undefined ? { assigned_to_user_id: parsed.assignedUserId } : {}),
    version: parsed.expectedVersion + 1,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from('crm_opportunities')
    .update(changes)
    .eq('organization_id', parsed.organizationId)
    .eq('id', parsed.opportunityId)
    .eq('version', parsed.expectedVersion)
    .select(opportunityColumns)
    .maybeSingle();
  if (error) throw new Error('Unable to update CRM opportunity');
  if (!data) throw new OpportunityServiceError('CRM opportunity update conflict', 'CONFLICT');
  const opportunity = mapOpportunity(data as DbRow);
  await recordCrmAuditEvent({
    organizationId: parsed.organizationId,
    actorUserId,
    entityType: 'opportunity',
    entityId: opportunity.id,
    action: 'updated',
    before: current,
    after: opportunity,
  });
  return opportunity;
}

export async function configurePipelineStage(input: CrmConfigurePipelineStageCommand) {
  const parsed = CrmConfigurePipelineStageCommandSchema.parse(input);
  const supabase = await getDb();
  const values = {
    organization_id: parsed.organizationId,
    workspace_id: parsed.workspaceId ?? null,
    key: parsed.key,
    stage_key: parsed.key,
    label: parsed.name,
    position: parsed.stageOrder,
    active: parsed.active,
    terminal_type: parsed.terminalType,
    updated_at: new Date().toISOString(),
  };
  const query = parsed.stageId
    ? supabase
        .from('crm_pipeline_stages')
        .update(values)
        .eq('id', parsed.stageId)
        .eq('organization_id', parsed.organizationId)
        .eq('updated_at', parsed.expectedUpdatedAt ?? '')
    : supabase.from('crm_pipeline_stages').insert(values);
  const { data, error } = await query.select(stageColumns).maybeSingle();
  if (error) {
    if (error.code === '23505')
      throw new OpportunityServiceError(
        'CRM stage configuration conflicts',
        'INVALID_STAGE_CONFIGURATION',
      );
    throw new Error('Unable to configure CRM pipeline stage');
  }
  if (!data) throw new OpportunityServiceError('CRM stage configuration conflicts', 'CONFLICT');
  return mapStage(data as DbRow);
}
