import { z } from 'zod';
import { ActivityItemSchema, ActivitySourceSchema, NoteReadSchema, TaskSchema } from './tasks';
import { CrmContactSchema, CrmLeadSchema, CrmOpportunitySchema } from './crm';

const IdSchema = z.string().uuid();

export const Customer360SectionSchema = z.enum([
  'profile',
  'leads',
  'opportunities',
  'tasks',
  'notes',
  'timeline',
]);
export type Customer360Section = z.infer<typeof Customer360SectionSchema>;

export const Customer360CanvasViewSchema = z.enum(['record', 'split', 'overview']);
export type Customer360CanvasView = z.infer<typeof Customer360CanvasViewSchema>;

export const Customer360SectionStateSchema = z.enum([
  'fresh',
  'stale',
  'loading',
  'error',
  'forbidden',
]);
export type Customer360SectionState = z.infer<typeof Customer360SectionStateSchema>;

const SectionStateRecordSchema = z.object({
  profile: Customer360SectionStateSchema,
  leads: Customer360SectionStateSchema,
  opportunities: Customer360SectionStateSchema,
  tasks: Customer360SectionStateSchema,
  notes: Customer360SectionStateSchema,
  timeline: Customer360SectionStateSchema,
});

const SectionPermissionRecordSchema = z.object({
  profile: z.boolean(),
  leads: z.boolean(),
  opportunities: z.boolean(),
  tasks: z.boolean(),
  notes: z.boolean(),
  timeline: z.boolean(),
});

const Customer360ScopeInputSchema = z.object({
  // tenantId is the approved contract name. organizationId is accepted as
  // an additive compatibility alias used by the existing CRM APIs.
  tenantId: IdSchema.optional(),
  organizationId: IdSchema.optional(),
  workspaceId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  contactId: IdSchema,
});

function normalizeScope(scope: z.infer<typeof Customer360ScopeInputSchema>) {
  return {
    tenantId: scope.tenantId ?? scope.organizationId!,
    workspaceId: scope.workspaceId ?? null,
    brandId: scope.brandId ?? null,
    contactId: scope.contactId,
  };
}

export const Customer360ScopeSchema = Customer360ScopeInputSchema.refine(
  (scope) => Boolean(scope.tenantId ?? scope.organizationId),
  {
    message: 'tenantId is required',
    path: ['tenantId'],
  },
).transform(normalizeScope);
export type Customer360Scope = z.infer<typeof Customer360ScopeSchema>;

export const Customer360SectionLimitsSchema = z.object({
  leads: z.coerce.number().int().min(1).max(100).default(25),
  opportunities: z.coerce.number().int().min(1).max(100).default(25),
  tasks: z.coerce.number().int().min(1).max(100).default(25),
  notes: z.coerce.number().int().min(1).max(100).default(25),
  timeline: z.coerce.number().int().min(1).max(100).default(25),
});
export type Customer360SectionLimits = z.infer<typeof Customer360SectionLimitsSchema>;

export const Customer360ReadQuerySchema = Customer360ScopeInputSchema.extend({
  view: Customer360CanvasViewSchema.default('record'),
  sections: z
    .string()
    .optional()
    .transform((value) => (value ? value.split(',').map((section) => section.trim()) : undefined))
    .pipe(z.array(Customer360SectionSchema).optional()),
  leadsLimit: z.coerce.number().int().min(1).max(100).default(25),
  opportunitiesLimit: z.coerce.number().int().min(1).max(100).default(25),
  tasksLimit: z.coerce.number().int().min(1).max(100).default(25),
  notesLimit: z.coerce.number().int().min(1).max(100).default(25),
  timelineLimit: z.coerce.number().int().min(1).max(100).default(25),
})
  .refine((scope) => Boolean(scope.tenantId ?? scope.organizationId), {
    message: 'tenantId is required',
    path: ['tenantId'],
  })
  .transform((query) => ({
    ...normalizeScope(query),
    view: query.view,
    sections: query.sections,
    limits: {
      leads: query.leadsLimit,
      opportunities: query.opportunitiesLimit,
      tasks: query.tasksLimit,
      notes: query.notesLimit,
      timeline: query.timelineLimit,
    },
  }));
export type Customer360ReadQuery = z.infer<typeof Customer360ReadQuerySchema>;

export const Customer360SectionQuerySchema = Customer360ScopeInputSchema.extend({
  section: Customer360SectionSchema,
  cursor: IdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
})
  .refine((scope) => Boolean(scope.tenantId ?? scope.organizationId), {
    message: 'tenantId is required',
    path: ['tenantId'],
  })
  .transform((query) => ({
    ...normalizeScope(query),
    section: query.section,
    cursor: query.cursor,
    limit: query.limit,
  }));
export type Customer360SectionQuery = z.infer<typeof Customer360SectionQuerySchema>;

export const Customer360ActivityQuerySchema = Customer360ScopeInputSchema.extend({
  cursor: IdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  type: z.string().trim().max(80).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})
  .refine((scope) => Boolean(scope.tenantId ?? scope.organizationId), {
    message: 'tenantId is required',
    path: ['tenantId'],
  })
  .transform((query) => ({
    ...normalizeScope(query),
    cursor: query.cursor,
    limit: query.limit,
    type: query.type,
    from: query.from,
    to: query.to,
  }));
