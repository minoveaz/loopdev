import { Search } from 'lucide-react';
import { EmptyState, Input, UserAvatar } from '@loopdev/ui';
import { InboxState } from './InboxState';
import { useInbox } from './useCommunicationsInbox';

export function CommunicationsInboxList() {
  const {
    model,
    conversations,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    selectedConversation,
    selectConversation,
    copy,
    formatters,
  } = useInbox();

  return (
    <div className="bg-background flex min-h-full flex-col">
      <div className="border-border-subtle shrink-0 border-b p-3">
        <label className="sr-only" htmlFor={copy.searchInputId}>
          {copy.searchLabel}
        </label>
        <Input
          id={copy.searchInputId}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          size="sm"
          startIcon={<Search size={15} aria-hidden="true" />}
        />
        <div className="mt-3 grid grid-cols-4 gap-1" aria-label={copy.filtersLabel} role="group">
          {copy.filters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`focus-visible:outline-primary min-h-8 rounded-md px-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 ${filter === item.id ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:bg-shell-surface hover:text-text-main'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="text-text-muted mt-3 text-[11px]" aria-live="polite">
          {copy.conversationsLabel(conversations.length)}
        </p>
      </div>
      <div
        className="min-h-0 flex-1 overflow-y-auto"
        aria-label={copy.conversationListLabel}
        role="list"
      >
        <InboxState state={model.presentation} />
        {model.presentation === 'ready' && conversations.length === 0 ? (
          <EmptyState
            title={copy.noMatchesTitle}
            description={copy.noMatchesDescription}
            icon="search_off"
            size="sm"
            variant="ghost"
          />
        ) : null}
        {conversations.map((conversation) => {
          const selected = conversation.id === selectedConversation?.id;
          return (
            <div key={conversation.id} role="listitem">
              <button
                type="button"
                aria-current={selected ? 'page' : undefined}
                aria-label={`${conversation.contactName}, ${copy.statusLabel(conversation.status)}, ${conversation.preview ?? copy.noMessagesLabel}`}
                onClick={() => selectConversation(conversation.id)}
                className={`border-border-subtle focus-visible:outline-primary flex w-full min-w-0 gap-3 border-b px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${selected ? 'bg-primary/10' : 'hover:bg-shell-surface'}`}
              >
                <UserAvatar
                  name={conversation.contactName}
                  initials={conversation.contactInitials}
                  size="md"
                  className="shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-text-main truncate text-sm font-semibold">
                      {conversation.contactName}
                    </span>
                    <span className="text-text-muted shrink-0 text-[10px]">
                      {formatters.time(conversation.lastActivityAt)}
                    </span>
                  </span>
                  <span className="text-text-muted mt-0.5 block truncate text-[11px]">
                    {conversation.contactCompany ?? copy.noCompanyLabel}
                  </span>
                  <span className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-text-muted line-clamp-1 text-xs">
                      {conversation.preview ?? copy.noMessagesLabel}
                    </span>
                    {conversation.unreadCount > 0 ? (
                      <span
                        className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                        aria-label={copy.unreadLabel(conversation.unreadCount)}
                      >
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
