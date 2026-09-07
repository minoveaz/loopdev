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
          className="text-text-main font-mono text-sm uppercase tracking-[0.14em]"
        >
          C12 · Feedback and global context
        </h2>
        <p className="text-text-muted mt-1 max-w-2xl text-xs">
          Reusable confirmation, recovery, notification and command patterns for operational flows.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
        <TechnicalSurface variant="surface" radius="md" border="subtle" className="space-y-4 p-4">
          <div className="border-border-subtle flex flex-wrap items-start justify-between gap-3 border-b pb-3">
            <div>
              <p className="text-text-muted font-mono text-[10px] uppercase tracking-[0.16em]">
                Operational record
              </p>
              <Heading as="h3" size="sm" weight="bold" className="text-text-main mt-1">
                {archived ? 'Workspace review · archived' : 'Workspace review'}
              </Heading>
              <p className="text-text-muted mt-1 text-xs">
                A representative action flow with confirmation, success and recovery states.
              </p>
            </div>
            <span className="border-border-subtle text-text-muted rounded border px-2 py-1 text-xs">
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
            <p className="text-text-muted text-sm">
              The item will leave the active workspace view until it is restored.
            </p>
          </TechnicalDialog>
        </TechnicalSurface>

        <TechnicalSurface variant="surface" radius="md" border="subtle" className="space-y-4 p-4">
          <div>
            <p className="text-text-muted font-mono text-[10px] uppercase tracking-[0.16em]">
              Feedback states
            </p>
            <Heading as="h3" size="sm" weight="bold" className="text-text-main mt-1">
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
          <div className="border-border-subtle text-text-muted border-t pt-3 text-xs">
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
