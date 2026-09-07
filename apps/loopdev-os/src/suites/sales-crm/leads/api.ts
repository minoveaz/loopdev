import {
  CrmCaptureLeadCommandSchema,
  CrmContactPageSchema,
  CrmContactQuerySchema,
  CrmContactSchema,
  CrmCreateOpportunityFromLeadCommandSchema,
  CrmLeadPageSchema,
  CrmLeadQuerySchema,
  CrmLeadSchema,
  CrmOpportunitySchema,
  Customer360RecordViewSchema,
  CreateNoteCommandSchema,
  NoteReadSchema,
} from '@loopdev/contracts';
import type {
  CrmCaptureLeadCommand,
  CrmContact,
  CrmContactPage,
  CrmContactQuery,
  CrmCreateOpportunityFromLeadCommand,
  CrmLead,
  CrmLeadPage,
  CrmLeadQuery,
  CrmOpportunity,
  Customer360RecordView,
  CreateNoteCommand,
  NoteRead,
} from '@loopdev/contracts';
import { crmContacts, crmCustomer360, crmLeads, updateCrmLead, moveCrmLead, createCrmOpportunityFromLead, createCrmLead } from '../runtimeAdapter';
import type { PlatformEnvironmentMode } from '@loopdev/contracts';

export type LeadApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'CONTACT_REQUIRED'
  | 'IDEMPOTENCY_CONFLICT'
  | 'INVALID_STATUS_TRANSITION'
  | 'UNKNOWN';

export class LeadApiError extends Error {
  constructor(
    message: string,
    public readonly code: LeadApiErrorCode,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'LeadApiError';
  }
}

type LeadApiErrorPayload = {
  code?: LeadApiErrorCode;
  error?: string | { code?: LeadApiErrorCode; message?: string };
} | null;

async function readLeadApiError(response: Response, fallback: string): Promise<LeadApiError> {
  const payload = (await response.json().catch(() => null)) as LeadApiErrorPayload;
  const code =
    payload?.code ??
    (typeof payload?.error === 'object' ? payload.error.code : undefined) ??
    (response.status === 401
      ? 'UNAUTHENTICATED'
      : response.status === 403
        ? 'FORBIDDEN'
        : 'UNKNOWN');
  const message =
    typeof payload?.error === 'string' ? payload.error : (payload?.error?.message ?? fallback);
  return new LeadApiError(message, code, response.status);
}

export async function getLeads(input: CrmLeadQuery, signal?: AbortSignal, mode: PlatformEnvironmentMode = 'real'): Promise<CrmLeadPage> {
  const query = CrmLeadQuerySchema.parse(input);
  if (mode !== 'real') return crmLeads(mode, query.organizationId, query);
  const params = new URLSearchParams({
    organizationId: query.organizationId,
    limit: String(query.limit),
  });

  for (const key of ['workspaceId', 'status', 'source', 'assignedUserId', 'cursor'] as const) {
    const value = query[key];
    if (value) params.set(key, value);
  }

  const response = await fetch(`/api/crm/leads?${params.toString()}`, { signal });
  if (!response.ok) throw await readLeadApiError(response, 'Unable to load leads.');

  const parsed = CrmLeadPageSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) {
    throw new LeadApiError('The lead response is invalid.', 'UNKNOWN', 502);
  }
  return parsed.data;
}

export async function getLeadById(
  organizationId: string,
  leadId: string,
  signal?: AbortSignal,
  mode: PlatformEnvironmentMode = 'real',
): Promise<CrmLead> {
  if (mode !== 'real') {
    const result = await crmLeads(mode, organizationId);
    const lead = result.items.find((item) => item.id === leadId);
    if (!lead) throw new LeadApiError('Unable to load the lead.', 'NOT_FOUND', 404);
    return lead;
  }
  const response = await fetch(
    `/api/crm/leads/${encodeURIComponent(leadId)}?organizationId=${encodeURIComponent(organizationId)}`,
    { signal },
  );
  if (!response.ok) throw await readLeadApiError(response, 'Unable to load the lead.');
  const parsed = CrmLeadSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) throw new LeadApiError('The lead response is invalid.', 'UNKNOWN', 502);
  return parsed.data;
}

