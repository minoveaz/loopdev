'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Heading,
  KanbanBoard,
  ModuleHeader,
  ResponsiveTable,
  TechnicalSurface,
  type ResponsiveTableColumn,
} from '@loopdev/ui';
import type { CrmOpportunity, PipelineStage } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';

const PAGE_SIZE = 100;
type OpportunityPage = { items: CrmOpportunity[]; nextCursor: string | null; hasMore: boolean };
export type PipelinePageProps = { mode?: 'board' | 'list' };

function stageName(stage: PipelineStage) {
  return stage.name ?? stage.label ?? stage.key;
}
function opportunityAmount(opportunity: CrmOpportunity) {
  if (opportunity.amount === null || opportunity.amount === undefined) return 'No amount';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: opportunity.currency, maximumFractionDigits: 0 }).format(opportunity.amount);
}
function formatDate(value: string | null | undefined) {
  return value ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value)) : 'No close date';
}

export default function PipelinePage({ mode = 'board' }: PipelinePageProps) {
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions(['crm.read', 'crm.manage']);
  const canRead = hasPermission('crm.read');
  const canManage = hasPermission('crm.manage');
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [opportunities, setOpportunities] = useState<CrmOpportunity[]>([]);
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
      if (!stagesResponse.ok || !opportunitiesResponse.ok) throw new Error('Pipeline could not be loaded.');
      const nextStages = (await stagesResponse.json()) as PipelineStage[];
      const nextOpportunities = (await opportunitiesResponse.json()) as OpportunityPage;
      setStages(nextStages.filter((stage) => stage.active));
      setOpportunities(nextOpportunities.items);
    } catch (requestError: unknown) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(requestError instanceof Error ? requestError.message : 'Pipeline could not be loaded.');
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
      const haystack = [opportunity.name, opportunity.productKey, opportunity.contactId, opportunity.assignedUserId].filter(Boolean).join(' ').toLocaleLowerCase();
      return matchesStage && (!normalized || haystack.includes(normalized));
    });
  }, [opportunities, query, stageFilter]);

  const moveOpportunity = async (opportunity: CrmOpportunity, nextStageKey: string) => {
    if (!activeOrganizationId || nextStageKey === opportunity.stageKey || !canManage) return;
    setPendingId(opportunity.id);
    setError(null);
    try {
      const response = await fetch(`/api/crm/opportunities/${opportunity.id}/stage`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ organizationId: activeOrganizationId, stageKey: nextStageKey, expectedVersion: opportunity.version, origin: 'board' }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Opportunity could not be moved.');
      }
      const updated = (await response.json()) as CrmOpportunity;
      setOpportunities((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Opportunity could not be moved.');
    } finally {
      setPendingId(null);
    }
  };

  const tableColumns = useMemo<ResponsiveTableColumn<CrmOpportunity>[]>(() => [
    {
      key: 'name',
      header: 'Opportunity',
      sortable: true,
      render: (opportunity) => <div className="min-w-0"><p className="text-text-main truncate font-medium">{opportunity.name}</p><p className="text-text-muted truncate text-xs">{opportunity.productKey}</p></div>,
      sortAccessor: (opportunity) => opportunity.name,
    },
    { key: 'stage', header: 'Stage', render: (opportunity) => opportunity.stageKey },
    { key: 'contact', header: 'Contact', render: (opportunity) => opportunity.contactId },
    { key: 'amount', header: 'Amount', render: (opportunity) => opportunityAmount(opportunity) },
    { key: 'origin', header: 'Origin', render: (opportunity) => opportunity.origin === 'lead_conversion' ? 'Lead conversion' : 'Manual' },
    { key: 'close', header: 'Expected close', render: (opportunity) => formatDate(opportunity.expectedCloseAt) },
  ], []);

  const selectedOpportunity = selectedId ? visibleOpportunities.find((item) => item.id === selectedId) ?? null : null;

  if (isLoadingPermissions || !activeOrganizationId) return <div className="text-text-muted p-6 text-sm">Preparing Pipeline workspace...</div>;
  if (!canRead) return <div className="flex min-h-full items-center justify-center p-6"><p className="text-text-muted text-sm">You do not have permission to view Pipeline.</p></div>;

  return (
    <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col">
      <ModuleHeader
        segments={[{ id: 'pipeline', label: 'Pipeline', href: '/sales-crm/pipeline' }]}
        leftSlot={<Heading as="h1" size="lg" weight="semibold">{mode === 'list' ? 'Opportunity list' : 'Pipeline'}</Heading>}
        rightSlot={<div className="flex flex-wrap items-center gap-3"><Link href={mode === 'list' ? '/sales-crm/pipeline' : '/sales-crm/pipeline/list'} className="text-primary text-sm underline-offset-2 hover:underline">{mode === 'list' ? 'Board view' : 'List view'}</Link>{canManage ? <Link href="/sales-crm/opportunities/new" className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium">New opportunity</Link> : null}</div>}
        ariaLabel="Pipeline header"
      />
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <TechnicalSurface variant="surface" radius="md" border="technical" className="mb-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 text-xs font-medium text-text-muted">Search opportunities<input value={query} onChange={(event) => setQuery(event.target.value)} className="border-border-subtle bg-background text-text-main mt-1 min-h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Name, product or contact" /></label>
            <label className="text-xs font-medium text-text-muted">Stage<select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="border-border-subtle bg-background text-text-main mt-1 min-h-9 min-w-40 rounded-md border px-3 text-sm"><option value="all">All stages</option>{stages.map((stage) => <option key={stage.key} value={stage.key}>{stageName(stage)}</option>)}</select></label>
          </div>
        </TechnicalSurface>
        {error ? <div role="alert" className="border-status-error/40 bg-status-error/10 text-status-error mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"><span>{error}</span><Button type="button" size="sm" variant="secondary" onClick={() => void loadBoard()}>Retry</Button></div> : null}
        {isLoading ? <div role="status" className="text-text-muted p-8 text-center text-sm">Loading pipeline…</div> : stages.length === 0 ? <TechnicalSurface variant="surface" radius="md" border="subtle" className="p-8 text-center"><Heading as="h2" size="lg" weight="semibold">No active stages</Heading><p className="text-text-muted mt-2 text-sm">Configure an active pipeline stage before creating opportunities.</p></TechnicalSurface> : visibleOpportunities.length === 0 ? <TechnicalSurface variant="surface" radius="md" border="subtle" className="p-8 text-center"><Heading as="h2" size="lg" weight="semibold">No opportunities found</Heading><p className="text-text-muted mt-2 text-sm">Try a different search or stage filter.</p></TechnicalSurface> : (
          <div className={selectedOpportunity ? 'grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]' : ''}>
            <div className="min-w-0">
              {mode === 'list' ? <ResponsiveTable caption="CRM opportunities" columns={tableColumns} rows={visibleOpportunities} getRowKey={(opportunity) => opportunity.id} loading={isLoading} loadingState="Loading opportunities" emptyState="No opportunities match these filters." paginationVariant="compact" hidePageSizeSelector rowActions={(opportunity) => <div className="flex flex-wrap gap-2"><Button type="button" size="sm" variant="secondary" onClick={() => setSelectedId(opportunity.id)}>Preview</Button><Link href={`/sales-crm/opportunities/${opportunity.id}`} className="text-primary self-center text-xs underline-offset-2 hover:underline">Open</Link></div>} renderMobileRow={(opportunity) => <div className="border-border-subtle bg-background rounded-lg border p-3"><p className="text-text-main font-medium">{opportunity.name}</p><p className="text-text-muted mt-1 text-xs">{opportunity.stageKey} · {opportunityAmount(opportunity)}</p><Button type="button" size="sm" variant="secondary" className="mt-3" onClick={() => setSelectedId(opportunity.id)}>Preview</Button></div>} /> : <KanbanBoard columns={stages.map((stage) => ({ id: stage.key, title: stageName(stage), tone: stage.terminalType === 'won' ? 'success' : stage.terminalType === 'lost' ? 'danger' : 'neutral' }))} items={visibleOpportunities} getColumnId={(opportunity) => opportunity.stageKey} getItemId={(opportunity) => opportunity.id} onCardDrop={(itemId, targetStageKey) => { const opportunity = visibleOpportunities.find((item) => item.id === itemId); if (opportunity) return moveOpportunity(opportunity, targetStageKey); }} getColumnMetrics={(columnId, items) => ({ count: items.filter((item) => item.stageKey === columnId).length })} isLoading={isLoading} emptyStateSlot={<span className="text-text-muted text-sm">No opportunities in this stage</span>} renderCard={(opportunity) => <TechnicalSurface variant="surface" radius="md" border="subtle" className="p-3"><div className="flex items-start justify-between gap-2"><button type="button" className="text-text-main min-w-0 truncate text-left text-sm font-semibold hover:underline" onClick={() => setSelectedId(opportunity.id)}>{opportunity.name}</button><Badge status={opportunity.activityHealth === 'overdue' ? 'error' : opportunity.activityHealth === 'fresh' ? 'success' : 'neutral'} variant="ghost" showDot aria-label={`Activity health ${opportunity.activityHealth}`}>{opportunity.activityHealth}</Badge></div><p className="text-text-muted mt-1 truncate text-xs">{opportunity.productKey} · {opportunityAmount(opportunity)}</p><p className="text-text-muted mt-1 truncate text-xs">Contact {opportunity.contactId.slice(0, 8)} · {formatDate(opportunity.expectedCloseAt)}</p><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><Link href={`/sales-crm/opportunities/${opportunity.id}`} className="text-primary text-xs underline-offset-2 hover:underline">Open detail</Link>              <Link href={`/sales-crm/contacts/${opportunity.contactId}`} className="text-primary text-xs underline-offset-2 hover:underline">Open Customer 360</Link>{canManage && stages.length > 1 ? <label className="text-text-muted text-xs">Move <select aria-label={`Move ${opportunity.name}`} disabled={pendingId === opportunity.id} value={opportunity.stageKey} onChange={(event) => void moveOpportunity(opportunity, event.target.value)} className="border-border-subtle bg-background text-text-main ml-1 min-h-8 max-w-28 rounded border px-1 text-xs">{stages.map((target) => <option key={target.key} value={target.key}>{stageName(target)}</option>)}</select></label> : null}</div></TechnicalSurface>} />}
            </div>
            {selectedOpportunity ? <TechnicalSurface variant="surface" radius="md" border="technical" className="h-fit p-4"><div className="flex items-start justify-between gap-2"><Heading as="h2" size="lg" weight="semibold">Preview</Heading><Button type="button" size="sm" variant="ghost" onClick={() => setSelectedId(null)}>Close</Button></div><p className="text-text-main mt-4 font-medium">{selectedOpportunity.name}</p><p className="text-text-muted mt-1 text-sm">{selectedOpportunity.productKey} · {opportunityAmount(selectedOpportunity)}</p><p className="text-text-muted mt-3 text-xs">Stage: {selectedOpportunity.stageKey}</p><Link href={`/sales-crm/opportunities/${selectedOpportunity.id}`} className="text-primary mt-4 inline-block text-sm underline-offset-2 hover:underline">Open workspace</Link></TechnicalSurface> : null}
          </div>
        )}
      </main>
    </div>
  );
}
