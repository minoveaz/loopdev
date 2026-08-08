import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const CommunicationChannelSchema = z.enum(['email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone']);
export const CommunicationConversationStatusSchema = z.enum(['open', 'pending', 'snoozed', 'closed']);
export const CommunicationMessageDirectionSchema = z.enum(['inbound', 'outbound']);
export const CommunicationMessageStatusSchema = z.enum(['queued', 'sent', 'delivered', 'read', 'failed']);

export const CommunicationConversationSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  contactId: IdSchema,
  channel: CommunicationChannelSchema,
  status: CommunicationConversationStatusSchema,
  assignedToUserId: IdSchema.nullable().optional(),
  lastInboundAt: TimestampSchema.nullable().optional(),
  windowExpiresAt: TimestampSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CommunicationConversation = z.infer<typeof CommunicationConversationSchema>;

export const CommunicationMessageSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  conversationId: IdSchema,
  externalId: z.string().trim().max(240).nullable().optional(),
  direction: CommunicationMessageDirectionSchema,
  status: CommunicationMessageStatusSchema,
  body: z.string().max(100_000).nullable().optional(),
  templateId: z.string().trim().max(240).nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CommunicationMessage = z.infer<typeof CommunicationMessageSchema>;

export const SendCommunicationCommandSchema = z.object({
  organizationId: IdSchema,
  conversationId: IdSchema,
  channel: CommunicationChannelSchema,
  body: z.string().trim().max(100_000).nullable().optional(),
  templateId: z.string().trim().max(240).nullable().optional(),
  templateParameters: z.record(z.string(), z.string().max(2_000)).default({}),
}).superRefine((value, context) => {
  if (!value.body && !value.templateId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'body or templateId is required' });
  }
});
export type SendCommunicationCommand = z.infer<typeof SendCommunicationCommandSchema>;
