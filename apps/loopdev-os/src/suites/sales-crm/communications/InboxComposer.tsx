import { Paperclip } from 'lucide-react';
import { Button, IconButton, Input, Select, Textarea } from '@loopdev/ui';
import { useInbox } from './useCommunicationsInbox';

export function InboxComposer() {
  const {
    selectedConversation,
    composerMode,
    draft,
    actionNotice,
    model,
    templates,
    selectedTemplateId,
    templateParameters,
    setComposerMode,
    setDraft,
    setSelectedTemplateId,
    setTemplateParameter,
    sendDraft,
    sendTemplate,
    copy,
  } = useInbox();
  if (!selectedConversation) return null;

  const replyDisabled = !model.capabilities.canReply || selectedConversation.status === 'closed';
  const noteDisabled = !model.capabilities.canNote;
  const template = templates.find(({ id }) => id === selectedTemplateId);
  const templateParametersComplete = Boolean(
    template && template.parameterNames.every((name) => Boolean(templateParameters[name]?.trim())),
  );
  const isWindowExpired = selectedConversation.windowExpiresAt
    ? new Date(selectedConversation.windowExpiresAt) < new Date()
    : false;
  const composerDisabled =
    composerMode === 'reply'
      ? replyDisabled || isWindowExpired
      : composerMode === 'template'
        ? replyDisabled || !template || !templateParametersComplete
        : noteDisabled;

  return (
    <div className="border-border-technical bg-background shrink-0 border-t px-4 py-3 sm:px-6">
      {selectedConversation.status === 'closed' ? (
        <p className="text-text-muted mb-3 text-xs">{copy.closedDescription}</p>
      ) : null}
      {isWindowExpired ? (
        <p className="text-energy mb-3 text-xs">{copy.expiredWindowDescription}</p>
      ) : null}
      {actionNotice ? (
        <p className="text-success mb-2 text-xs" role="status">
          {actionNotice}
        </p>
      ) : null}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div
          className="bg-shell-surface inline-flex rounded-md p-0.5"
          role="group"
          aria-label={copy.composerModeLabel}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={composerMode === 'reply'}
            disabled={replyDisabled}
            onClick={() => setComposerMode('reply')}
            className={`rounded text-xs ${composerMode === 'reply' ? 'bg-background text-text-main shadow-sm' : 'text-text-muted'}`}
          >
            {copy.replyLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={composerMode === 'template'}
            disabled={!model.capabilities.canReply || templates.length === 0}
            onClick={() => setComposerMode('template')}
            className={`rounded text-xs ${composerMode === 'template' ? 'bg-primary/10 text-primary shadow-sm' : 'text-text-muted'}`}
          >
            {copy.templateLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={composerMode === 'note'}
            disabled={noteDisabled}
            onClick={() => setComposerMode('note')}
            className={`rounded text-xs ${composerMode === 'note' ? 'bg-energy/10 text-energy shadow-sm' : 'text-text-muted'}`}
          >
            {copy.internalNoteLabel}
          </Button>
        </div>
        <span className="text-text-muted text-[11px]">
          {composerMode === 'note' ? copy.internalNoteAudienceLabel : copy.replyAudienceLabel}
        </span>
      </div>
      {composerMode === 'template' ? (
        <div className="space-y-2">
          <Select
            aria-label={copy.templateInputLabel}
            value={selectedTemplateId ?? ''}
            onChange={(event) => setSelectedTemplateId(event.target.value)}
            disabled={templates.length === 0 || replyDisabled}
            size="sm"
          >
            <option value="">{copy.templatePlaceholder}</option>
            {templates.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          {template?.parameterNames.map((name) => (
            <Input
              key={name}
              aria-label={copy.templateParameterLabel(name)}
              value={templateParameters[name] ?? ''}
              onChange={(event) => setTemplateParameter(name, event.target.value)}
              placeholder={name}
              disabled={replyDisabled}
              size="sm"
            />
          ))}
          {template ? <p className="text-text-muted text-xs">{template.body}</p> : null}
        </div>
      ) : (
        <Textarea
          aria-label={composerMode === 'note' ? copy.noteInputLabel : copy.replyInputLabel}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={composerMode === 'note' ? copy.notePlaceholder : copy.replyPlaceholder}
          disabled={composerDisabled}
          size="sm"
          className="[&_textarea]:min-h-20"
        />
      )}
      <div className="mt-2 flex items-center justify-between gap-3">
        <IconButton variant="ghost" size="sm" ariaLabel={copy.attachLabel} disabled>
          <Paperclip size={16} aria-hidden="true" />
        </IconButton>
        <Button
          type="button"
          variant={composerMode === 'note' ? 'energy' : 'primary'}
          size="sm"
          disabled={composerDisabled || (composerMode !== 'template' && !draft.trim())}
          onClick={composerMode === 'template' ? sendTemplate : sendDraft}
          endIcon="send"
        >
          {composerMode === 'note' ? copy.addNoteLabel : copy.sendReplyLabel}
        </Button>
      </div>
    </div>
  );
}