export async function getLeadCustomer360(
  organizationId: string,
  contactId: string,
  signal?: AbortSignal,
  mode: PlatformEnvironmentMode = 'real',
): Promise<Customer360RecordView> {
  if (mode !== 'real') return crmCustomer360(mode, organizationId, contactId);
  const params = new URLSearchParams({
    organizationId,
    contactId,
    view: 'record',
    sections: 'profile,opportunities,timeline',
  });
  const response = await fetch(
    `/api/crm/contacts/${encodeURIComponent(contactId)}/customer-360?${params.toString()}`,
    { signal },
  );
  if (!response.ok) throw await readLeadApiError(response, 'Unable to load the related contact.');
  const parsed = Customer360RecordViewSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success)
    throw new LeadApiError('The contact context response is invalid.', 'UNKNOWN', 502);
  return parsed.data;
}

export async function updateLead(input: {
  organizationId: string;
  leadId: string;
  interest?: string | null;
  assignedUserId?: string | null;
  brandId?: string | null;
  workspaceId?: string | null;
  expectedUpdatedAt: string;
}, mode: PlatformEnvironmentMode = 'real'): Promise<CrmLead> {
  if (mode !== 'real') {
    try {
      return updateCrmLead(mode, input.organizationId, input.leadId, {
        interest: input.interest ?? null,
        assignedUserId: input.assignedUserId ?? null,
      });
    } catch (error) {
      throw new LeadApiError(error instanceof Error ? error.message : 'Unable to update the lead.', mode === 'preview' ? 'FORBIDDEN' : 'NOT_FOUND', mode === 'preview' ? 403 : 404);
    }
  }
  const response = await fetch('/api/crm/leads', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw await readLeadApiError(response, 'Unable to update the lead.');
  const parsed = CrmLeadSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success)
    throw new LeadApiError('The updated lead response is invalid.', 'UNKNOWN', 502);
  return parsed.data;
}

export async function moveLeadStatus(input: {
  organizationId: string;
  leadId: string;
  status: CrmLead['status'];
  expectedUpdatedAt: string;
}, mode: PlatformEnvironmentMode = 'real'): Promise<CrmLead> {
  if (mode !== 'real') {
    try {
      return moveCrmLead(mode, input.organizationId, input.leadId, input.status);
    } catch (error) {
      throw new LeadApiError(error instanceof Error ? error.message : 'Unable to change the lead status.', mode === 'preview' ? 'FORBIDDEN' : 'NOT_FOUND', mode === 'preview' ? 403 : 404);
    }
  }
  const response = await fetch('/api/crm/leads/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw await readLeadApiError(response, 'Unable to change the lead status.');
  const parsed = CrmLeadSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success)
    throw new LeadApiError('The updated lead response is invalid.', 'UNKNOWN', 502);
  return parsed.data;
}

export type LeadConversionResult = {
  opportunity: CrmOpportunity;
  outcome: 'created' | 'existing';
};

/**
 * Converts a qualified Lead through the existing conversion endpoint. The
 * inherited contact is intentionally absent from this command; the server
 * resolves it from the Lead and returns 201 for a new Opportunity or 200
 * when the idempotent conversion already exists.
 */
export async function createOpportunityFromLead(
  input: CrmCreateOpportunityFromLeadCommand,
  mode: PlatformEnvironmentMode = 'real',
): Promise<LeadConversionResult> {
  const command = CrmCreateOpportunityFromLeadCommandSchema.parse(input);
  if (mode !== 'real') {
    try {
      return {
        opportunity: createCrmOpportunityFromLead(mode, command.organizationId, command.leadId, command.productKey),
        outcome: 'created',
      };
    } catch (error) {
      throw new LeadApiError(error instanceof Error ? error.message : 'Unable to convert the lead.', mode === 'preview' ? 'FORBIDDEN' : 'NOT_FOUND', mode === 'preview' ? 403 : 404);
    }
  }
  const response = await fetch('/api/crm/leads/conversion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!response.ok) {
    throw await readLeadApiError(response, 'Unable to convert the lead.');
  }
  const parsed = CrmOpportunitySchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) {
    throw new LeadApiError('The opportunity response is invalid.', 'UNKNOWN', 502);
  }
  return {
    opportunity: parsed.data,
    outcome: response.status === 201 ? 'created' : 'existing',
  };
}