export type Customer360ActivityQuery = z.infer<typeof Customer360ActivityQuerySchema>;

export const AuthorizedNoteSummarySchema = NoteReadSchema.extend({
  source: ActivitySourceSchema,
});
export type AuthorizedNoteSummary = z.infer<typeof AuthorizedNoteSummarySchema>;

export const Customer360CursorsSchema = z.object({
  leads: IdSchema.nullable(),
  opportunities: IdSchema.nullable(),
  tasks: IdSchema.nullable(),
  notes: IdSchema.nullable(),
  timeline: IdSchema.nullable(),
});

export const Customer360ViewSchemaBase = z.object({
  contact: CrmContactSchema,
  leads: z.array(CrmLeadSchema),
  opportunities: z.array(CrmOpportunitySchema),
  tasks: z.array(TaskSchema),
  notes: z.array(AuthorizedNoteSummarySchema),
  timeline: z.array(ActivityItemSchema),
  cursors: Customer360CursorsSchema,
  sectionState: SectionStateRecordSchema,
  sectionPermissions: SectionPermissionRecordSchema,
});
export type Customer360ViewModel = z.infer<typeof Customer360ViewSchemaBase>;
export const Customer360ViewSchema = Customer360ViewSchemaBase;
export type Customer360View = z.infer<typeof Customer360ViewSchema>;

export const Customer360RecordViewSchema = Customer360ViewSchemaBase.extend({
  view: z.literal('record'),
});
export type Customer360RecordView = z.infer<typeof Customer360RecordViewSchema>;

export const Customer360SplitViewSchema = z.object({
  view: z.literal('split'),
  contact: CrmContactSchema,
  leads: z.array(CrmLeadSchema),
  opportunities: z.array(CrmOpportunitySchema),
  tasks: z.array(TaskSchema),
  timeline: z.array(ActivityItemSchema),
  cursors: Customer360CursorsSchema.pick({
    leads: true,
    opportunities: true,
    tasks: true,
    timeline: true,
  }),
  sectionState: SectionStateRecordSchema,
  sectionPermissions: SectionPermissionRecordSchema,
});
export type Customer360SplitView = z.infer<typeof Customer360SplitViewSchema>;

export const Customer360OverviewViewSchema = z.object({
  view: z.literal('overview'),
  contact: CrmContactSchema,
  summary: z.object({
    leadCount: z.number().int().nonnegative(),
    opportunityCount: z.number().int().nonnegative(),
    openTaskCount: z.number().int().nonnegative(),
    overdueTaskCount: z.number().int().nonnegative(),
    noteCount: z.number().int().nonnegative(),
    activityCount: z.number().int().nonnegative(),
  }),
  timeline: z.array(ActivityItemSchema),
  cursors: Customer360CursorsSchema.pick({ timeline: true }),
  sectionState: SectionStateRecordSchema,
  sectionPermissions: SectionPermissionRecordSchema,
});
export type Customer360OverviewView = z.infer<typeof Customer360OverviewViewSchema>;

export const CreateContextTaskCommandSchema = z.object({
  tenantId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  contactId: IdSchema,
  relationType: z.enum(['contact', 'lead', 'opportunity']).default('contact'),
  relationId: IdSchema.optional(),
  title: z.string().trim().min(1).max(240),
  description: z.string().max(10_000).nullable().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  type: z.string().trim().max(80).nullable().optional(),
  assignedUserId: IdSchema.nullable().optional(),
  dueAt: z.string().datetime().nullable().optional(),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type CreateContextTaskCommand = z.infer<typeof CreateContextTaskCommandSchema>;

export const CreateContextNoteCommandSchema = z.object({
  tenantId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  contactId: IdSchema,
  relationType: z.enum(['contact', 'lead', 'opportunity']).default('contact'),
  relationId: IdSchema.optional(),
  body: z.string().trim().min(1).max(20_000),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type CreateContextNoteCommand = z.infer<typeof CreateContextNoteCommandSchema>;

export const Customer360ErrorCodeSchema = z.enum([
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'VALIDATION_ERROR',
  'CROSS_TENANT_REFERENCE',
  'ACTIVITY_DEDUPLICATION_ERROR',
]);
export type Customer360ErrorCode = z.infer<typeof Customer360ErrorCodeSchema>;

export const Customer360SectionPageSchema = z.object({
  section: Customer360SectionSchema,
  items: z.array(z.unknown()).max(100),
  nextCursor: IdSchema.nullable(),
  hasMore: z.boolean(),
  state: Customer360SectionStateSchema,
});
export type Customer360SectionPage = z.infer<typeof Customer360SectionPageSchema>;

export const Customer360ActivityPageSchema = z.object({
  items: z.array(ActivityItemSchema).max(100),
  nextCursor: IdSchema.nullable(),
  hasMore: z.boolean(),
});
export type Customer360ActivityPage = z.infer<typeof Customer360ActivityPageSchema>;
