import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const CrmLeadStageSchema = z.enum([
  'lead',
  'contacted',
  'proposal',
  'negotiation',
  'won',
  'lost',
  'rejected',
  'discarded',
  // CRM_LEAD_CONTRACT.md stable conversion stage id: the visible label/order
  // may change without changing this id, the contract, or historical rows.
  'qualified',
]);
export const CrmLeadStatusSchema = z.enum([
  'nuevo',
  'contactado',
  'cualificado',
  'estancado',
  'inactivo',
  'convertido',
]);
export const CrmActivityTypeSchema = z.enum([
  'note',
  'call',
  'status_change',
  'task_created',
  'task_completed',
  'document',
  'email',
  'whatsapp',
]);
export const CrmTaskStatusSchema = z.enum(['pending', 'completed', 'cancelled']);
export const CrmTaskPrioritySchema = z.enum(['low', 'medium', 'high']);
export const CrmCompanyTypeSchema = z.enum(['person', 'organization']);
export const CrmRelatedPersonRoleSchema = z.enum([
  'family_member',
  'household_member',
  'beneficiary',
  'insured',
  'other',
]);
export const CrmConsentChannelSchema = z.enum([
  'email',
  'whatsapp',
  'instagram',
  'facebook_messenger',
  'sms',
  'phone',
]);
export const CrmConsentStatusSchema = z.enum(['granted', 'withdrawn', 'not_requested']);
export const CrmLeadSourceKindSchema = z.enum([
  'manual',
  'campaign',
  'whatsapp_simulated',
  'referral',
  'social',
  'partner',
]);

// CRM_LEAD_CONTRACT.md LeadSource: kind plus reserved provider/attribution
// fields prepared for the future Marketing/WhatsApp integrations (H2), which
// are not activated in this pilot slice.
export const CrmLeadSourceSchema = z.object({
  kind: CrmLeadSourceKindSchema,
  provider: z.string().trim().max(120).nullable().optional(),
  externalId: z.string().trim().max(240).nullable().optional(),
  campaign: z.string().trim().max(160).nullable().optional(),
  utm: z.record(z.string(), z.string().max(500)).default({}),
});
export type CrmLeadSource = z.infer<typeof CrmLeadSourceSchema>;

const NullableEmailSchema = z.string().email().nullable().optional();
const NullablePhoneSchema = z.string().trim().min(3).max(32).nullable().optional();

export const CrmContactSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().max(120).nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().trim().min(3).max(32).nullable().optional(),
  companyName: z.string().trim().max(160).nullable().optional(),
  identityStatus: z.enum(['verified', 'pending_identity_review']).default('verified'),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmContact = z.infer<typeof CrmContactSchema>;

export const CrmContactPageSchema = z.object({
  items: z.array(CrmContactSchema).max(100),
  nextCursor: IdSchema.nullable(),
  hasMore: z.boolean(),
});
export type CrmContactPage = z.infer<typeof CrmContactPageSchema>;

