import { z } from 'zod';
import {
  CommunicationConversationSchema,
  CommunicationConversationStatusSchema,
  CommunicationMessageSchema,
} from './communications';

export const CommunicationInboxMessageKindSchema = z.enum(['message', 'note']);
export type CommunicationInboxMessageKind = z.infer<typeof CommunicationInboxMessageKindSchema>;

export const CommunicationInboxPresentationSchema = z.enum([
  'ready',
  'loading',
  'empty',
  'filtered-empty',
  'no-selection',
  'forbidden',
  'error',
  'paused',
  'window-expired',
  'send-failure',
  'conflict',
  'offline',
]);
export type CommunicationInboxPresentation = z.infer<typeof CommunicationInboxPresentationSchema>;

export const CommunicationInboxCapabilitiesSchema = z.object({
  canReply: z.boolean(),
  canNote: z.boolean(),
  canAssign: z.boolean(),
  canChangeLifecycle: z.boolean(),
});
export type CommunicationInboxCapabilities = z.infer<typeof CommunicationInboxCapabilitiesSchema>;

export const COMMUNICATION_INBOX_CAPABILITY_PERMISSIONS = {
  canReply: 'communications.reply',
  canNote: 'communications.note',
  canAssign: 'communications.assign',
  canChangeLifecycle: 'communications.lifecycle',
} as const;

export const CommunicationInboxMessageSchema = CommunicationMessageSchema.extend({
  kind: CommunicationInboxMessageKindSchema,
  authorName: z.string().trim().min(1).max(512).nullable(),
});
export type CommunicationInboxMessage = z.infer<typeof CommunicationInboxMessageSchema>;

export const CommunicationInboxConversationSchema = CommunicationConversationSchema.extend({
  contactName: z.string().trim().min(1).max(512),
  contactInitials: z.string().trim().min(1).max(8),
  contactCompany: z.string().trim().max(512).nullable(),
  contactPhone: z.string().trim().max(80),
  unreadCount: z.number().int().min(0),
  preview: z.string().max(100_000).nullable(),
  assignedToName: z.string().trim().max(512).nullable(),
  messages: z.array(CommunicationInboxMessageSchema),
});
export type CommunicationInboxConversation = z.infer<typeof CommunicationInboxConversationSchema>;

export const CommunicationInboxModelSchema = z.object({
  organizationId: z.string().uuid(),
  conversations: z.array(CommunicationInboxConversationSchema),
  capabilities: CommunicationInboxCapabilitiesSchema,
  presentation: CommunicationInboxPresentationSchema,
});
export type CommunicationInboxModel = z.infer<typeof CommunicationInboxModelSchema>;

export const CommunicationInboxFilterSchema = z.union([
  z.literal('all'),
  CommunicationConversationStatusSchema.extract(['open', 'pending', 'closed']),
]);
export type CommunicationInboxFilter = z.infer<typeof CommunicationInboxFilterSchema>;

export const CommunicationInboxComposerModeSchema = z.enum(['reply', 'template', 'note']);
export type CommunicationInboxComposerMode = z.infer<typeof CommunicationInboxComposerModeSchema>;

export const CommunicationInboxTemplateSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  channel: z.literal('whatsapp'),
  externalTemplateId: z.string().trim().min(1).max(240),
  language: z.string().trim().min(2).max(20),
  name: z.string().trim().min(1).max(512),
  body: z.string().trim().min(1).max(100_000),
  parameterNames: z.array(z.string().trim().min(1).max(120)).max(100),
});
export type CommunicationInboxTemplate = z.infer<typeof CommunicationInboxTemplateSchema>;

const CommunicationInboxActionBaseSchema = {
  organizationId: z.string().uuid(),
  conversationId: z.string().uuid(),
};

export const CommunicationInboxActionSchema = z.discriminatedUnion('action', [
  z.object({ ...CommunicationInboxActionBaseSchema, action: z.literal('assign') }),
  z.object({
    ...CommunicationInboxActionBaseSchema,
    action: z.literal('reply'),
    body: z.string().trim().min(1).max(4_096),
  }),
  z.object({
    ...CommunicationInboxActionBaseSchema,
    action: z.literal('note'),
    body: z.string().trim().min(1).max(100_000),
  }),
  z.object({
    ...CommunicationInboxActionBaseSchema,
    action: z.literal('template'),
    templateId: z.string().uuid(),
    templateParameters: z.record(z.string(), z.string().max(2_000)).default({}),
  }),
  z.object({
    ...CommunicationInboxActionBaseSchema,
    action: z.literal('status'),
    status: CommunicationConversationStatusSchema,
  }),
]);
export type CommunicationInboxAction = z.infer<typeof CommunicationInboxActionSchema>;
