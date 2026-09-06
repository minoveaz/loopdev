import type {
  CommunicationChannel,
  CommunicationConversationStatus,
  CommunicationInboxComposerMode,
  CommunicationInboxConversation,
  CommunicationInboxFilter,
  CommunicationInboxMessage,
  CommunicationInboxModel,
  CommunicationInboxPresentation,
  CommunicationInboxTemplate,
} from '@loopdev/contracts';
import type { ReactNode } from 'react';

export type InboxConversation = CommunicationInboxConversation;
export type InboxMessage = CommunicationInboxMessage;
export type InboxModel = CommunicationInboxModel;
export type InboxFilter = CommunicationInboxFilter;
export type ComposerMode = CommunicationInboxComposerMode;
export type InboxPresentationState = CommunicationInboxPresentation;
export type InboxTemplate = CommunicationInboxTemplate;
export type CommunicationMessageStatus = InboxMessage['status'];
export type InboxStatus = CommunicationConversationStatus;

export type InboxFilterOption = {
  id: InboxFilter;
  label: string;
};

export type InboxStatusTone = 'success' | 'energy' | 'neutral' | 'primary';
export type InboxMobileSurface = 'list' | 'thread' | 'context';

export type InboxLifecycleAction = {
  status: InboxStatus;
  label: string;
  icon: string;
};

export type InboxCopy = {
  title: string;
  countLabel: (count: number) => string;
  connectedLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  filtersLabel: string;
  filters: InboxFilterOption[];
  statusLabel: (status: InboxStatus) => string;
  statusTone: (status: InboxStatus) => InboxStatusTone;
  lifecycleAction: (status: InboxStatus) => InboxLifecycleAction;
  searchInputId: string;
  contextHeadingId: string;
  messagesLabel: (contactName: string) => string;
  conversationListLabel: string;
  conversationsLabel: (count: number) => string;
  loadingLabel: string;
  accessRequiredTitle: string;
  accessRequiredDescription: string;
  noConversationsTitle: string;
  noConversationsDescription: string;
  noMatchesTitle: string;
  noMatchesDescription: string;
  inboxUnavailableTitle: string;
  inboxUnavailableDescription: string;
  accountPausedTitle: string;
  accountPausedDescription: string;
  expiredWindowTitle: string;
  retryLabel: string;
  sendFailureTitle: string;
  sendFailureDescription: string;
  conflictTitle: string;
  conflictDescription: string;
  offlineTitle: string;
  offlineDescription: string;
  selectConversationTitle: string;
  selectConversationDescription: string;
  noContextTitle: string;
  noContextDescription: string;
  backToConversationsLabel: string;
  channelLabel: (channel: CommunicationChannel) => string;
  customerConversationLabel: string;
  activeUntilLabel: (date: string) => string;
  closedDescription: string;
  expiredWindowDescription: string;
  actionNotice: {
    assigned: string;
    replySent: string;
    noteAdded: string;
    statusChanged: (status: string) => string;
  };
  composerModeLabel: string;
  replyLabel: string;
  internalNoteLabel: string;
  templateLabel: string;
  templateInputLabel: string;
  templatePlaceholder: string;
  templateParameterLabel: (name: string) => string;
  internalNoteAudienceLabel: string;
  replyAudienceLabel: string;
  replyInputLabel: string;
  noteInputLabel: string;
  replyPlaceholder: string;
  notePlaceholder: string;
  attachLabel: string;
  sendReplyLabel: string;
  addNoteLabel: string;
  assignToSelfLabel: string;
  assignedToLabel: (name: string) => string;
  reopenLabel: string;
  closeLabel: string;
  phoneLabel: string;
  noCompanyLabel: string;
  noMessagesLabel: string;
  assignedLabel: string;
  unassignedLabel: string;
  lastActivityLabel: string;
  crmContextLabel: string;
  contactRecordLabel: string;
  companyRelationshipLabel: string;
  activeCustomerLabel: string;
  linkedContextLabel: string;
  messageAriaLabel: (kind: string, author: string) => string;
  internalNoteMessageLabel: string;
  sentMessageLabel: string;
  receivedMessageLabel: string;
  moreActionsLabel: string;
  openContextLabel: string;
  backToThreadLabel: string;
  unreadLabel: (count: number) => string;
  messageStatusLabel: (status: CommunicationMessageStatus) => string;
  todayLabel: string;
};

export type InboxFormatters = {
  time: (value: string) => string;
  date: (value: string) => string;
};

export type InboxActionResult = {
  conversation?: InboxConversation;
  notice?: string;
};

export type InboxDataSource = {
  load: (organizationId: string) => Promise<InboxModel>;
  assignToSelf?: (conversation: InboxConversation) => Promise<InboxActionResult>;
  send?: (
    conversation: InboxConversation,
    mode: ComposerMode,
    body: string,
  ) => Promise<InboxActionResult>;
  changeStatus?: (
    conversation: InboxConversation,
    status: InboxStatus,
  ) => Promise<InboxActionResult>;
  loadTemplates?: (organizationId: string) => Promise<InboxTemplate[]>;
  sendTemplate?: (
    conversation: InboxConversation,
    templateId: string,
    parameters: Record<string, string>,
  ) => Promise<InboxActionResult>;
};

export type InboxProviderProps = {
  children: ReactNode;
  organizationId?: string | null;
  initialModel?: InboxModel;
  dataSource: InboxDataSource;
  copy: InboxCopy;
  formatters: InboxFormatters;
  actorLabel: string;
};

export type InboxContextValue = {
  model: InboxModel;
  conversations: InboxConversation[];
  selectedConversation: InboxConversation | undefined;
  filter: InboxFilter;
  searchQuery: string;
  composerMode: ComposerMode;
  draft: string;
  actionNotice: string | null;
  copy: InboxCopy;
  formatters: InboxFormatters;
  actorLabel: string;
  mobileSurface: InboxMobileSurface;
  templates: InboxTemplate[];
  selectedTemplateId: string | null;
  templateParameters: Record<string, string>;
  setFilter: (filter: InboxFilter) => void;
  setSearchQuery: (query: string) => void;
  selectConversation: (conversationId: string) => void;
  showMobileList: () => void;
  showMobileThread: () => void;
  showMobileContext: () => void;
  setComposerMode: (mode: ComposerMode) => void;
  setDraft: (draft: string) => void;
  setSelectedTemplateId: (templateId: string) => void;
  setTemplateParameter: (name: string, value: string) => void;
  retry: () => void;
  assignToSelf: () => void;
  sendDraft: () => void;
  sendTemplate: () => void;
  changeStatus: (status: InboxStatus) => void;
};
