'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Badge, Button, ContextBar, Heading, ModuleHeader, TechnicalSurface } from '@loopdev/ui';
import type { Customer360CanvasView, Customer360RecordView } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';

type Customer360ViewProps = { contactId: string };

function contactName(view: Customer360RecordView) {
  return [view.contact.firstName, view.contact.lastName].filter(Boolean).join(' ') || 'Contact';
}

function date(value: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
}

export function Customer360View({ contactId }: Customer360ViewProps) {
  const { activeOrganizationId } = useOrganization();
  const [view, setView] = useState<Customer360RecordView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canvasView, setCanvasView] = useState<Customer360CanvasView>('record');

  const loadCustomer360 = async (signal?: AbortSignal) => {
    if (!activeOrganizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        organizationId: activeOrganizationId,
        view: 'record',
        sections: 'profile,leads,opportunities,tasks,notes,timeline',
      });
      const response = await fetch(
        `/api/crm/contacts/${encodeURIComponent(contactId)}/customer-360?${params.toString()}`,
        { signal },
      );
      if (!response.ok) {
        if (response.status === 403)
          throw new Error('You do not have permission to view this customer.');
        if (response.status === 404) throw new Error('This contact could not be found.');
        throw new Error('Customer 360 could not be loaded.');
      }
      setView((await response.json()) as Customer360RecordView);
    } catch (requestError: unknown) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(
        requestError instanceof Error ? requestError.message : 'Customer 360 could not be loaded.',
      );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadCustomer360(controller.signal);
    return () => controller.abort();
  }, [activeOrganizationId, contactId]);

  if (!activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparing Customer 360...</div>;
  }

  return (
    <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col">
      <ModuleHeader
        segments={[
          { id: 'contacts', label: 'Contacts', href: '/sales-crm/contacts' },
          { id: 'customer-360', label: 'Customer 360' },
        ]}
        leftSlot={
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/sales-crm/contacts"
              className="text-primary text-sm font-medium underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Contacts
            </Link>
            <span className="text-text-muted" aria-hidden="true">
              /
            </span>
            <Heading as="h1" size="lg" weight="semibold" className="truncate">
              {view ? contactName(view) : 'Customer 360'}
            </Heading>
          </div>
        }
        rightSlot={
          <div role="tablist" aria-label="Customer 360 view">
            {(['record', 'split', 'overview'] as const).map((viewId) => (
              <Button
                key={viewId}
                type="button"
                size="sm"
                variant={canvasView === viewId ? 'primary' : 'ghost'}
                role="tab"
                aria-selected={canvasView === viewId}
                onClick={() => setCanvasView(viewId)}
              >
                {viewId === 'record' ? 'Workspace' : viewId === 'split' ? 'Context preview' : 'Overview'}
              </Button>
            ))}
          </div>
        }
        ariaLabel="Customer 360 header"
      />
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        {isLoading ? (
          <div role="status" className="text-text-muted p-8 text-center text-sm">
            Loading Customer 360…
          </div>
        ) : null}
        {error ? (
          <div
            role="alert"
            className="border-status-error/40 bg-status-error/10 text-status-error flex flex-wrap items-center justify-between gap-3 rounded-md border p-4 text-sm"
          >
            <span>{error}</span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => void loadCustomer360()}
            >
              Retry
            </Button>
          </div>
        ) : null}
        {view && !isLoading ? (
          <>
          {canvasView === 'overview' ? (
            <TechnicalSurface variant="surface" radius="md" border="technical" className="mb-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Heading as="h2" size="lg" weight="semibold">Operational summary</Heading>
                  <p className="text-text-muted mt-1 text-sm">A concise, authorized view of health and next steps.</p>
                </div>
                <Badge status={view.tasks.some((task) => task.status !== 'completed' && task.dueAt && new Date(task.dueAt).getTime() < Date.now()) ? 'error' : 'success'} variant="outline" showDot>
                  {view.tasks.some((task) => task.status !== 'completed' && task.dueAt && new Date(task.dueAt).getTime() < Date.now()) ? 'Needs attention' : 'Healthy activity'}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <SummaryMetric label="Leads" value={String(view.leads.length)} />
                <SummaryMetric label="Opportunities" value={String(view.opportunities.length)} />
                <SummaryMetric label="Open tasks" value={String(view.tasks.filter((task) => task.status !== 'completed' && task.status !== 'cancelled').length)} />
                <SummaryMetric label="Notes" value={String(view.notes.length)} />
                <SummaryMetric label="Activity events" value={String(view.timeline.length)} />
                <SummaryMetric label="Last update" value={date(view.contact.updatedAt)} />
              </div>
              <ContextBar label="Next step" value={view.tasks.find((task) => task.status !== 'completed')?.title ?? 'No open task'} trailing={<Link href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`} className="text-primary text-xs underline-offset-2 hover:underline">Create task</Link>} className="mt-4" />
            </TechnicalSurface>
          ) : null}
          {canvasView === 'split' ? (
            <TechnicalSurface variant="surface" radius="md" border="subtle" className="mb-4 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-text-muted text-xs uppercase tracking-widest">Context preview</p><p className="text-text-main mt-1 font-medium">{contactName(view)} · {view.opportunities.length} opportunities · {view.tasks.length} tasks</p></div>
                <div className="flex flex-wrap gap-3"><Link href={`/sales-crm/contacts/${contactId}`} className="text-primary text-sm underline-offset-2 hover:underline">Open full contact</Link><Link href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`} className="text-primary text-sm underline-offset-2 hover:underline">Create task</Link></div>
              </div>
            </TechnicalSurface>
          ) : null}
          <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
            <div className="space-y-4">
              <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Heading as="h2" size="lg" weight="semibold">
                      {contactName(view)}
                    </Heading>
                    <p className="text-text-muted mt-1 text-sm">
                      {view.contact.companyName ?? 'No company'}
                    </p>
                  </div>
                  <Badge status="success" variant="outline" showDot={false}>
                    Authorized profile
                  </Badge>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-text-muted">Email</dt>
                    <dd className="text-text-main mt-1">{view.contact.email ?? 'No email'}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Phone</dt>
                    <dd className="text-text-main mt-1">{view.contact.phone ?? 'No phone'}</dd>
                  </div>
                </dl>
              </TechnicalSurface>
              <RelationshipSection title="Leads" count={view.leads.length}>
                {view.leads.length ? (
                  view.leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b py-3 last:border-0"
                    >
                      <span className="text-text-main text-sm">
                        {lead.interest ?? 'Lead'} · {lead.status}
                      </span>
                      <Link
                        className="text-primary text-xs underline-offset-2 hover:underline"
                        href={`/sales-crm/leads/${lead.id}`}
                      >
                        Open lead
                      </Link>
                    </div>
                  ))
                ) : (
                  <EmptyRelationship text="No related leads." />
                )}
              </RelationshipSection>
              <RelationshipSection title="Opportunities" count={view.opportunities.length}>
                {view.opportunities.length ? (
                  view.opportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b py-3 last:border-0"
                    >
                      <Link className="text-primary text-sm underline-offset-2 hover:underline" href={`/sales-crm/opportunities/${opportunity.id}`}>
                        {opportunity.name} · {opportunity.stageKey}
                      </Link>
                      <Badge
                        status={
                          opportunity.stageKey === 'won'
                            ? 'success'
                            : opportunity.stageKey === 'lost'
                              ? 'error'
                              : 'primary'
                        }
                        variant="outline"
                        showDot={false}
                      >
                        {opportunity.currency} {opportunity.amount ?? '—'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <EmptyRelationship text="No related opportunities." />
                )}
              </RelationshipSection>
              <RelationshipSection title="Tasks" count={view.tasks.length}>
                {view.tasks.length ? (
                  view.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b py-3 last:border-0"
                    >
                      <Link className="text-primary text-sm underline-offset-2 hover:underline" href={`/sales-crm/tasks/${task.id}`}>{task.title}</Link>
                      <Badge
                        status={task.status === 'completed' ? 'success' : 'neutral'}
                        variant="outline"
                        showDot={false}
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <EmptyRelationship text="No related tasks." />
                )}
              </RelationshipSection>
            </div>
            <div className="space-y-4">
              <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <Heading as="h2" size="lg" weight="semibold">
                    Timeline
                  </Heading>
                  <span className="text-text-muted text-xs">{view.timeline.length} events</span>
                </div>
                {view.timeline.length ? (
                  <ol className="mt-3 space-y-3">
                    {view.timeline.map((item) =>
                      item.kind === 'event' ? (
                        <li
                          key={item.source.sourceId}
                          className="border-border-subtle border-l-2 pl-3"
                        >
                          <p className="text-text-main text-sm">{item.event.summary}</p>
                          <p className="text-text-muted mt-1 text-xs">
                            {date(item.event.occurredAt)}
                          </p>
                        </li>
                      ) : null,
                    )}
                  </ol>
                ) : (
                  <EmptyRelationship text="No activity yet." />
                )}
              </TechnicalSurface>
              <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
                <Heading as="h2" size="lg" weight="semibold">
                  Authorized notes
                </Heading>
                {view.notes.length ? (
                  <ul className="mt-3 space-y-3">
                    {view.notes.map((note) => (
                      <li
                        key={note.id}
                        className="border-border-subtle border-b pb-3 last:border-0"
                      >
                        <p className="text-text-main whitespace-pre-wrap text-sm">
                          {note.body ?? 'Note content is restricted.'}
                        </p>
                        <p className="text-text-muted mt-1 text-xs">{date(note.createdAt)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyRelationship text="No notes available." />
                )}
              </TechnicalSurface>
            </div>
          </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return <div className="border-border-subtle bg-background-subtle rounded-md border p-3"><p className="text-text-muted text-xs">{label}</p><p className="text-text-main mt-1 text-lg font-semibold">{value}</p></div>;
}

function RelationshipSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <TechnicalSurface variant="surface" radius="md" border="subtle" className="p-4">
      <div className="flex items-center justify-between gap-3">
        <Heading as="h2" size="lg" weight="semibold">
          {title}
        </Heading>
        <span className="text-text-muted text-xs">{count}</span>
      </div>
      <div className="mt-2">{children}</div>
    </TechnicalSurface>
  );
}

function EmptyRelationship({ text }: { text: string }) {
  return <p className="text-text-muted py-3 text-sm">{text}</p>;
}
