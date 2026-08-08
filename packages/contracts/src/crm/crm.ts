import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const CrmLeadStageSchema = z.enum(['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost', 'rejected', 'discarded']);
export const CrmLeadStatusSchema = z.enum(['active', 'inactive', 'stalled']);
export const CrmActivityTypeSchema = z.enum(['note', 'call', 'status_change', 'task_created', 'task_completed', 'document', 'email', 'whatsapp']);
export const CrmTaskStatusSchema = z.enum(['pending', 'completed', 'cancelled']);
export const CrmTaskPrioritySchema = z.enum(['low', 'medium', 'high']);

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

export const CrmLeadSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  contactId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  stage: CrmLeadStageSchema.default('lead'),
  status: CrmLeadStatusSchema.default('active'),
  source: z.string().trim().max(120).nullable().optional(),
  campaign: z.string().trim().max(160).nullable().optional(),
  assignedToUserId: IdSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CrmLead = z.infer<typeof CrmLeadSchema>;

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
