import { ArrowLeft, UsersRound } from 'lucide-react';
import { Button, EmptyState, Heading, UserAvatar } from '@loopdev/ui';
import { useInbox } from './useCommunicationsInbox';

export function CommunicationsInboxContext() {
  const {
    selectedConversation,
    assignToSelf,
    model,
    changeStatus,
    copy,
    formatters,
    showMobileThread,
    mobileSurface,
  } = useInbox();

  if (!selectedConversation) {
    return (
      <div className={`space-y-5 p-4 ${mobileSurface !== 'context' ? 'max-lg:hidden' : ''}`}>
        <EmptyState
          title={copy.noContextTitle}
          description={copy.noContextDescription}
          icon="person_search"
          size="sm"
          variant="ghost"
        />
      </div>
    );
  }

  const lifecycleAction = copy.lifecycleAction(selectedConversation.status);

  return (
    <div className={`space-y-5 p-4 ${mobileSurface !== 'context' ? 'max-lg:hidden' : ''}`}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={copy.backToThreadLabel}
        onClick={showMobileThread}
        className="text-text-muted hover:text-text-main text-xs font-semibold lg:hidden"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {copy.backToThreadLabel}
      </Button>
      <div className="flex items-center gap-3">
        <UserAvatar
          name={selectedConversation.contactName}
          initials={selectedConversation.contactInitials}
          size="lg"
        />
        <div className="min-w-0">
          <Heading as="h3" size="lg" weight="semibold" className="text-text-main truncate">
            {selectedConversation.contactName}
          </Heading>
          <p className="text-text-muted truncate text-xs">
            {selectedConversation.contactCompany ?? copy.noCompanyLabel}
          </p>
        </div>
      </div>
      <dl className="divide-border-subtle border-border-subtle divide-y border-y text-sm">
        <div className="flex items-center justify-between gap-3 py-3">
          <dt className="text-text-muted">{copy.phoneLabel}</dt>
          <dd className="text-text-main font-medium">{selectedConversation.contactPhone}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 py-3">
          <dt className="text-text-muted">{copy.assignedLabel}</dt>
          <dd className="text-text-main font-medium">
            {selectedConversation.assignedToName ?? copy.unassignedLabel}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 py-3">
          <dt className="text-text-muted">{copy.lastActivityLabel}</dt>
          <dd className="text-text-main font-medium">
            {formatters.date(selectedConversation.lastActivityAt)}
          </dd>
        </div>
      </dl>
      <section aria-labelledby={copy.contextHeadingId}>
        <div className="mb-3 flex items-center gap-2">
          <UsersRound size={15} className="text-primary" aria-hidden="true" />
          <h4
            id={copy.contextHeadingId}
            className="text-text-main text-xs font-semibold uppercase tracking-[0.12em]"
          >
            {copy.crmContextLabel}
          </h4>
        </div>
        <div className="border-border-subtle space-y-3 border-y py-3 text-xs">
          <p className="text-text-muted">
            {copy.contactRecordLabel}{' '}
            <span className="text-text-main font-medium">
              #{selectedConversation.contactId.slice(0, 8)}
            </span>
          </p>
          <p className="text-text-muted">
            {copy.companyRelationshipLabel}{' '}
            <span className="text-text-main font-medium">{copy.activeCustomerLabel}</span>
          </p>
        </div>
      </section>
      <div className="space-y-2">
        <Button
          type="button"
          fullWidth
          size="sm"
          variant="outline"
          disabled={!model.capabilities.canAssign || Boolean(selectedConversation.assignedToName)}
          onClick={assignToSelf}
          startIcon="person_add"
        >
          {selectedConversation.assignedToName
            ? copy.assignedToLabel(selectedConversation.assignedToName)
            : copy.assignToSelfLabel}
        </Button>
        {model.capabilities.canChangeLifecycle ? (
          <Button
            type="button"
            fullWidth
            size="sm"
            variant="ghost"
            onClick={() => changeStatus(lifecycleAction.status)}
            startIcon={lifecycleAction.icon}
          >
            {lifecycleAction.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
