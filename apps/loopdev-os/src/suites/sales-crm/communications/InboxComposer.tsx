import { Paperclip } from 'lucide-react';
import { Button, Textarea } from '@loopdev/ui';
import { useInbox } from './useCommunicationsInbox';

export function InboxComposer() {
  const {
    selectedConversation,
    composerMode,
    draft,
    actionNotice,
    model,
    setComposerMode,
    setDraft,
    sendDraft,
    copy,
  } = useInbox();
  if (!selectedConversation) return null;

  const replyDisabled = !model.capabilities.canReply || selectedConversation.status === 'closed';
  const noteDisabled = !model.capabilities.canNote;
  const isWindowExpired = selectedConversation.windowExpiresAt
    ? new Date(selectedConversation.windowExpiresAt) < new Date()
    : false;
  const composerDisabled = composerMode === 'reply' && (replyDisabled || isWindowExpired);

  return (
    <div className="border-border-technical bg-background shrink-0 border-t px-4 py-3 sm:px-6">
      {selectedConversation.status === 'closed' ? <p className="text-text-muted mb-3 text-xs">{copy.closedDescription}</p> : null}
      {isWindowExpired ? <p className="text-energy mb-3 text-xs">{copy.expiredWindowDescription}</p> : null}
      {actionNotice ? <p className="text-success mb-2 text-xs" role="status">{actionNotice}</p> : null}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="bg-shell-surface inline-flex rounded-md p-0.5" role="group" aria-label={copy.composerModeLabel}>
          <button type="button" aria-pressed={composerMode === 'reply'} disabled={replyDisabled} onClick={() => setComposerMode('reply')} className={`rounded px-3 py-1.5 text-xs font-medium ${composerMode === 'reply' ? 'bg-background text-text-main shadow-sm' : 'text-text-muted'}`}>
            {copy.replyLabel}
          </button>
          <button type="button" aria-pressed={composerMode === 'note'} disabled={noteDisabled} onClick={() => setComposerMode('note')} className={`rounded px-3 py-1.5 text-xs font-medium ${composerMode === 'note' ? 'bg-energy/10 text-energy shadow-sm' : 'text-text-muted'}`}>
            {copy.internalNoteLabel}
          </button>
        </div>
        <span className="text-text-muted text-[11px]">{composerMode === 'note' ? copy.internalNoteAudienceLabel : copy.replyAudienceLabel}</span>
      </div>
      <Textarea
        aria-label={composerMode === 'note' ? copy.noteInputLabel : copy.replyInputLabel}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={composerMode === 'note' ? copy.notePlaceholder : copy.replyPlaceholder}
        disabled={composerDisabled}
        size="sm"
        className="[&_textarea]:min-h-20"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <button type="button" className="text-text-muted hover:text-text-main inline-flex size-8 items-center justify-center rounded-md" aria-label={copy.attachLabel} disabled>
          <Paperclip size={16} aria-hidden="true" />
        </button>
        <Button type="button" variant={composerMode === 'note' ? 'energy' : 'primary'} size="sm" disabled={composerDisabled || !draft.trim()} onClick={sendDraft} endIcon="send">
          {composerMode === 'note' ? copy.addNoteLabel : copy.sendReplyLabel}
        </Button>
      </div>
    </div>
  );
}
