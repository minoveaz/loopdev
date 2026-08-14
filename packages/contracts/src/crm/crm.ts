import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const CrmLeadStageSchema = z.enum(['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost', 'rejected', 'discarded']);
export const CrmLeadStatusSchema = z.enum(['active', 'inactive', 'stalled']);
export const CrmActivityTypeSchema = z.enum(['note', 'call', 'status_change', 'task_created', 'task_completed', 'document', 'email', 'whatsapp']);
export const CrmTaskStatusSchema = z.enum(['pending', 'completed', 'cancelled']);
export const CrmTaskPrioritySchema = z.enum(['low', 'medium', 'high']);
export const CrmCompanyTypeSchema = z.enum(['person', 'organization']);
export const CrmRelatedPersonRoleSchema = z.enum(['family_member', 'household_member', 'beneficiary', 'insured', 'other']);
export const CrmConsentChannelSchema = z.enum(['email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone']);
export const CrmConsentStatusSchema = z.enum(['granted', 'withdrawn', 'not_requested']);
export const CrmLeadSourceSchema = z.enum(['manual', 'website', 'facebook', 'instagram', 'whatsapp', 'email', 'referral', 'campaign', 'other']);

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
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmContact = z.infer<typeof CrmContactSchema>;

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

export const CrmContactCompanyRoleSchema = z.enum(['primary', 'employee', 'decision_maker', 'billing', 'other']);
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
  contactId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  stage: CrmLeadStageSchema.default('lead'),
  status: CrmLeadStatusSchema.default('active'),
  source: CrmLeadSourceSchema.default('manual'),
  externalLeadId: z.string().trim().max(240).nullable().optional(),
  campaign: z.string().trim().max(160).nullable().optional(),
  assignedToUserId: IdSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmLead = z.infer<typeof CrmLeadSchema>;

export const CrmCreateLeadCommandSchema = z.object({
  organizationId: IdSchema,
  contactId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  source: CrmLeadSourceSchema.default('manual'),
  externalLeadId: z.string().trim().max(240).nullable().optional(),
  campaign: z.string().trim().max(160).nullable().optional(),
  utm: z.record(z.string(), z.string().max(500)).default({}),
  interest: z.string().trim().max(240).nullable().optional(),
});
export type CrmCreateLeadCommand = z.infer<typeof CrmCreateLeadCommandSchema>;

export const CrmLeadAttributionSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  leadId: IdSchema,
  source: CrmLeadSourceSchema,
  externalLeadId: z.string().trim().max(240).nullable().optional(),
  campaign: z.string().trim().max(160).nullable().optional(),
  medium: z.string().trim().max(120).nullable().optional(),
  content: z.string().trim().max(240).nullable().optional(),
  term: z.string().trim().max(240).nullable().optional(),
  capturedAt: TimestampSchema,
});
export type CrmLeadAttribution = z.infer<typeof CrmLeadAttributionSchema>;

export const CrmCaptureLeadCommandSchema = z.object({
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().max(120).nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().trim().min(3).max(32).nullable().optional(),
  companyName: z.string().trim().max(160).nullable().optional(),
  source: CrmLeadSourceSchema,
  externalLeadId: z.string().trim().max(240).nullable().optional(),
  campaign: z.string().trim().max(160).nullable().optional(),
  utm: z.object({
    source: z.string().trim().max(120).nullable().optional(),
    medium: z.string().trim().max(120).nullable().optional(),
    campaign: z.string().trim().max(160).nullable().optional(),
    content: z.string().trim().max(240).nullable().optional(),
    term: z.string().trim().max(240).nullable().optional(),
  }).default({}),
});
export type CrmCaptureLeadCommand = z.infer<typeof CrmCaptureLeadCommandSchema>;

export const CrmPipelineStageSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  key: CrmLeadStageSchema,
  label: z.string().trim().min(1).max(80),
  position: z.number().int().nonnegative(),
  isTerminal: z.boolean().default(false),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmPipelineStage = z.infer<typeof CrmPipelineStageSchema>;

export const CrmOpportunitySchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  leadId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  name: z.string().trim().min(1).max(160),
  stage: CrmLeadStageSchema,
  amount: z.number().nonnegative().nullable().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
  probability: z.number().int().min(0).max(100).nullable().optional(),
  expectedCloseAt: TimestampSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmOpportunity = z.infer<typeof CrmOpportunitySchema>;

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

export const CrmActivitySourceTypeSchema = z.enum(['contact', 'lead', 'opportunity', 'task', 'note', 'assignment', 'stage']);
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

export const CrmCreateActivityCommandSchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  leadId: IdSchema,
  actorUserId: IdSchema.nullable().optional(),
  type: CrmActivityTypeSchema,
  summary: z.string().trim().min(1).max(500),
  metadata: z.record(z.string(), z.unknown()).default({}),
  occurredAt: TimestampSchema.optional(),
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

export const CrmNoteSchema = z.object({
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
}).refine(
  (note) => Boolean(note.contactId || note.leadId || note.opportunityId),
  { message: 'A note must belong to a contact, lead, or opportunity' },
);
export type CrmNote = z.infer<typeof CrmNoteSchema>;

export const CrmNoteReadSchema = z.object({
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
}).refine((note) => Boolean(note.contactId || note.leadId || note.opportunityId), {
  message: 'A note must belong to a contact, lead, or opportunity',
}).refine((note) => note.canReadBody || note.body === null, {
  message: 'Unauthorized note bodies must be redacted',
  path: ['body'],
});
export type CrmNoteRead = z.infer<typeof CrmNoteReadSchema>;

export const CrmCreateNoteCommandSchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  contactId: IdSchema.nullable().optional(),
  leadId: IdSchema.nullable().optional(),
  opportunityId: IdSchema.nullable().optional(),
  authorUserId: IdSchema,
  body: z.string().trim().min(1).max(20_000),
  visibility: CrmNoteVisibilitySchema.default('team'),
}).refine((note) => Boolean(note.contactId || note.leadId || note.opportunityId), {
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

export const CrmAuditActionSchema = z.enum(['created', 'updated', 'deleted', 'assigned', 'stage_changed', 'exported', 'consent_changed']);

export const CrmAuditEventSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  actorUserId: IdSchema.nullable().optional(),
  entityType: z.enum(['contact', 'company', 'related_person', 'lead', 'opportunity', 'activity', 'task', 'note', 'conversation', 'message']),
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