export const CrmContactQuerySchema = z.object({
  organizationId: IdSchema,
  query: z.string().trim().min(1).max(120).optional(),
  cursor: IdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type CrmContactQuery = z.infer<typeof CrmContactQuerySchema>;

export const CrmCreateContactCommandSchema = z
  .object({
    organizationId: IdSchema,
    firstName: z.string().trim().min(1).max(120),
    lastName: z.string().trim().max(120).nullable().optional(),
    email: NullableEmailSchema,
    phone: NullablePhoneSchema,
    companyName: z.string().trim().max(160).nullable().optional(),
  })
  .refine((contact) => Boolean(contact.email || contact.phone), {
    message: 'At least one contact channel is required',
    path: ['email'],
  });
export type CrmCreateContactCommand = z.infer<typeof CrmCreateContactCommandSchema>;

export const CrmResolveWhatsAppInboundContactCommandSchema = z.object({
  organizationId: IdSchema,
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/),
  profileName: z.string().trim().min(1).max(120).nullable().optional(),
});
export type CrmResolveWhatsAppInboundContactCommand = z.infer<typeof CrmResolveWhatsAppInboundContactCommandSchema>;

export const CrmInboundContactResolutionSchema = z.object({
  contactId: IdSchema,
  organizationId: IdSchema,
  identityStatus: z.enum(['verified', 'pending_identity_review']),
  created: z.boolean(),
});
export type CrmInboundContactResolution = z.infer<typeof CrmInboundContactResolutionSchema>;

export const CrmUpdateContactCommandSchema = z.object({
  organizationId: IdSchema,
  contactId: IdSchema,
  firstName: z.string().trim().min(1).max(120).optional(),
  lastName: z.string().trim().max(120).nullable().optional(),
  email: NullableEmailSchema,
  phone: NullablePhoneSchema,
  companyName: z.string().trim().max(160).nullable().optional(),
  expectedUpdatedAt: TimestampSchema,
});
export type CrmUpdateContactCommand = z.infer<typeof CrmUpdateContactCommandSchema>;

export const CrmCompanySchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  type: CrmCompanyTypeSchema.default('organization'),
  name: z.string().trim().min(1).max(200),
  legalName: z.string().trim().max(240).nullable().optional(),
  taxId: z.string().trim().max(80).nullable().optional(),
  email: NullableEmailSchema,
  phone: NullablePhoneSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmCompany = z.infer<typeof CrmCompanySchema>;

export const CrmContactCompanyRoleSchema = z.enum([
  'primary',
  'employee',
  'decision_maker',
  'billing',
  'other',
]);
export const CrmContactCompanySchema = z.object({
  organizationId: IdSchema,
  contactId: IdSchema,
  companyId: IdSchema,
  role: CrmContactCompanyRoleSchema.default('other'),
  isPrimary: z.boolean().default(false),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmContactCompany = z.infer<typeof CrmContactCompanySchema>;

export const CrmRelatedPersonSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  contactId: IdSchema,
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().max(120).nullable().optional(),
  role: CrmRelatedPersonRoleSchema,
  dateOfBirth: z.string().date().nullable().optional(),
  isContactable: z.literal(false).default(false),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmRelatedPerson = z.infer<typeof CrmRelatedPersonSchema>;

export const CrmContactConsentSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  contactId: IdSchema,
  channel: CrmConsentChannelSchema,
  purpose: z.string().trim().min(1).max(160),
  status: CrmConsentStatusSchema,
  source: z.string().trim().min(1).max(160).nullable().optional(),
  grantedAt: TimestampSchema.nullable().optional(),
  withdrawnAt: TimestampSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmContactConsent = z.infer<typeof CrmContactConsentSchema>;

export const CrmLeadSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  contactId: IdSchema,
  status: CrmLeadStatusSchema.default('nuevo'),
  interest: z.string().trim().max(240).nullable().optional(),
  assignedUserId: IdSchema.nullable().optional(),
  source: CrmLeadSourceSchema,
  // Reserved for the Contact duplicate-review workflow; always null until
  // that workflow is implemented (see CRM_CONTACT_CONTRACT.md duplicate review).
  duplicateReviewId: IdSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmLead = z.infer<typeof CrmLeadSchema>;

export const CrmLeadPageSchema = z.object({
  items: z.array(CrmLeadSchema).max(100),
  nextCursor: IdSchema.nullable(),
  hasMore: z.boolean(),
});
export type CrmLeadPage = z.infer<typeof CrmLeadPageSchema>;

export const CrmLeadQuerySchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.optional(),
  status: CrmLeadStatusSchema.optional(),
  source: CrmLeadSourceKindSchema.optional(),
  assignedUserId: IdSchema.optional(),
  cursor: IdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type CrmLeadQuery = z.infer<typeof CrmLeadQuerySchema>;

// Internal command used once a Contact is already resolved (id known).
export const CrmCreateLeadCommandSchema = z.object({
  organizationId: IdSchema,
  contactId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  interest: z.string().trim().max(240).nullable().optional(),
  assignedUserId: IdSchema.nullable().optional(),
  source: CrmLeadSourceSchema,
});
export type CrmCreateLeadCommand = z.infer<typeof CrmCreateLeadCommandSchema>;

export const CrmUpdateLeadCommandSchema = z.object({
  organizationId: IdSchema,
  leadId: IdSchema,
  interest: z.string().trim().max(240).nullable().optional(),
  assignedUserId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  expectedUpdatedAt: TimestampSchema,
});
export type CrmUpdateLeadCommand = z.infer<typeof CrmUpdateLeadCommandSchema>;

export const CrmMoveLeadStatusCommandSchema = z.object({
  organizationId: IdSchema,
  leadId: IdSchema,
  status: CrmLeadStatusSchema,
  expectedUpdatedAt: TimestampSchema,
});
export type CrmMoveLeadStatusCommand = z.infer<typeof CrmMoveLeadStatusCommandSchema>;

export const CrmLeadAttributionSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  leadId: IdSchema,
  source: CrmLeadSourceKindSchema,
  provider: z.string().trim().max(120).nullable().optional(),
  externalId: z.string().trim().max(240).nullable().optional(),
  campaign: z.string().trim().max(160).nullable().optional(),
  medium: z.string().trim().max(120).nullable().optional(),
  content: z.string().trim().max(240).nullable().optional(),
  term: z.string().trim().max(240).nullable().optional(),
  capturedAt: TimestampSchema,
});
export type CrmLeadAttribution = z.infer<typeof CrmLeadAttributionSchema>;

// CRM_LEAD_CONTRACT.md createLead: accepts an existing contactId or the
// input to create a new Contact through the approved Contact contract, plus
// source, assignment and idempotent external identifiers.
export const CrmCaptureLeadCommandSchema = z
  .object({
    organizationId: IdSchema,
    brandId: IdSchema.nullable().optional(),
    workspaceId: IdSchema.nullable().optional(),
    contactId: IdSchema.optional(),
    firstName: z.string().trim().min(1).max(120).optional(),
    lastName: z.string().trim().max(120).nullable().optional(),
    email: z.string().email().nullable().optional(),
    phone: z.string().trim().min(3).max(32).nullable().optional(),
    companyName: z.string().trim().max(160).nullable().optional(),
    interest: z.string().trim().min(1).max(240),
    assignedUserId: IdSchema.nullable().optional(),
    source: CrmLeadSourceSchema,
  })
  .refine((lead) => Boolean(lead.contactId) || Boolean(lead.firstName), {
    message: 'contactId or a new contact firstName is required',
    path: ['contactId'],
  })
  .refine((lead) => Boolean(lead.contactId) || Boolean(lead.email || lead.phone), {
    message: 'A new contact requires at least one contact channel',
    path: ['email'],
  });
export type CrmCaptureLeadCommand = z.infer<typeof CrmCaptureLeadCommandSchema>;

export const LeadErrorCodeSchema = z.enum([
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'VALIDATION_ERROR',
  'IDEMPOTENCY_CONFLICT',
  'INVALID_STATUS_TRANSITION',
  'CONTACT_REQUIRED',
]);
export type LeadErrorCode = z.infer<typeof LeadErrorCodeSchema>;

export const StageTerminalTypeSchema = z.enum(['open', 'won', 'lost']);
export type StageTerminalType = z.infer<typeof StageTerminalTypeSchema>;
export const StageChangeOriginSchema = z.enum([
  'board',
  'record',
  'system',
  'conversion',
  'reopen',
]);
export type StageChangeOrigin = z.infer<typeof StageChangeOriginSchema>;

const PipelineStageShape = {
  id: IdSchema,
  organizationId: IdSchema,
  // tenantId is retained as a read-only contract alias for consumers that use
  // the product contract terminology; persistence is organization-scoped.
  tenantId: IdSchema.optional(),
  workspaceId: IdSchema.nullable().optional(),
  key: z.string().trim().min(1).max(80).regex(/^[a-z0-9][a-z0-9_-]*$/),
  name: z.string().trim().min(1).max(80).optional(),
  label: z.string().trim().min(1).max(80).optional(),
  stageOrder: z.number().int().nonnegative().optional(),
  position: z.number().int().nonnegative().optional(),
  active: z.boolean().default(true),
  terminalType: StageTerminalTypeSchema.default('open'),
  isTerminal: z.boolean().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
};

export const PipelineStageSchema = z
  .object(PipelineStageShape)
  .refine((stage) => Boolean(stage.name || stage.label), {
    message: 'A pipeline stage requires a name',
    path: ['name'],
  });
export type PipelineStage = z.infer<typeof PipelineStageSchema>;
export const CrmPipelineStageSchema = PipelineStageSchema;
export type CrmPipelineStage = PipelineStage;

export const CrmOpportunityOriginSchema = z.enum(['manual', 'lead_conversion']);
export type CrmOpportunityOrigin = z.infer<typeof CrmOpportunityOriginSchema>;

export const CrmOpportunitySchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  tenantId: IdSchema.optional(),
  workspaceId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  contactId: IdSchema,
  leadId: IdSchema.nullable().optional(),
  productKey: z.string().trim().min(1).max(160),
  stageKey: z.string().trim().min(1).max(80),
  stageId: IdSchema.nullable().optional(),
  name: z.string().trim().min(1).max(160),
  // stage is the legacy lead-shaped field and is kept for conversion clients.
  stage: CrmLeadStageSchema.optional(),
  origin: CrmOpportunityOriginSchema.default('manual'),
  amount: z.number().nonnegative().nullable().optional(),
  currency: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .default('EUR'),
  probability: z.number().int().min(0).max(100).nullable().optional(),
  expectedCloseAt: TimestampSchema.nullable().optional(),
  expectedCloseDate: z.string().date().nullable().optional(),
  assignedUserId: IdSchema.nullable().optional(),
  lastActivity: z
    .object({
      at: TimestampSchema,
      type: z.string().trim().min(1).max(40),
      actorId: IdSchema.nullable(),
      actorName: z.string().trim().max(160).nullable(),
    })
    .nullable()
    .optional(),
  activityHealth: z.enum(['fresh', 'stale', 'overdue', 'unknown']).default('unknown'),
  version: z.number().int().positive().default(1),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmOpportunity = z.infer<typeof CrmOpportunitySchema>;
export const OpportunitySchema = CrmOpportunitySchema;
export type Opportunity = CrmOpportunity;

// CRM_LEAD_CONTRACT.md createOpportunityFromLead: converts a qualified Lead
// into (or reuses) the conversion Opportunity for one normalized product key.
export const CrmCreateOpportunityFromLeadCommandSchema = z.object({
  organizationId: IdSchema,
  leadId: IdSchema,
  productKey: z.string().trim().min(1).max(160),
  name: z.string().trim().min(1).max(160),
  amount: z.number().nonnegative().nullable().optional(),
  currency: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .optional(),
  probability: z.number().int().min(0).max(100).nullable().optional(),
  expectedCloseAt: TimestampSchema.nullable().optional(),
});
export type CrmCreateOpportunityFromLeadCommand = z.infer<
  typeof CrmCreateOpportunityFromLeadCommandSchema
>;

export const OpportunityErrorCodeSchema = z.enum([
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'CONFLICT',
  'IDEMPOTENCY_CONFLICT',
  'CONTACT_REQUIRED',
  'LEAD_REQUIRED',
  'INVALID_STAGE',
  'STAGE_TRANSITION_FORBIDDEN',
  'INVALID_STAGE_CONFIGURATION',
  'REOPEN_FORBIDDEN',
  'REOPEN_REASON_REQUIRED',
  'CROSS_TENANT_REFERENCE',
]);
export type OpportunityErrorCode = z.infer<typeof OpportunityErrorCodeSchema>;

export const CrmOpportunityQuerySchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.optional(),
  brandId: IdSchema.optional(),
  contactId: IdSchema.optional(),
  stageKey: z.string().trim().min(1).max(80).optional(),
  origin: CrmOpportunityOriginSchema.optional(),
  cursor: IdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type CrmOpportunityQuery = z.infer<typeof CrmOpportunityQuerySchema>;
export const CrmListOpportunitiesQuerySchema = CrmOpportunityQuerySchema;
export type CrmListOpportunitiesQuery = CrmOpportunityQuery;

export const CrmGetOpportunityQuerySchema = z.object({
  organizationId: IdSchema,
  opportunityId: IdSchema,
});
export type CrmGetOpportunityQuery = z.infer<typeof CrmGetOpportunityQuerySchema>;

export const CrmCreateManualOpportunityCommandSchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  contactId: IdSchema,
  productKey: z.string().trim().min(1).max(160),
  name: z.string().trim().min(1).max(160),
  amount: z.number().nonnegative().nullable().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
  probability: z.number().int().min(0).max(100).nullable().optional(),
  expectedCloseDate: z.string().date().nullable().optional(),
  expectedCloseAt: TimestampSchema.nullable().optional(),
  assignedUserId: IdSchema.nullable().optional(),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type CrmCreateManualOpportunityCommand = z.infer<
  typeof CrmCreateManualOpportunityCommandSchema
>;

export const CrmMoveOpportunityStageCommandSchema = z.object({
  organizationId: IdSchema,
  opportunityId: IdSchema,
  stageKey: z.string().trim().min(1).max(80),
  expectedVersion: z.number().int().positive(),
  reason: z.string().trim().max(500).nullable().optional(),
  origin: StageChangeOriginSchema.default('record'),
  actorUserId: IdSchema.nullable().optional(),
});
export type CrmMoveOpportunityStageCommand = z.infer<
  typeof CrmMoveOpportunityStageCommandSchema
>;

export const CrmReopenOpportunityCommandSchema = z.object({
  organizationId: IdSchema,
  opportunityId: IdSchema,
  targetStageKey: z.string().trim().min(1).max(80),
  expectedVersion: z.number().int().positive(),
  reason: z.string().trim().min(1).max(500),
  actorUserId: IdSchema.nullable().optional(),
});
export type CrmReopenOpportunityCommand = z.infer<
  typeof CrmReopenOpportunityCommandSchema
>;

export const CrmUpdateOpportunityCommandSchema = z.object({
  organizationId: IdSchema,
  opportunityId: IdSchema,
  name: z.string().trim().min(1).max(160).optional(),
  brandId: IdSchema.nullable().optional(),
  productKey: z.string().trim().min(1).max(160).optional(),
  amount: z.number().nonnegative().nullable().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  probability: z.number().int().min(0).max(100).nullable().optional(),
  expectedCloseDate: z.string().date().nullable().optional(),
  expectedCloseAt: TimestampSchema.nullable().optional(),
  assignedUserId: IdSchema.nullable().optional(),
  expectedVersion: z.number().int().positive(),
});
export type CrmUpdateOpportunityCommand = z.infer<
  typeof CrmUpdateOpportunityCommandSchema
>;

export const CrmConfigurePipelineStageCommandSchema = z.object({
  organizationId: IdSchema,
  stageId: IdSchema.optional(),
  workspaceId: IdSchema.nullable().optional(),
  key: z.string().trim().min(1).max(80).regex(/^[a-z0-9][a-z0-9_-]*$/),
  name: z.string().trim().min(1).max(80),
  stageOrder: z.number().int().nonnegative(),
  active: z.boolean().default(true),
  terminalType: StageTerminalTypeSchema.default('open'),
  expectedUpdatedAt: TimestampSchema.optional(),
});
export type CrmConfigurePipelineStageCommand = z.infer<
  typeof CrmConfigurePipelineStageCommandSchema
>;

export const CrmOpportunityCommandEnvelopeSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    data: data.nullable(),
    error: z
      .object({ code: OpportunityErrorCodeSchema, message: z.string() })
      .nullable(),
    requestId: z.string().min(1),
  });

