'use client';

import { Button, EmptyState, Heading, LoadingState, TechnicalCard } from '@loopdev/ui';

export function StatesCertification() {
  return (
    <TechnicalCard className="space-y-5 p-4">
      <div>
        <Heading
          as="h2"
          size="sm"
          weight="bold"
          className="text-text-main font-mono uppercase tracking-[0.14em]"
        >
          Content states
        </Heading>
        <p className="text-text-muted mt-1 text-xs">
          A3 shared states for loading, empty, error, forbidden and read-only boundaries.
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section
          className="border-border-subtle bg-surface-elevated/40 space-y-3 rounded-lg border p-4"
          aria-labelledby="states-loading"
        >
          <h3
            id="states-loading"
            className="text-text-main text-xs font-semibold uppercase tracking-[0.12em]"
          >
            Loading
          </h3>
          <LoadingState label="Loading contacts" lines={3} />
        </section>
        <section
          className="border-border-subtle bg-surface-elevated/40 space-y-3 rounded-lg border p-4"
          aria-labelledby="states-empty"
        >
          <h3
            id="states-empty"
            className="text-text-main text-xs font-semibold uppercase tracking-[0.12em]"
          >
            Empty
          </h3>
          <EmptyState
            size="sm"
            variant="ghost"
            icon="inbox"
            title="No contacts yet"
            description="Create a contact to start building this workspace."
            action={
              <Button size="sm" variant="outline">
                Create contact
              </Button>
            }
          />
        </section>
        <section
          className="border-danger/30 bg-danger/5 space-y-3 rounded-lg border p-4"
          aria-labelledby="states-error"
        >
          <h3
            id="states-error"
            className="text-danger text-xs font-semibold uppercase tracking-[0.12em]"
          >
            Error and recovery
          </h3>
          <EmptyState
            size="sm"
            variant="ghost"
            status="error"
            icon="error"
            title="Contacts unavailable"
            description="The list could not be loaded."
            action={
              <Button size="sm" variant="outline">
                Retry
              </Button>
            }
          />
        </section>
        <section
          className="border-border-subtle bg-surface-elevated/40 space-y-3 rounded-lg border p-4"
          aria-labelledby="states-boundary"
        >
          <h3
            id="states-boundary"
            className="text-text-main text-xs font-semibold uppercase tracking-[0.12em]"
          >
            Access boundaries
          </h3>
          <div className="border-border-subtle space-y-3 rounded-md border p-4">
            <p className="text-text-main text-sm font-semibold">Read-only workspace</p>
            <p className="text-text-muted text-xs leading-5">
              You can inspect these records, but editing is disabled for this role.
            </p>
            <Button size="sm" variant="outline" disabled>
              Edit contact
            </Button>
          </div>
          <div className="border-border-subtle space-y-2 rounded-md border p-4">
            <p className="text-text-main text-sm font-semibold">Access restricted</p>
            <p className="text-text-muted text-xs leading-5">
              Request access from a workspace administrator to continue.
            </p>
          </div>
        </section>
      </div>
    </TechnicalCard>
  );
}
