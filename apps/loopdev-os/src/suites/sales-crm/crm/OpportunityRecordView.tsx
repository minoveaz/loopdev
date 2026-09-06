'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge, Button, ContextBar, Heading, ModuleHeader, TechnicalSurface } from '@loopdev/ui';
import type { CrmOpportunity, PipelineStage, TimelinePage } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';

type OpportunityRecordViewProps = { opportunityId: string };

function money(opportunity: CrmOpportunity) {
  return opportunity.amount == null
    ? 'No amount'
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: opportunity.currency,
        maximumFractionDigits: 0,
      }).format(opportunity.amount);
}

function date(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
    : 'No close date';
}

export function OpportunityRecordView({ opportunityId }: OpportunityRecordViewProps) {
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const canManage = hasPermission('crm.manage');
  const [opportunity, setOpportunity] = useState<CrmOpportunity | null>(null);
  const [timeline, setTimeline] = useState<TimelinePage['items']>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(signal?: AbortSignal) {
    if (!activeOrganizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const scope = `organizationId=${encodeURIComponent(activeOrganizationId)}`;
      const [opportunityResponse, timelineResponse, stagesResponse] = await Promise.all([
        fetch(`/api/crm/opportunities/${encodeURIComponent(opportunityId)}?${scope}`, { signal }),
        fetch(
          `/api/crm/timeline?${scope}&relationType=opportunity&relationId=${encodeURIComponent(opportunityId)}&limit=25`,
          { signal },
        ),
        fetch(`/api/crm/pipeline/stages?${scope}`, { signal }),
      ]);
      if (!opportunityResponse.ok) {
        if (opportunityResponse.status === 403)
          throw new Error('You do not have permission to view this opportunity.');
        if (opportunityResponse.status === 404)
          throw new Error('This opportunity could not be found.');
        throw new Error('Opportunity could not be loaded.');
      }
      setOpportunity((await opportunityResponse.json()) as CrmOpportunity);
      if (timelineResponse.ok) {
        const page = (await timelineResponse.json()) as TimelinePage;
        setTimeline(page.items);
      } else {
        setTimeline([]);
      }
      if (stagesResponse.ok) {
        setStages(
          ((await stagesResponse.json()) as PipelineStage[]).filter((stage) => stage.active),
        );
      }
    } catch (requestError: unknown) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(
        requestError instanceof Error ? requestError.message : 'Opportunity could not be loaded.',
      );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [activeOrganizationId, opportunityId]);

  async function move(nextStageKey: string) {
    if (
      !activeOrganizationId ||
      !opportunity ||
      !canManage ||
      nextStageKey === opportunity.stageKey
    )
      return;
    setIsPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/crm/opportunities/${opportunity.id}/stage`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          organizationId: activeOrganizationId,
          stageKey: nextStageKey,
          expectedVersion: opportunity.version,
          origin: 'record',
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Opportunity stage could not be updated.');
      }
      setOpportunity((await response.json()) as CrmOpportunity);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Opportunity stage could not be updated.',
      );
    } finally {
      setIsPending(false);
    }
  }

  if (isLoadingPermissions || !activeOrganizationId)
    return <div className="text-text-muted p-6 text-sm">Preparing opportunity workspace...</div>;
  if (!hasPermission('crm.read'))
    return (
      <div className="flex min-h-full items-center justify-center p-6 text-sm text-text-muted">
        You do not have permission to view this opportunity.
      </div>
    );

  return (
    <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col">
      <ModuleHeader
        segments={[
          { id: 'pipeline', label: 'Pipeline', href: '/sales-crm/pipeline' },
          { id: 'opportunity', label: opportunity?.name ?? 'Opportunity' },
        ]}
        leftSlot={
          <Heading as="h1" size="lg" weight="semibold" className="truncate">
            {opportunity?.name ?? 'Opportunity workspace'}
          </Heading>
        }
        rightSlot={
          <Link
            href={`/sales-crm/contacts/${opportunity?.contactId ?? ''}`}
            className="text-primary text-sm underline-offset-2 hover:underline"
          >
            Open Customer 360
          </Link>
        }
        ariaLabel="Opportunity workspace header"
      />
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        {isLoading ? (
          <div role="status" className="text-text-muted p-8 text-center text-sm">
            Loading opportunity…
          </div>
        ) : null}
        {error ? (
          <div
            role="alert"
            className="border-status-error/40 bg-status-error/10 text-status-error mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"
          >
            <span>{error}</span>
            <Button type="button" size="sm" variant="secondary" onClick={() => void load()}>
              Retry
            </Button>
          </div>
        ) : null}
        {opportunity && !isLoading ? (
          <div className="mx-auto grid min-w-0 max-w-6xl gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.65fr)]">
            <div className="space-y-4">
              <TechnicalSurface variant="surface" radius="md" border="technical" className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Heading as="h2" size="lg" weight="semibold" className="truncate">
                      {opportunity.name}
                    </Heading>
                    <p className="text-text-muted mt-1 text-sm">
                      {opportunity.productKey} ·{' '}
                      {opportunity.origin === 'lead_conversion' ? 'Lead conversion' : 'Manual'}
                    </p>
                  </div>
                  <Badge
                    status={opportunity.activityHealth === 'overdue' ? 'error' : 'success'}
                    variant="outline"
                    showDot
                  >
                    {opportunity.activityHealth}
                  </Badge>
                </div>
                <ContextBar
                  label="Stage"
                  value={opportunity.stageKey}
                  trailing={
                    canManage && stages.length > 1 ? (
                      <select
                        aria-label="Opportunity stage"
                        disabled={isPending}
                        value={opportunity.stageKey}
                        onChange={(event) => void move(event.target.value)}
                        className="border-border-subtle bg-background text-text-main min-h-8 rounded border px-2 text-xs"
                      >
                        {stages.map((stage) => (
                          <option key={stage.key} value={stage.key}>
                            {stage.name ?? stage.label ?? stage.key}
                          </option>
                        ))}
                      </select>
                    ) : null
                  }
                  className="mt-4"
                />
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="Amount" value={money(opportunity)} />
                  <Metric
                    label="Probability"
                    value={opportunity.probability == null ? '—' : `${opportunity.probability}%`}
                  />
                  <Metric
                    label="Expected close"
                    value={date(opportunity.expectedCloseAt ?? opportunity.expectedCloseDate)}
                  />
                  <Metric label="Assignee" value={opportunity.assignedUserId ?? 'Unassigned'} />
                </dl>
              </TechnicalSurface>
              <TechnicalSurface variant="surface" radius="md" border="subtle" className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Heading as="h2" size="lg" weight="semibold">
                    Related work
                  </Heading>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="text-primary text-sm underline-offset-2 hover:underline"
                      href={`/sales-crm/tasks/new?relationType=opportunity&relationId=${opportunity.id}`}
                    >
                      Create task
                    </Link>
                    <Link
                      className="text-primary text-sm underline-offset-2 hover:underline"
                      href={`/sales-crm/contacts/${opportunity.contactId}`}
                    >
                      Open contact
                    </Link>
                  </div>
                </div>
                <p className="text-text-muted mt-3 text-sm">
                  Tasks, notes and the immutable activity history remain scoped to this opportunity
                  and its contact.
                </p>
              </TechnicalSurface>
            </div>
            <TechnicalSurface variant="surface" radius="md" border="technical" className="p-5">
              <div className="flex items-center justify-between gap-3">
                <Heading as="h2" size="lg" weight="semibold">
                  Activity timeline
                </Heading>
                <span className="text-text-muted text-xs">{timeline.length} events</span>
              </div>
              {timeline.length ? (
                <ol className="mt-4 space-y-4">
                  {timeline.map((event) => (
                    <li key={event.id} className="border-border-subtle border-l-2 pl-3">
                      <p className="text-text-main text-sm">{event.summary}</p>
                      <p className="text-text-muted mt-1 text-xs">
                        {new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(event.occurredAt))}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-text-muted mt-4 text-sm">No activity recorded yet.</p>
              )}
            </TechnicalSurface>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-text-muted text-xs">{label}</dt>
      <dd className="text-text-main mt-1 break-words font-medium">{value}</dd>
    </div>
  );
}