export const CrmActivitySchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  leadId: IdSchema,
  actorUserId: IdSchema.nullable().optional(),
  type: CrmActivityTypeSchema,
  summary: z.string().trim().min(1).max(500),
  details: z.string().max(10_000).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  occurredAt: TimestampSchema,
  createdAt: TimestampSchema,
});
export type CrmActivity = z.infer<typeof CrmActivitySchema>;

export const CrmActivitySourceTypeSchema = z.enum([
  'contact',
  'lead',
  'opportunity',
  'task',
  'note',
  'assignment',
  'stage',
]);
export const CrmActivityReadSchema = CrmActivitySchema.extend({
  workspaceId: IdSchema,
  sourceType: CrmActivitySourceTypeSchema,
  sourceId: IdSchema,
  sourceKey: z.string().regex(/^[a-z_]+:[0-9a-f-]+$/),
  details: z.never().optional(),
}).refine((activity) => activity.sourceKey === `${activity.sourceType}:${activity.sourceId}`, {
  message: 'sourceKey must match sourceType:sourceId',
  path: ['sourceKey'],
});
export type CrmActivityRead = z.infer<typeof CrmActivityReadSchema>;

export const CrmCreateActivityCommandSchema = z
  .object({
    organizationId: IdSchema,
    workspaceId: IdSchema.nullable().optional(),
    leadId: IdSchema,
    sourceType: CrmActivitySourceTypeSchema.optional(),
    sourceId: IdSchema.optional(),
    actorUserId: IdSchema.nullable().optional(),
    type: CrmActivityTypeSchema,
    summary: z.string().trim().min(1).max(500),
    metadata: z.record(z.string(), z.unknown()).default({}),
    occurredAt: TimestampSchema.optional(),
  })
  .refine((activity) => (activity.sourceType == null) === (activity.sourceId == null), {
    message: 'sourceType and sourceId must be provided together',
  });
