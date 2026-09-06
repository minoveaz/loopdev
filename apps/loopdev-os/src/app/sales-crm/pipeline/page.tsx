'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Heading, ModuleHeader, TechnicalSurface } from '@loopdev/ui';
import type { CrmOpportunity, PipelineStage } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';

const PAGE_SIZE = 100;

type OpportunityPage = {
  items: CrmOpportunity[];
  nextCursor: string | null;
  hasMore: boolean;
};

function stageName(stage: PipelineStage) {
  return stage.name ?? stage.label ?? stage.key;
}

function opportunityAmount(opportunity: CrmOpportunity) {
  if (opportunity.amount === null || opportunity.amount === undefined) return 'No amount';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: opportunity.currency,
    maximumFractionDigits: 0,
  }).format(opportunity.amount);
}

function formatDate(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
    : 'No close date';
}

export default function PipelinePage() {
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const canRead = hasPermission('crm.read');
  const canManage = hasPermission('crm.manage');
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [opportunities, setOpportunities] = useState<CrmOpportunity[]>([]);
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = async (signal?: AbortSignal) => {
    if (!activeOrganizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const scope = `organizationId=${encodeURIComponent(activeOrganizationId)}`;
      const [stagesResponse, opportunitiesResponse] = await Promise.all([
        fetch(`/api/crm/pipeline/stages?${scope}`, { signal }),
        fetch(`/api/crm/opportunities?${scope}&limit=${PAGE_SIZE}`, { signal }),
      ]);
      if (!stagesResponse.ok || !opportunitiesResponse.ok) {
        throw new Error('Pipeline could not be loaded.');
      }
      const nextStages = (await stagesResponse.json()) as PipelineStage[];
      const nextOpportunities = (await opportunitiesResponse.json()) as OpportunityPage;
      setStages(nextStages.filter((stage) => stage.active));
      setOpportunities(nextOpportunities.items);
    } catch (requestError: unknown) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(
        requestError instanceof Error ? requestError.message : 'Pipeline could not be loaded.',
      );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!activeOrganizationId || isLoadingPermissions || !canRead) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    void loadBoard(controller.signal);
    return () => controller.abort();
  }, [activeOrganizationId, canRead, isLoadingPermissions]);

  const visibleOpportunities = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return opportunities.filter((opportunity) => {
      const matchesStage = stageFilter === 'all' || opportunity.stageKey === stageFilter;
      const haystack = [
        opportunity.name,
        opportunity.productKey,
        opportunity.contactId,
        opportunity.assignedUserId,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase();
      return matchesStage && (!normalized || haystack.includes(normalized));
    });
  }, [opportunities, query, stageFilter]);

  const moveOpportunity = async (opportunity: CrmOpportunity, nextStageKey: string) => {
    if (!activeOrganizationId || nextStageKey === opportunity.stageKey) return;
    setPendingId(opportunity.id);
    setError(null);
    try {
      const response = await fetch(`/api/crm/opportunities/${opportunity.id}/stage`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          organizationId: activeOrganizationId,
          stageKey: nextStageKey,
          expectedVersion: opportunity.version,
          origin: 'board',
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Opportunity could not be moved.');
      }
      const updated = (await response.json()) as CrmOpportunity;
      setOpportunities((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error ? requestError.message : 'Opportunity could not be moved.',
      );
    } finally {
      setPendingId(null);
    }
  };

  if (isLoadingPermissions || !activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparing Pipeline workspace...</div>;
  }
  if (!canRead) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <p className="text-text-muted text-sm">You do not have permission to view Pipeline.</p>
      </div>
    );
  }

  return (
    <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col">
      <ModuleHeader
        segments={[{ id: 'pipeline', label: 'Pipeline', href: '/sales-crm/pipeline' }]}
        leftSlot={
          <Heading as="h1" size="lg" weight="semibold">
            Pipeline
          </Heading>
        }
        rightSlot={
          canManage ? (
            <span className="text-text-muted text-xs">Stage changes are audited</span>
          ) : null
        }
        ariaLabel="Pipeline header"
      />
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <TechnicalSurface variant="surface" radius="md" border="technical" className="mb-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 text-xs font-medium text-text-muted">
              Search opportunities
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="border-border-subtle bg-background text-text-main mt-1 min-h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Name, product or contact"
              />
            </label>
            <label className="text-xs font-medium text-text-muted">
              Stage
              <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
                className="border-border-subtle bg-background text-text-main mt-1 min-h-9 min-w-40 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="all">All stages</option>
                {stages.map((stage) => (
                  <option key={stage.key} value={stage.key}>
                    {stageName(stage)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </TechnicalSurface>
        {error ? (
          <div
            role="alert"
            className="border-status-error/40 bg-status-error/10 text-status-error mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"
          >
            <span>{error}</span>
            <Button type="button" size="sm" variant="secondary" onClick={() => void loadBoard()}>
              Retry
            </Button>
          </div>
        ) : null}
        {isLoading ? (
          <div role="status" className="text-text-muted p-8 text-center text-sm">
            Loading pipeline…
          </div>
        ) : stages.length === 0 ? (
          <TechnicalSurface
            variant="surface"
            radius="md"
            border="subtle"
            className="p-8 text-center"
          >
            <Heading as="h2" size="lg" weight="semibold">
              No active stages
            </Heading>
            <p className="text-text-muted mt-2 text-sm">
              Configure an active pipeline stage before creating opportunities.
            </p>
          </TechnicalSurface>
        ) : visibleOpportunities.length === 0 ? (
          <TechnicalSurface
            variant="surface"
            radius="md"
            border="subtle"
            className="p-8 text-center"
          >
            <Heading as="h2" size="lg" weight="semibold">
              No opportunities found
            </Heading>
            <p className="text-text-muted mt-2 text-sm">Try a different search or stage filter.</p>
          </TechnicalSurface>
        ) : (
          <div
            className="flex min-w-0 gap-4 overflow-x-auto pb-2"
            aria-label="Opportunity pipeline board"
          >
            {stages.map((stage) => {
              const stageItems = visibleOpportunities.filter((item) => item.stageKey === stage.key);
              return (
                <section
                  key={stage.id}
                  className="bg-background-subtle flex min-w-[17rem] flex-1 flex-col rounded-lg p-3 sm:min-w-[20rem]"
                  aria-labelledby={`stage-${stage.id}`}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h2 id={`stage-${stage.id}`} className="text-text-main text-sm font-semibold">
                      {stageName(stage)}
                    </h2>
                    <Badge status="neutral" variant="outline" showDot={false}>
                      {stageItems.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {stageItems.length === 0 ? (
                      <p className="text-text-muted border-border-subtle rounded-md border border-dashed p-4 text-xs">
                        No opportunities
                      </p>
                    ) : (
                      stageItems.map((opportunity) => (
                        <TechnicalSurface
                          key={opportunity.id}
                          variant="surface"
                          radius="md"
                          border="subtle"
                          className="p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-text-main min-w-0 truncate text-sm font-semibold">
                              {opportunity.name}
                            </h3>
                            <Badge
                              status={
                                opportunity.activityHealth === 'overdue'
                                  ? 'error'
                                  : opportunity.activityHealth === 'fresh'
                                    ? 'success'
                                    : 'neutral'
                              }
                              variant="ghost"
                              showDot
                              aria-label={`Activity health ${opportunity.activityHealth}`}
                            >
                              {opportunity.activityHealth}
                            </Badge>
                          </div>
                          <p className="text-text-muted mt-1 truncate text-xs">
                            {opportunity.productKey} · {opportunityAmount(opportunity)}
                          </p>
                          <p className="text-text-muted mt-1 truncate text-xs">
                            Contact {opportunity.contactId.slice(0, 8)} ·{' '}
                            {formatDate(opportunity.expectedCloseAt)}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <Link
                              href={`/sales-crm/contacts/${opportunity.contactId}`}
                              className="text-primary text-xs font-medium underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                            >
                              Open Customer 360
                            </Link>
                            {canManage && stages.length > 1 ? (
                              <label className="text-text-muted text-xs">
                                Move
                                <select
                                  aria-label={`Move ${opportunity.name}`}
                                  disabled={pendingId === opportunity.id}
                                  value={opportunity.stageKey}
                                  onChange={(event) =>
                                    void moveOpportunity(opportunity, event.target.value)
                                  }
                                  className="border-border-subtle bg-background text-text-main ml-1 min-h-8 max-w-28 rounded border px-1 text-xs"
                                >
                                  {stages.map((target) => (
                                    <option key={target.key} value={target.key}>
                                      {stageName(target)}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            ) : null}
                          </div>
                        </TechnicalSurface>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
