import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const TaskStatusSchema = z.enum(['open', 'in_progress', 'completed', 'cancelled']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskPrioritySchema = z.enum(['low', 'normal', 'high', 'urgent']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const TaskRelationTypeSchema = z.enum(['contact', 'lead', 'opportunity']);
export type TaskRelationType = z.infer<typeof TaskRelationTypeSchema>;

export const ActivityTypeSchema = z.enum([
  'task',
  'note',
  'stage_change',
  'assignment',
  'conversion',
  'reopen',
]);
export type ActivityType = z.infer<typeof ActivityTypeSchema>;

export const ActivityActorTypeSchema = z.enum(['user', 'system']);
export type ActivityActorType = z.infer<typeof ActivityActorTypeSchema>;

export const ActivityOriginSchema = z.enum([
  'task',
  'note',
  'entity',
  'customer_360',
  'system',
]);
export type ActivityOrigin = z.infer<typeof ActivityOriginSchema>;

export const ActivitySourceTypeSchema = z.enum(['task', 'note', 'event']);
export type ActivitySourceType = z.infer<typeof ActivitySourceTypeSchema>;

const ScopeSchema = {
  organizationId: IdSchema,
  // organizationId is the canonical platform boundary. tenantId is retained
  // as the CRM contract alias while legacy consumers migrate.
  tenantId: IdSchema.optional(),
  workspaceId: IdSchema.nullable(),
  brandId: IdSchema.nullable().optional(),
};

export const TaskSchema = z.object({
  ...ScopeSchema,
  id: IdSchema,
  title: z.string().trim().min(1).max(240),
  description: z.string().max(10_000).nullable(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  type: z.string().trim().max(80).nullable(),
  assignedUserId: IdSchema.nullable().default(null),
  dueAt: TimestampSchema.nullable().default(null),
  relationType: TaskRelationTypeSchema,
  relationId: IdSchema,
  createdBy: IdSchema,
  completedAt: TimestampSchema.nullable(),
  version: z.number().int().positive(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type Task = z.infer<typeof TaskSchema>;

export const NotePermissionsSchema = z.object({
  canEdit: z.boolean(),
  canModerate: z.boolean(),
});

export const NoteSchema = z.object({
  ...ScopeSchema,
  id: IdSchema,
  relationType: TaskRelationTypeSchema,
  relationId: IdSchema,
  authorId: IdSchema,
  body: z.string().trim().min(1).max(20_000),
  permissions: NotePermissionsSchema,
  version: z.number().int().positive(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type Note = z.infer<typeof NoteSchema>;

export const NoteReadSchema = NoteSchema.omit({ body: true }).extend({
  body: z.string().max(20_000).nullable(),
  permissions: NotePermissionsSchema,
});
export type NoteRead = z.infer<typeof NoteReadSchema>;

export const TimelineEventSchema = z.object({
  ...ScopeSchema,
  id: IdSchema,
  relationType: TaskRelationTypeSchema,
  relationId: IdSchema,
  type: ActivityTypeSchema,
  actorId: IdSchema.nullable(),
  actorType: ActivityActorTypeSchema,
  origin: ActivityOriginSchema,
  occurredAt: TimestampSchema,
  summary: z.string().trim().min(1).max(500),
  metadata: z.record(z.string(), z.string()),
});
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

export const ActivitySourceSchema = z.object({
  sourceType: ActivitySourceTypeSchema,
  sourceId: IdSchema,
});
export type ActivitySource = z.infer<typeof ActivitySourceSchema>;

export const ActivityItemSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('task'), source: ActivitySourceSchema, task: TaskSchema }),
  z.object({ kind: z.literal('note'), source: ActivitySourceSchema, note: NoteSchema }),
  z.object({ kind: z.literal('event'), source: ActivitySourceSchema, event: TimelineEventSchema }),
]);
export type ActivityItem = z.infer<typeof ActivityItemSchema>;

const RelationFields = {
  relationType: TaskRelationTypeSchema,
  relationId: IdSchema,
};

export const CreateTaskCommandSchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  title: z.string().trim().min(1).max(240),
  description: z.string().max(10_000).nullable().optional(),
  priority: TaskPrioritySchema.default('normal'),
  type: z.string().trim().max(80).nullable().optional(),
  assignedUserId: IdSchema.nullable().default(null),
  dueAt: TimestampSchema.nullable().default(null),
  ...RelationFields,
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type CreateTaskCommand = z.infer<typeof CreateTaskCommandSchema>;

export const UpdateTaskCommandSchema = z.object({
  organizationId: IdSchema,
  taskId: IdSchema,
  title: z.string().trim().min(1).max(240).optional(),
  description: z.string().max(10_000).nullable().optional(),
  priority: TaskPrioritySchema.optional(),
  type: z.string().trim().max(80).nullable().optional(),
  dueAt: TimestampSchema.nullable().optional(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type UpdateTaskCommand = z.infer<typeof UpdateTaskCommandSchema>;

export const CompleteTaskCommandSchema = z.object({
  organizationId: IdSchema,
  taskId: IdSchema,
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type CompleteTaskCommand = z.infer<typeof CompleteTaskCommandSchema>;

export const ReopenTaskCommandSchema = z.object({
  organizationId: IdSchema,
  taskId: IdSchema,
  expectedVersion: z.number().int().positive(),
  reason: z.string().trim().min(1).max(500),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type ReopenTaskCommand = z.infer<typeof ReopenTaskCommandSchema>;

export const AssignTaskCommandSchema = z.object({
  organizationId: IdSchema,
  taskId: IdSchema,
  assignedUserId: IdSchema.nullable(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type AssignTaskCommand = z.infer<typeof AssignTaskCommandSchema>;

export const CreateNoteCommandSchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
  brandId: IdSchema.nullable().optional(),
  ...RelationFields,
  body: z.string().trim().min(1).max(20_000),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type CreateNoteCommand = z.infer<typeof CreateNoteCommandSchema>;

export const UpdateNoteCommandSchema = z.object({
  organizationId: IdSchema,
  noteId: IdSchema,
  body: z.string().trim().min(1).max(20_000),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().trim().min(8).max(160),
});
export type UpdateNoteCommand = z.infer<typeof UpdateNoteCommandSchema>;

export const TaskQuerySchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.optional(),
  brandId: IdSchema.optional(),
  status: TaskStatusSchema.optional(),
  assignedUserId: IdSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  relationType: TaskRelationTypeSchema.optional(),
  cursor: IdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type TaskQuery = z.infer<typeof TaskQuerySchema>;

export const TaskPageSchema = z.object({
  items: z.array(TaskSchema).max(100),
  nextCursor: IdSchema.nullable(),
  hasMore: z.boolean(),
});
export type TaskPage = z.infer<typeof TaskPageSchema>;

export const TimelineQuerySchema = z.object({
  organizationId: IdSchema,
  workspaceId: IdSchema.optional(),
  brandId: IdSchema.optional(),
  ...RelationFields,
  cursor: IdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type TimelineQuery = z.infer<typeof TimelineQuerySchema>;

export const TimelinePageSchema = z.object({
  items: z.array(TimelineEventSchema).max(100),
  nextCursor: IdSchema.nullable(),
  hasMore: z.boolean(),
});
export type TimelinePage = z.infer<typeof TimelinePageSchema>;

export const MyDayViewSchema = z.object({
  overdue: z.array(TaskSchema),
  today: z.array(TaskSchema),
  upcoming: z.array(TaskSchema),
  withoutDueDate: z.array(TaskSchema),
  counts: z.object({
    overdue: z.number().int().nonnegative(),
    today: z.number().int().nonnegative(),
    completedToday: z.number().int().nonnegative(),
    upcoming: z.number().int().nonnegative(),
    urgentOpen: z.number().int().nonnegative(),
  }),
  nextCursor: IdSchema.nullable(),
});
export type MyDayView = z.infer<typeof MyDayViewSchema>;

export const TaskErrorCodeSchema = z.enum([
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'CONFLICT',
  'IDEMPOTENCY_CONFLICT',
  'RELATION_REQUIRED',
  'RELATION_NOT_FOUND',
  'INVALID_STATUS_TRANSITION',
  'ASSIGNMENT_FORBIDDEN',
  'DUE_DATE_INVALID',
  'NOTE_EDIT_FORBIDDEN',
  'NOTE_MODERATION_FORBIDDEN',
  'RELATION_CHANGE_FORBIDDEN',
  'CROSS_TENANT_REFERENCE',
]);
export type TaskErrorCode = z.infer<typeof TaskErrorCodeSchema>;