export type CrmCreateActivityCommand = z.infer<typeof CrmCreateActivityCommandSchema>;

export const CrmActivityPageSchema = z.object({
  items: z.array(CrmActivityReadSchema).max(100),
  nextCursor: z.string().trim().min(1).nullable(),
  hasMore: z.boolean(),
});
export type CrmActivityPage = z.infer<typeof CrmActivityPageSchema>;
export const CrmActivityQuerySchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.optional(),
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const CrmNoteVisibilitySchema = z.enum(['private', 'team', 'organization']);

export const CrmNoteSchema = z
  .object({
    id: IdSchema,
    organizationId: IdSchema,
    contactId: IdSchema.nullable().optional(),
    leadId: IdSchema.nullable().optional(),
    opportunityId: IdSchema.nullable().optional(),
    authorUserId: IdSchema,
    body: z.string().trim().min(1).max(20_000),
    visibility: CrmNoteVisibilitySchema.default('team'),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  })
  .refine((note) => Boolean(note.contactId || note.leadId || note.opportunityId), {
    message: 'A note must belong to a contact, lead, or opportunity',
  });
export type CrmNote = z.infer<typeof CrmNoteSchema>;

export const CrmNoteReadSchema = z
  .object({
    id: IdSchema,
    organizationId: IdSchema,
    workspaceId: IdSchema,
    contactId: IdSchema.nullable().optional(),
    leadId: IdSchema.nullable().optional(),
    opportunityId: IdSchema.nullable().optional(),
    authorUserId: IdSchema,
    visibility: CrmNoteVisibilitySchema.default('team'),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    body: z.string().max(20_000).nullable(),
    canReadBody: z.boolean(),
  })
  .refine((note) => Boolean(note.contactId || note.leadId || note.opportunityId), {
    message: 'A note must belong to a contact, lead, or opportunity',
  })
  .refine((note) => note.canReadBody || note.body === null, {
    message: 'Unauthorized note bodies must be redacted',
    path: ['body'],
  });
