import { z } from 'zod';

const IdSchema = z.string().uuid();

export const CustomerWorkspaceQuerySchema = z.object({
  organizationId: IdSchema,
  contactId: IdSchema,
  workspaceId: IdSchema.nullable().optional(),
});
export type CustomerWorkspaceQuery = z.infer<typeof CustomerWorkspaceQuerySchema>;

export const CustomerWorkspaceSummarySchema = z.object({
  contact: z.record(z.string(), z.unknown()),
  companies: z.array(z.record(z.string(), z.unknown())).default([]),
  relatedPeople: z.array(z.record(z.string(), z.unknown())).default([]),
  leads: z.array(z.record(z.string(), z.unknown())).default([]),
  opportunities: z.array(z.record(z.string(), z.unknown())).default([]),
  conversations: z.array(z.record(z.string(), z.unknown())).default([]),
  documents: z.array(z.record(z.string(), z.unknown())).default([]),
  consent: z.array(z.record(z.string(), z.unknown())).default([]),
});
export type CustomerWorkspaceSummary = z.infer<typeof CustomerWorkspaceSummarySchema>;
