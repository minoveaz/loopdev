'use client';

import { Button, EmptyState, LoadingState, TechnicalCard } from '@loopdev/ui';

export function StatesCertification() {
  return (
    <TechnicalCard className="space-y-5 p-4">
      <div>
        <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">Content states</h2>
        <p className="mt-1 text-xs text-text-muted">A3 shared states for loading, empty, error, forbidden and read-only boundaries.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="space-y-3 rounded-lg border border-border-subtle bg-surface-light/40 p-4 dark:bg-surface-dark/40" aria-labelledby="states-loading">
          <h3 id="states-loading" className="text-xs font-semibold uppercase tracking-[0.12em] text-text-main">Loading</h3>
          <LoadingState label="Loading contacts" lines={3} />
        </section>
        <section className="space-y-3 rounded-lg border border-border-subtle bg-surface-light/40 p-4 dark:bg-surface-dark/40" aria-labelledby="states-empty">
          <h3 id="states-empty" className="text-xs font-semibold uppercase tracking-[0.12em] text-text-main">Empty</h3>
          <EmptyState size="sm" variant="ghost" icon="inbox" title="No contacts yet" description="Create a contact to start building this workspace." action={<Button size="sm" variant="outline">Create contact</Button>} />
        </section>
        <section className="space-y-3 rounded-lg border border-danger/30 bg-danger/5 p-4" aria-labelledby="states-error">
          <h3 id="states-error" className="text-xs font-semibold uppercase tracking-[0.12em] text-danger">Error and recovery</h3>
          <EmptyState size="sm" variant="ghost" status="error" icon="error" title="Contacts unavailable" description="The list could not be loaded." action={<Button size="sm" variant="outline">Retry</Button>} />
        </section>
        <section className="space-y-3 rounded-lg border border-border-subtle bg-surface-light/40 p-4 dark:bg-surface-dark/40" aria-labelledby="states-boundary">
          <h3 id="states-boundary" className="text-xs font-semibold uppercase tracking-[0.12em] text-text-main">Access boundaries</h3>
          <div className="space-y-3 rounded-md border border-border-subtle p-4">
            <p className="text-sm font-semibold text-text-main">Read-only workspace</p>
            <p className="text-xs leading-5 text-text-muted">You can inspect these records, but editing is disabled for this role.</p>
            <Button size="sm" variant="outline" disabled>Edit contact</Button>
          </div>
          <div className="space-y-2 rounded-md border border-border-subtle p-4">
            <p className="text-sm font-semibold text-text-main">Access restricted</p>
            <p className="text-xs leading-5 text-text-muted">Request access from a workspace administrator to continue.</p>
          </div>
        </section>
      </div>
    </TechnicalCard>
  );
}
