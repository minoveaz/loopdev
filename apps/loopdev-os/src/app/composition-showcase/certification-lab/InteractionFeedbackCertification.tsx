'use client';

import {
  Button,
  CommandDialog,
  Heading,
  TechnicalDialog,
  TechnicalSurface,
  ToastItem,
} from '@loopdev/ui';
import { useState } from 'react';

export function InteractionFeedbackCertification() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [toast, setToast] = useState<'success' | 'error' | null>('success');
  const [archived, setArchived] = useState(false);

  const archiveItem = () => {
    setConfirmOpen(false);
    setArchived(true);
    setToast('success');
  };

  const restoreItem = () => {
    setArchived(false);
    setToast(null);
  };

  return (
    <section className="space-y-4" aria-labelledby="interaction-feedback-heading">
      <div>
        <h2
          id="interaction-feedback-heading"
          className="font-mono text-sm uppercase tracking-[0.14em] text-text-main"
        >
          C12 · Feedback and global context
        </h2>
        <p className="mt-1 max-w-2xl text-xs text-text-muted">
          Reusable confirmation, recovery, notification and command patterns for operational flows.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
        <TechnicalSurface variant="surface" radius="md" border="subtle" className="space-y-4 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle pb-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                Operational record
              </p>
              <Heading as="h3" size="sm" weight="bold" className="mt-1 text-text-main">
                {archived ? 'Workspace review · archived' : 'Workspace review'}
              </Heading>
              <p className="mt-1 text-xs text-text-muted">
                A representative action flow with confirmation, success and recovery states.
              </p>
            </div>
            <span className="rounded border border-border-subtle px-2 py-1 text-xs text-text-muted">
              {archived ? 'Archived' : 'Active'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              disabled={archived}
            >
              Archive item
            </Button>
            <Button variant="outline" size="sm" onClick={() => setToast('error')}>
              Simulate error
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCommandOpen(true)}>
              Open commands
            </Button>
          </div>
          <TechnicalDialog
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            title="Archive workspace review?"
            description="This changes the item state and can be reversed from the recovery action."
            variant="warning"
            actions={
              <>
                <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={archiveItem}>
                  Archive
                </Button>
              </>
            }
          >
            <p className="text-sm text-text-muted">
              The item will leave the active workspace view until it is restored.
            </p>
          </TechnicalDialog>
        </TechnicalSurface>

        <TechnicalSurface variant="surface" radius="md" border="subtle" className="space-y-4 p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
              Feedback states
            </p>
            <Heading as="h3" size="sm" weight="bold" className="mt-1 text-text-main">
              Status and recovery
            </Heading>
          </div>
          {toast ? (
            <ToastItem
              id="c12-feedback-toast"
              title={toast === 'success' ? 'Item archived' : 'Archive failed'}
              description={
                toast === 'success'
                  ? 'The item was removed from the active workspace.'
                  : 'The operation could not be completed. Try again.'
              }
              variant={toast}
              onDismiss={() => setToast(null)}
              action={
                toast === 'success'
                  ? { label: 'Undo', onClick: restoreItem }
                  : { label: 'Retry', onClick: () => setToast('success') }
              }
            />
          ) : (
            <Button variant="outline" size="sm" onClick={() => setToast('success')}>
              Show success feedback
            </Button>
          )}
          <div className="border-t border-border-subtle pt-3 text-xs text-text-muted">
            <p>Success offers Undo. Error offers Retry. Dismiss keeps the workflow unobstructed.</p>
          </div>
        </TechnicalSurface>
      </div>

      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Workspace commands"
        description="Search and run an available operation."
        placeholder="Search commands..."
        emptyMessage="No commands found."
        closeLabel="Close workspace commands"
        closeOnSelect
        commands={[
          {
            id: 'archive',
            label: 'Archive current item',
            description: 'Move the item out of the active workspace',
            onSelect: () => setConfirmOpen(true),
          },
          {
            id: 'restore',
            label: 'Restore archived item',
            description: 'Return the item to the active workspace',
            onSelect: restoreItem,
          },
        ]}
        groups={[
          {
            id: 'navigation',
            label: 'Navigation',
            commands: [
              {
                id: 'activity',
                label: 'Open activity history',
                onSelect: () => setToast('success'),
              },
            ],
          },
        ]}
      />
    </section>
  );
}
