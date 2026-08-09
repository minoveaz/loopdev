import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const CommunicationChannelSchema = z.enum(['email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone']);
export const CommunicationConversationStatusSchema = z.enum(['open', 'pending', 'snoozed', 'closed']);
export const CommunicationMessageDirectionSchema = z.enum(['inbound', 'outbound']);
export const CommunicationMessageStatusSchema = z.enum(['queued', 'sent', 'delivered', 'read', 'failed']);
export const CommunicationAccountStatusSchema = z.enum(['pending', 'connected', 'disconnected', 'error']);
export const CommunicationTemplateStatusSchema = z.enum(['draft', 'approved', 'rejected', 'archived']);

export const CommunicationAccountSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  channel: CommunicationChannelSchema,
  provider: z.string().trim().min(1).max(80),
  externalAccountId: z.string().trim().min(1).max(240),
  status: CommunicationAccountStatusSchema,
  credentialsRef: z.string().trim().min(1).max(240),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CommunicationAccount = z.infer<typeof CommunicationAccountSchema>;

export const CommunicationTemplateSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  channel: CommunicationChannelSchema,
  externalTemplateId: z.string().trim().min(1).max(240),
  language: z.string().trim().min(2).max(20),
  status: CommunicationTemplateStatusSchema,
  body: z.string().trim().min(1).max(100_000),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CommunicationTemplate = z.infer<typeof CommunicationTemplateSchema>;

export const CommunicationInboundEventSchema = z.object({
  organizationId: IdSchema,
  accountId: IdSchema,
  externalEventId: z.string().trim().min(1).max(240),
  externalMessageId: z.string().trim().max(240).nullable().optional(),
  receivedAt: TimestampSchema,
  payloadVersion: z.string().trim().min(1).max(40),
});
export type CommunicationInboundEvent = z.infer<typeof CommunicationInboundEventSchema>;

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

export const CreateCommunicationConversationCommandSchema = z.object({
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  contactId: IdSchema,
  channelId: IdSchema,
  channel: CommunicationChannelSchema,
});
export type CreateCommunicationConversationCommand = z.infer<typeof CreateCommunicationConversationCommandSchema>;

export const CreateCommunicationMessageCommandSchema = z.object({
  organizationId: IdSchema,
  conversationId: IdSchema,
  externalId: z.string().trim().max(240).nullable().optional(),
  direction: CommunicationMessageDirectionSchema,
  status: CommunicationMessageStatusSchema.default('queued'),
  body: z.string().max(100_000).nullable().optional(),
  templateId: IdSchema.nullable().optional(),
}).superRefine((value, context) => {
  if (!value.body && !value.templateId) context.addIssue({ code: z.ZodIssueCode.custom, message: 'body or templateId is required' });
});
export type CreateCommunicationMessageCommand = z.infer<typeof CreateCommunicationMessageCommandSchema>;

export const CreateCommunicationInternalNoteCommandSchema = z.object({
  organizationId: IdSchema,
  conversationId: IdSchema,
  body: z.string().trim().min(1).max(100_000),
});
export type CreateCommunicationInternalNoteCommand = z.infer<typeof CreateCommunicationInternalNoteCommandSchema>;

export const RecordCommunicationMessageStatusCommandSchema = z.object({
  organizationId: IdSchema,
  messageId: IdSchema,
  status: CommunicationMessageStatusSchema,
  providerTimestamp: TimestampSchema.nullable().optional(),
});
export type RecordCommunicationMessageStatusCommand = z.infer<typeof RecordCommunicationMessageStatusCommandSchema>;

export const RetryCommunicationMessageCommandSchema = z.object({
  organizationId: IdSchema,
  messageId: IdSchema,
  errorCode: z.string().trim().max(120).nullable().optional(),
});
export type RetryCommunicationMessageCommand = z.infer<typeof RetryCommunicationMessageCommandSchema>;
