'use client';

import {
  Button,
  IconButton,
  QuickActionMenu,
  TechnicalDialog,
  TechnicalSurface,
  ToastItem,
} from '@loopdev/ui';
import { useState } from 'react';

const RECORDS = ['Marta Ruiz', 'Leo Martin', 'Nora Silva'];

export function OperationalActionsCertification() {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([RECORDS[0]]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
    variant: 'success' | 'error';
    showUndo?: boolean;
  } | null>({
    title: 'Record deleted successfully',
    description: 'The last destructive action can still be reverted.',
    variant: 'success',
    showUndo: true,
  });

  const runAction = (action: string, message: string) => {
    setLoadingAction(action);
    setToast(null);
    window.setTimeout(() => {
      setLoadingAction(null);
      setToast({
        title: action,
        description: message,
        variant: 'success',
        showUndo: action === 'Delete records',
      });
    }, 450);
  };

  const toggleRecord = (record: string) => {
    setSelectedRecords((current) =>
      current.includes(record) ? current.filter((item) => item !== record) : [...current, record],
    );
  };

  return (
    <section className="space-y-4" aria-labelledby="operational-actions-heading">
      <div>
        <h2
          id="operational-actions-heading"
          className="font-mono text-sm uppercase tracking-[0.14em] text-text-main"
        >
          C9 · Operational actions
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Primary, contextual, bulk, destructive and recoverable actions remain controlled by the
          composition.
        </p>
      </div>

      <TechnicalSurface variant="surface" radius="md" border="technical" className="space-y-5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-text-muted">Action toolbar</p>
            <p className="mt-1 text-sm text-text-main">Reusable controls with explicit ownership</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              isLoading={loadingAction === 'Create record'}
              onClick={() => runAction('Create record', 'A new record is ready to configure.')}
            >
              Create record
            </Button>
            <QuickActionMenu
              triggerLabel="More actions"
              triggerIcon="more_vert"
              groups={[
                {
                  label: 'More actions',
                  actions: [
                    {
                      id: 'import',
                      label: 'Import records',
                      icon: 'upload',
                      onAction: () => runAction('Import records', 'Import flow started.'),
                    },
                    {
                      id: 'retry',
                      label: 'Retry sync',
                      icon: 'refresh',
                      onAction: () => runAction('Retry sync', 'Synchronization restarted.'),
                    },
                    {
                      id: 'export',
                      label: 'Export records',
                      icon: 'download',
                      onAction: () => runAction('Export records', 'Export prepared for download.'),
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-text-muted">Selection</p>
              <p className="mt-1 text-sm font-medium text-text-main">
                {selectedRecords.length} selected
              </p>
            </div>
            {selectedRecords.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2" aria-label="Bulk actions">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!selectedRecords.length || loadingAction !== null}
                  onClick={() => runAction('Export selection', 'Selected records exported.')}
                >
                  Export
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!selectedRecords.length || loadingAction !== null}
                  onClick={() => runAction('Assign owner', 'Owner assignment queued.')}
                >
                  Assign owner
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={!selectedRecords.length || loadingAction !== null}
                  onClick={() => setConfirmOpen(true)}
                >
                  Delete
                </Button>
              </div>
            ) : null}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {RECORDS.map((record) => (
              <label
                key={record}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors ${
                  selectedRecords.includes(record)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border-subtle text-text-muted hover:border-primary/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRecords.includes(record)}
                  onChange={() => toggleRecord(record)}
                  className="size-4 accent-[var(--color-primary)]"
                />
                {record}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="border border-border-subtle bg-surface-elevated/40 p-3">
            <p className="text-xs text-text-muted">Retry</p>
            <p className="mt-1 text-sm text-text-main">Recover a failed operation</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              isLoading={loadingAction === 'Retry sync'}
              disabled={loadingAction !== null && loadingAction !== 'Retry sync'}
              onClick={() => runAction('Retry sync', 'Synchronization restarted.')}
            >
              Retry
            </Button>
          </div>
          <div className="border border-border-subtle bg-surface-elevated/40 p-3">
            <p className="text-xs text-text-muted">Undo</p>
            <p className="mt-1 text-sm text-text-main">Restore a reversible action</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              isLoading={loadingAction === 'Undo'}
              disabled={loadingAction !== null && loadingAction !== 'Undo'}
              onClick={() => runAction('Undo', 'The previous action was reverted.')}
            >
              Undo
            </Button>
          </div>
          <div className="border border-border-subtle bg-surface-elevated/40 p-3">
            <p className="text-xs text-text-muted">Record menu</p>
            <p className="mt-1 text-sm text-text-main">Actions for the selected record</p>
            <IconButton
              icon="more_vert"
              size="sm"
              variant="ghost"
              className="mt-3"
              aria-label="More record actions"
              onClick={() => runAction('More actions', 'Contextual actions opened.')}
            />
          </div>
        </div>
      </TechnicalSurface>

      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[1000] w-auto md:inset-x-auto md:bottom-6 md:right-6 md:w-[420px]">
        {toast ? (
          <ToastItem
            id="operational-action-toast"
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onDismiss={() => setToast(null)}
            action={
              toast.showUndo
                ? { label: 'Undo', onClick: () => runAction('Undo', 'The deletion was reverted.') }
                : undefined
            }
          />
        ) : null}
      </div>

      <TechnicalDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete selected records"
        description="This destructive action requires confirmation before it runs."
        variant="danger"
        actions={
          <>
            <Button size="sm" variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setConfirmOpen(false);
                setSelectedRecords([]);
                runAction('Delete records', 'Selected records were removed.');
              }}
            >
              Delete records
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          {selectedRecords.length} selected record(s) will be removed from this fixture.
        </p>
      </TechnicalDialog>

      <Button size="sm" variant="outline" onClick={() => setConfirmOpen(true)}>
        Preview destructive confirmation
      </Button>
    </section>
  );
}
