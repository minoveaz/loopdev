import { MessageCircle } from 'lucide-react';
import { Badge, Heading } from '@loopdev/ui';
import { useInbox } from './useCommunicationsInbox';

export function CommunicationsInboxModuleHeader() {
  const { conversations, copy } = useInbox();
  return (
    <div className="border-border-technical bg-shell-canvas flex min-h-14 items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-primary" size={18} aria-hidden="true" />
          <Heading as="h1" size="lg" weight="semibold" className="text-text-main truncate">
            {copy.title}
          </Heading>
        </div>
        <p className="text-text-muted mt-0.5 text-xs">{copy.countLabel(conversations.length)}</p>
      </div>
      <Badge status="success" variant="outline" icon="check_circle">
        {copy.connectedLabel}
      </Badge>
    </div>
  );
}
