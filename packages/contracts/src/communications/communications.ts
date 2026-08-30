import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const CommunicationChannelSchema = z.enum(['email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone']);
export const CommunicationConversationStatusSchema = z.enum(['open', 'pending', 'snoozed', 'closed']);
export const CommunicationMessageDirectionSchema = z.enum(['inbound', 'outbound']);
export const CommunicationMessageStatusSchema = z.enum(['queued', 'sent', 'delivered', 'read', 'failed']);
export const CommunicationAccountStatusSchema = z.enum(['pending', 'connected', 'disconnected', 'error']);
export const CommunicationTemplateStatusSchema = z.enum(['draft', 'approved', 'rejected', 'archived']);
export const CommunicationAccountOnboardingStatusSchema = z.enum(['pending', 'connected', 'failed', 'expired']);
export const CommunicationTemplateCategorySchema = z.enum(['authentication', 'marketing', 'utility']);
export const CommunicationWorkerJobTypeSchema = z.enum(['delivery', 'retry', 'purge']);
export type CommunicationWorkerJobType = z.infer<typeof CommunicationWorkerJobTypeSchema>;
export const CommunicationPermissionKeySchema = z.enum([
  'communications.read',
  'communications.reply',
  'communications.note',
  'communications.assign',
  'communications.lifecycle',
  'communications.manage-accounts',
]);
export type CommunicationPermissionKey = z.infer<typeof CommunicationPermissionKeySchema>;

export const CommunicationWorkerJobSchema = z.object({
  id: IdSchema,
  type: CommunicationWorkerJobTypeSchema,
  organizationId: IdSchema,
  accountId: IdSchema.nullable().optional(),
  messageId: IdSchema.nullable().optional(),
  traceId: z.string().trim().min(1).max(240),
  attempt: z.number().int().min(0).max(3).default(0),
  createdAt: TimestampSchema,
}).superRefine((value, context) => {
  if ((value.type === 'delivery' || value.type === 'retry') && (!value.accountId || !value.messageId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'delivery and retry jobs require accountId and messageId' });
  }
  if (value.type === 'purge' && (value.accountId || value.messageId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'purge jobs must not target an account or message' });
  }
});
export type CommunicationWorkerJob = z.infer<typeof CommunicationWorkerJobSchema>;

export const StartWhatsAppEmbeddedSignupCommandSchema = z.object({
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  state: z.string().trim().min(32).max(240),
});
export type StartWhatsAppEmbeddedSignupCommand = z.infer<typeof StartWhatsAppEmbeddedSignupCommandSchema>;

export const CompleteWhatsAppEmbeddedSignupCommandSchema = z.object({
  organizationId: IdSchema,
  onboardingId: IdSchema,
  code: z.string().trim().min(1).max(4_000),
});
export type CompleteWhatsAppEmbeddedSignupCommand = z.infer<typeof CompleteWhatsAppEmbeddedSignupCommandSchema>;

export type MessagingProvider = {
  sendText(input: {
    accountId: string;
    recipient: string;
    body: string;
    idempotencyKey: string;
  }): Promise<{ providerMessageId: string }>;
  sendTemplate(input: {
    accountId: string;
    recipient: string;
    templateId: string;
    parameterNames: string[];
    parameters: Record<string, string>;
    idempotencyKey: string;
  }): Promise<{ providerMessageId: string }>;
};

export const CommunicationAccountSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  channel: CommunicationChannelSchema,
  provider: z.string().trim().min(1).max(80),
  externalAccountId: z.string().trim().min(1).max(240),
  status: CommunicationAccountStatusSchema,
  outboundEnabled: z.boolean().default(true),
  credentialsRef: z.string().trim().min(1).max(240),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CommunicationAccount = z.infer<typeof CommunicationAccountSchema>;

export const CommunicationTemplateSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  accountId: IdSchema,
  channel: CommunicationChannelSchema,
  externalTemplateId: z.string().trim().min(1).max(240),
  language: z.string().trim().min(2).max(20),
  name: z.string().trim().min(1).max(512),
  category: CommunicationTemplateCategorySchema,
  status: CommunicationTemplateStatusSchema,
  body: z.string().trim().min(1).max(100_000),
  parameterNames: z.array(z.string().trim().min(1).max(120)).max(100).default([]),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CommunicationTemplate = z.infer<typeof CommunicationTemplateSchema>;

export const SynchronizeCommunicationTemplatesCommandSchema = z.object({
  organizationId: IdSchema,
  accountId: IdSchema,
});
export type SynchronizeCommunicationTemplatesCommand = z.infer<typeof SynchronizeCommunicationTemplatesCommandSchema>;

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
  accountId: IdSchema,
  contactId: IdSchema,
  channelId: IdSchema,
  channel: CommunicationChannelSchema,
  status: CommunicationConversationStatusSchema,
  assignedToUserId: IdSchema.nullable().optional(),
  lastActivityAt: TimestampSchema,
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
  templateId: IdSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CommunicationMessage = z.infer<typeof CommunicationMessageSchema>;

export const SendCommunicationCommandSchema = z.object({
  organizationId: IdSchema,
  conversationId: IdSchema,
  channel: CommunicationChannelSchema,
  body: z.string().trim().max(100_000).nullable().optional(),
  templateId: IdSchema.nullable().optional(),
  templateParameters: z.record(z.string(), z.string().max(2_000)).default({}),
  idempotencyKey: z.string().trim().min(1).max(240),
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
  idempotencyKey: z.string().trim().min(1).max(240).nullable().optional(),
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
