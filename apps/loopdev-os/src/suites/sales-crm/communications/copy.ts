import type { InboxCopy, InboxFormatters } from './types';

export const COMMUNICATIONS_INBOX_COPY: InboxCopy = {
  title: 'Communications',
  countLabel: (count) => `WhatsApp inbox · ${count} visible`,
  connectedLabel: 'Connected',
  searchLabel: 'Search conversations',
  searchPlaceholder: 'Search conversations',
  filtersLabel: 'Conversation status filter',
  filters: [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'pending', label: 'Pending' },
    { id: 'closed', label: 'Closed' },
  ],
  statusLabel: (status) =>
    status === 'open'
      ? 'Open'
      : status === 'pending'
        ? 'Pending'
        : status === 'snoozed'
          ? 'Snoozed'
          : 'Closed',
  statusTone: (status) =>
    status === 'open'
      ? 'success'
      : status === 'pending'
        ? 'energy'
        : status === 'closed'
          ? 'neutral'
          : 'primary',
  lifecycleAction: (status) =>
    status === 'closed'
      ? { status: 'open', label: 'Reopen conversation', icon: 'refresh' }
      : { status: 'closed', label: 'Close conversation', icon: 'archive' },
  searchInputId: 'communications-inbox-search',
  contextHeadingId: 'communications-inbox-context-heading',
  messagesLabel: (contactName) => `Messages with ${contactName}`,
  conversationListLabel: 'Conversations',
  conversationsLabel: (count) => `${count} conversations`,
  loadingLabel: 'Loading conversations',
  accessRequiredTitle: 'Inbox access required',
  accessRequiredDescription: 'You do not have permission to view Communications.',
  noConversationsTitle: 'No conversations yet',
  noConversationsDescription: 'New WhatsApp conversations will appear here.',
  noMatchesTitle: 'No matches',
  noMatchesDescription: 'Try another search or clear the status filter.',
  inboxUnavailableTitle: 'Inbox unavailable',
  inboxUnavailableDescription: 'The conversation list could not be loaded.',
  accountPausedTitle: 'WhatsApp account paused',
  accountPausedDescription: 'Outbound messaging is paused until the account is reconnected.',
  expiredWindowTitle: 'Reply window expired',
  retryLabel: 'Retry',
  sendFailureTitle: 'Message not sent',
  sendFailureDescription: 'The message could not be delivered. Review the conversation and try again.',
  conflictTitle: 'Conversation changed',
  conflictDescription: 'This conversation was updated elsewhere. Refresh before continuing.',
  offlineTitle: 'You are offline',
  offlineDescription: 'Reconnect to load the latest conversations and send messages.',
  selectConversationTitle: 'Select a conversation',
  selectConversationDescription:
    'Choose a conversation from the Inbox to review its messages and context.',
  noContextTitle: 'No context selected',
  noContextDescription: 'Select a conversation to see the CRM relationship.',
  backToConversationsLabel: 'Back to conversations',
  channelLabel: (channel) => (channel === 'whatsapp' ? 'WhatsApp' : channel),
  customerConversationLabel: 'Customer conversation',
  activeUntilLabel: (date) => `Active until ${date}`,
  closedDescription: 'This conversation is closed. Reopen it to continue working.',
  expiredWindowDescription:
    'The WhatsApp reply window has expired. Use an approved template to restart the conversation.',
  actionNotice: {
    assigned: 'Conversation assigned to you.',
    replySent: 'Reply sent.',
    noteAdded: 'Internal note added.',
    statusChanged: (status) => `Conversation marked ${status.toLowerCase()}.`,
  },
  composerModeLabel: 'Composer mode',
  replyLabel: 'Reply',
  internalNoteLabel: 'Internal note',
  templateLabel: 'Template',
  templateInputLabel: 'Approved WhatsApp template',
  templatePlaceholder: 'Choose a template',
  templateParameterLabel: (name) => `Template parameter ${name}`,
  internalNoteAudienceLabel: 'Only visible to your team',
  replyAudienceLabel: 'WhatsApp message',
  replyInputLabel: 'Reply message',
  noteInputLabel: 'Internal note',
  replyPlaceholder: 'Write a reply...',
  notePlaceholder: 'Add an internal note...',
  attachLabel: 'Attach a file',
  sendReplyLabel: 'Send reply',
  addNoteLabel: 'Add note',
  assignToSelfLabel: 'Assign to me',
  assignedToLabel: (name) => `Assigned to ${name}`,
  reopenLabel: 'Reopen conversation',
  closeLabel: 'Close conversation',
  phoneLabel: 'Phone',
  noCompanyLabel: 'No company linked',
  noMessagesLabel: 'No messages yet',
  assignedLabel: 'Assigned',
  unassignedLabel: 'Unassigned',
  lastActivityLabel: 'Last activity',
  crmContextLabel: 'CRM context',
  contactRecordLabel: 'Contact record',
  companyRelationshipLabel: 'Company relationship',
  activeCustomerLabel: 'Active customer',
  linkedContextLabel: 'CRM context linked',
  messageAriaLabel: (kind, author) => `${kind} from ${author}`,
  internalNoteMessageLabel: 'Internal note',
  sentMessageLabel: 'Sent message',
  receivedMessageLabel: 'Received message',
  moreActionsLabel: 'More conversation actions',
  openContextLabel: 'Open CRM context',
  backToThreadLabel: 'Back to conversation',
  unreadLabel: (count) => `${count} unread`,
  messageStatusLabel: (status) =>
    status === 'queued'
      ? 'Queued'
      : status === 'sent'
        ? 'Sent'
        : status === 'delivered'
          ? 'Delivered'
          : status === 'read'
            ? 'Read'
            : 'Failed',
  todayLabel: 'Today',
};

export const COMMUNICATIONS_INBOX_FORMATTERS: InboxFormatters = {
  time: (value) =>
    new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(
      new Date(value),
    ),
  date: (value) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)),
};

export const COMMUNICATIONS_INBOX_ACTOR_LABEL = 'CRM User';
