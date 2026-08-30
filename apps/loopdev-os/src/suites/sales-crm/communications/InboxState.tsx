import { Button, EmptyState, Skeleton } from '@loopdev/ui';
import type { InboxPresentationState } from './types';
import { useInbox } from './useCommunicationsInbox';

export function InboxState({ state }: { state: InboxPresentationState }) {
  const { copy, retry } = useInbox();
  if (state === 'loading') {
    return (
      <div className="space-y-3 p-4" role="status" aria-label={copy.loadingLabel}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    );
  }
  if (state === 'forbidden') {
    return (
      <EmptyState
        title={copy.accessRequiredTitle}
        description={copy.accessRequiredDescription}
        icon="lock"
      />
    );
  }
  if (state === 'empty') {
    return (
      <EmptyState
        title={copy.noConversationsTitle}
        description={copy.noConversationsDescription}
        icon="chat_bubble_outline"
      />
    );
  }
  if (state === 'error') {
    return (
      <EmptyState
        status="error"
        title={copy.inboxUnavailableTitle}
        description={copy.inboxUnavailableDescription}
        icon="error_outline"
        action={
          <Button size="sm" variant="outline" onClick={retry}>
            {copy.retryLabel}
          </Button>
        }
      />
    );
  }
  return null;
}
