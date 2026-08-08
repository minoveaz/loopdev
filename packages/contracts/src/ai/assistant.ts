import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const AiTaskTypeSchema = z.enum(['lead_classification', 'conversation_summary', 'reply_suggestion', 'document_extraction', 'next_action', 'customer_summary', 'insurance_recommendation']);
export const AiRecommendationStatusSchema = z.enum(['pending', 'accepted', 'rejected', 'expired']);

export const AiAssistantRunSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  taskType: AiTaskTypeSchema,
  modelProvider: z.string().trim().min(1).max(80),
  modelVersion: z.string().trim().min(1).max(120),
  contextVersion: z.string().trim().min(1).max(120),
  inputHash: z.string().trim().min(1).max(128),
  confidenceScore: z.number().min(0).max(1).nullable().optional(),
  createdAt: TimestampSchema,
});
export type AiAssistantRun = z.infer<typeof AiAssistantRunSchema>;

export const AiRecommendationSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  runId: IdSchema,
  entityType: z.enum(['lead', 'opportunity', 'conversation', 'document', 'customer']),
  entityId: IdSchema,
  summary: z.string().trim().min(1).max(20_000),
  evidence: z.array(z.record(z.string(), z.unknown())).default([]),
  status: AiRecommendationStatusSchema.default('pending'),
  approvedByUserId: IdSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type AiRecommendation = z.infer<typeof AiRecommendationSchema>;
