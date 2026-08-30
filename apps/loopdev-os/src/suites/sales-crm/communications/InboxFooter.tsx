import { Archive } from 'lucide-react';
import { useInbox } from './useCommunicationsInbox';

export function CommunicationsInboxFooter() {
  const { selectedConversation, copy } = useInbox();
  return selectedConversation ? (
    <div className="text-text-muted flex items-center gap-2 text-xs">
      <Archive size={13} aria-hidden="true" /> {copy.linkedContextLabel}
    </div>
  ) : null;
}