export type CrmNoteRead = z.infer<typeof CrmNoteReadSchema>;

export const CrmCreateNoteCommandSchema = z
  .object({
    organizationId: IdSchema,
    workspaceId: IdSchema.nullable().optional(),
    contactId: IdSchema.nullable().optional(),
    leadId: IdSchema.nullable().optional(),
    opportunityId: IdSchema.nullable().optional(),
    authorUserId: IdSchema,
    body: z.string().trim().min(1).max(20_000),
    visibility: CrmNoteVisibilitySchema.default('team'),
  })
  .refine((note) => Boolean(note.contactId || note.leadId || note.opportunityId), {
    message: 'A note must belong to a contact, lead, or opportunity',
  });
export type CrmCreateNoteCommand = z.infer<typeof CrmCreateNoteCommandSchema>;

export const CrmEntityLookupItemSchema = z.object({
  id: IdSchema,
  entityType: z.enum(['contact', 'lead', 'opportunity', 'task']),
  label: z.string().trim().min(1).max(240),
  subtitle: z.string().trim().max(240).nullable(),
});
export const CrmEntityLookupPageSchema = z.object({
  items: z.array(CrmEntityLookupItemSchema).max(50),
  nextCursor: z.string().trim().min(1).nullable(),
  hasMore: z.boolean(),
});
export type CrmEntityLookupPage = z.infer<typeof CrmEntityLookupPageSchema>;
export const CrmEntityLookupQuerySchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.optional(),
  query: z.string().trim().min(1).max(100),
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export const CrmNoteQuerySchema = CrmActivityQuerySchema;

export const CrmAuditActionSchema = z.enum([
  'created',
  'updated',
  'deleted',
  'assigned',
  'stage_changed',
  'exported',
  'consent_changed',
]);

export const CrmAuditEventSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  actorUserId: IdSchema.nullable().optional(),
  entityType: z.enum([
    'contact',
    'company',
    'related_person',
    'lead',
    'opportunity',
    'activity',
    'task',
    'note',
    'conversation',
    'message',
  ]),
  entityId: IdSchema,
  action: CrmAuditActionSchema,
  before: z.record(z.string(), z.unknown()).nullable().optional(),
  after: z.record(z.string(), z.unknown()).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: TimestampSchema,
});
export type CrmAuditEvent = z.infer<typeof CrmAuditEventSchema>;

export const CrmTaskSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  leadId: IdSchema,
  assignedToUserId: IdSchema.nullable().optional(),
  title: z.string().trim().min(1).max(240),
  description: z.string().max(10_000).nullable().optional(),
  status: CrmTaskStatusSchema.default('pending'),
  priority: CrmTaskPrioritySchema.default('medium'),
  dueAt: TimestampSchema.nullable().optional(),
  completedAt: TimestampSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmTask = z.infer<typeof CrmTaskSchema>;
