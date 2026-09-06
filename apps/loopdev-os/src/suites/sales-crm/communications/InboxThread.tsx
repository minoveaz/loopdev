import {
  ArrowLeft,
  Check,
  CheckCheck,
  CircleAlert,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  UsersRound,
} from 'lucide-react';
import { Badge, Button, EmptyState, Heading, IconButton, UserAvatar } from '@loopdev/ui';
import { InboxComposer } from './InboxComposer';
import { useInbox } from './useCommunicationsInbox';
import type { CommunicationMessageStatus, InboxMessage } from './types';

function MessageStatus({ status }: { status: CommunicationMessageStatus }) {
  const { copy } = useInbox();
  if (status === 'failed')
    return (
      <span className="text-danger inline-flex items-center gap-1 text-[11px]">
        <CircleAlert size={12} aria-hidden="true" /> {copy.messageStatusLabel(status)}
      </span>
    );
  if (status === 'queued')
    return (
      <span className="text-text-muted inline-flex items-center gap-1 text-[11px]">
        <Clock3 size={12} aria-hidden="true" /> {copy.messageStatusLabel(status)}
      </span>
    );
  return (
    <span className="text-text-muted inline-flex items-center gap-1 text-[11px]">
      {status === 'read' ? (
        <CheckCheck size={12} aria-hidden="true" />
      ) : (
        <Check size={12} aria-hidden="true" />
      )}{' '}
      {copy.messageStatusLabel(status)}
    </span>
  );
}

function MessageBubble({ item }: { item: InboxMessage }) {
  const { copy, formatters, actorLabel } = useInbox();
  const isNote = item.kind === 'note';
  const isOutbound = item.direction === 'outbound';
  const kindLabel = isNote
    ? copy.internalNoteMessageLabel
    : isOutbound
      ? copy.sentMessageLabel
      : copy.receivedMessageLabel;
  return (
    <article
      className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
      aria-label={copy.messageAriaLabel(kindLabel, item.authorName ?? actorLabel)}
    >
      <div
        className={`max-w-[82%] rounded-lg border px-3 py-2.5 ${isNote ? 'border-energy/30 bg-energy/10' : isOutbound ? 'border-primary/20 bg-primary/10' : 'border-border-subtle bg-background'}`}
      >
        <div className="mb-1 flex items-center justify-between gap-4">
          <span
            className={`text-[11px] font-semibold ${isNote ? 'text-energy' : 'text-text-muted'}`}
          >
            {kindLabel}
          </span>
          <time className="text-text-muted text-[10px]" dateTime={item.createdAt}>
            {formatters.time(item.createdAt)}
          </time>
        </div>
        <p className="text-text-main whitespace-pre-wrap break-words text-sm leading-relaxed">
          {item.body}
        </p>
        {isOutbound && !isNote ? (
          <div className="mt-1 text-right">
            <MessageStatus status={item.status} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function CommunicationsInboxThread() {
  const {
    selectedConversation,
    model,
    assignToSelf,
    copy,
    formatters,
    mobileSurface,
    showMobileList,
    showMobileContext,
  } = useInbox();
  if (!selectedConversation)
    return (
      <EmptyState
        title={copy.selectConversationTitle}
        description={copy.selectConversationDescription}
        icon="touch_app"
      />
    );

  return (
    <div
      className={`bg-shell-canvas flex h-full min-h-0 flex-col ${mobileSurface !== 'thread' ? 'max-lg:hidden' : ''}`}
    >
      <header className="border-border-technical flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <IconButton
            variant="ghost"
            size="sm"
            className="shrink-0 lg:hidden"
            ariaLabel={copy.backToConversationsLabel}
            onClick={showMobileList}
          >
            <ArrowLeft size={17} aria-hidden="true" />
          </IconButton>
          <UserAvatar
            name={selectedConversation.contactName}
            initials={selectedConversation.contactInitials}
            size="md"
          />
          <div className="min-w-0">
            <Heading as="h2" size="lg" weight="semibold" className="text-text-main truncate">
              {selectedConversation.contactName}
            </Heading>
            <p className="text-text-muted truncate text-xs">
              {copy.channelLabel(selectedConversation.channel)} ·{' '}
              {selectedConversation.contactPhone}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge status={copy.statusTone(selectedConversation.status)}>
            {copy.statusLabel(selectedConversation.status)}
          </Badge>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!model.capabilities.canAssign || Boolean(selectedConversation.assignedToName)}
            onClick={assignToSelf}
            startIcon="person_add"
          >
            {selectedConversation.assignedToName
              ? selectedConversation.assignedToName
              : copy.assignToSelfLabel}
          </Button>
          <IconButton variant="ghost" size="sm" ariaLabel={copy.moreActionsLabel}>
            <MoreHorizontal size={18} aria-hidden="true" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel={copy.openContextLabel}
            onClick={showMobileContext}
            className="lg:hidden"
          >
            <UsersRound size={17} aria-hidden="true" />
          </IconButton>
        </div>
      </header>
      <div className="border-border-subtle bg-shell-surface flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2 text-xs sm:px-6">
        <span className="text-text-muted inline-flex items-center gap-1.5">
          <MessageCircle size={14} aria-hidden="true" /> {copy.customerConversationLabel}
        </span>
        <span className="text-text-muted">
          {copy.activeUntilLabel(
            formatters.date(
              selectedConversation.windowExpiresAt ?? selectedConversation.lastActivityAt,
            ),
          )}
        </span>
      </div>
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <div
          className="mx-auto flex max-w-2xl flex-col gap-4"
          aria-label={copy.messagesLabel(selectedConversation.contactName)}
        >
          <p className="text-text-muted text-center text-[11px]">{copy.todayLabel}</p>
          {selectedConversation.messages.map((item) => (
            <MessageBubble key={item.id} item={item} />
          ))}
        </div>
      </div>
      <InboxComposer />
    </div>
  );
}