/**
 * Contacts read model used by `ContactLookupField`. Reuses the certified
 * Contacts endpoint (`GET /api/crm/contacts`); Leads never queries Contacts
 * data directly.
 */
export async function searchLeadContacts(
  input: CrmContactQuery,
  signal?: AbortSignal,
  mode: PlatformEnvironmentMode = 'real',
): Promise<CrmContactPage> {
  const query = CrmContactQuerySchema.parse(input);
  if (mode !== 'real') return crmContacts(mode, query.organizationId, query.query);
  const params = new URLSearchParams({
    organizationId: query.organizationId,
    limit: String(query.limit),
  });
  if (query.query) params.set('query', query.query);
  if (query.cursor) params.set('cursor', query.cursor);

  const response = await fetch(`/api/crm/contacts?${params.toString()}`, { signal });
  if (!response.ok) throw await readLeadApiError(response, 'Unable to search contacts.');

  const parsed = CrmContactPageSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) {
    throw new LeadApiError('The contact response is invalid.', 'UNKNOWN', 502);
  }
  return parsed.data;
}

export type LeadCaptureResult = {
  contact: CrmContact;
  lead: CrmLead;
  // The attribution row returned by the capture endpoint is a raw
  // persistence record, not the `CrmLeadAttribution` domain shape
  // (CRM_LEAD_CONTRACT.md); it is display-only and never re-parsed.
  attribution: unknown;
  reused: boolean;
};

export type LeadCaptureCompletion = LeadCaptureResult & {
  initialNote:
    | { status: 'not-requested' | 'saved' }
    | {
        status: 'failed';
        command: CreateNoteCommand;
        errorCode: LeadApiErrorCode;
      };
};

/**
 * Implements CRM_LEADS_UI_CONTRACT.md capture surface: `POST /api/crm/capture`
 * accepts an existing `contactId` or a new-contact payload and is idempotent
 * per organization+source+externalId, so a retry with the same command
 * safely returns `reused: true` instead of duplicating the Lead.
 */
export async function captureLead(
  input: CrmCaptureLeadCommand,
  signal?: AbortSignal,
  mode: PlatformEnvironmentMode = 'real',
): Promise<LeadCaptureResult> {
  const command = CrmCaptureLeadCommandSchema.parse(input);
  if (mode !== 'real') return createCrmLead(mode, command);
  const response = await fetch('/api/crm/capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    signal,
  });
  if (!response.ok) throw await readLeadApiError(response, 'Unable to capture the lead.');

  const payload = (await response.json().catch(() => null)) as {
    contact?: unknown;
    lead?: unknown;
    attribution?: unknown;
    reused?: unknown;
  } | null;
  const contact = CrmContactSchema.safeParse(payload?.contact);
  const lead = CrmLeadSchema.safeParse(payload?.lead);
  if (!contact.success || !lead.success || typeof payload?.reused !== 'boolean') {
    throw new LeadApiError('The lead capture response is invalid.', 'UNKNOWN', 502);
  }
  return {
    contact: contact.data,
    lead: lead.data,
    attribution: payload?.attribution ?? null,
    reused: payload.reused,
  };
}

/**
 * Uses the existing idempotent CRM notes command to persist an optional note
 * entered during capture. Leads do not create a parallel notes endpoint.
 */
export async function createLeadNote(input: CreateNoteCommand): Promise<NoteRead> {
  const command = CreateNoteCommandSchema.parse(input);
  const response = await fetch('/api/crm/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw await readLeadApiError(response, 'Unable to save the lead note.');

  const parsed = NoteReadSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) {
    throw new LeadApiError('The lead note response is invalid.', 'UNKNOWN', 502);
  }
  return parsed.data;
}
