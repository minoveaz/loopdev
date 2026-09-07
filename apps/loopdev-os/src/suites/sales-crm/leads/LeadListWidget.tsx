'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Heading, ModuleHeader, SuiteCanvas, TechnicalSurface } from '@loopdev/ui';
import { Plus } from 'lucide-react';
import type { CrmContact, CrmLead } from '@loopdev/contracts';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { createClient } from '@/lib/supabase/client';
import { getLeads, LeadApiError, searchLeadContacts } from './api';
import { LeadFilters } from './LeadFilters';
import { LeadTable } from './LeadTable';
import { mapLeadsToRowViewModels } from './mapper';
import { useLeadsRuntime } from './runtime';
import { usePlatformRuntime } from '@/providers/PlatformRuntimeProvider';
import type { LeadFilterKey, LeadFilterValues, LeadListState, LeadRowViewModel } from './types';

const PAGE_SIZE = 25;

export function LeadListWidget() {
  const router = useRouter();
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const { selectedLead, selectLead, clearSelectedLead } = useLeadsRuntime();
  const { mode } = usePlatformRuntime();
  const [rawLeads, setRawLeads] = useState<CrmLead[]>([]);
  const [contactsMap, setContactsMap] = useState<Map<string, CrmContact>>(new Map());
  const [brandsMap, setBrandsMap] = useState<Map<string, string>>(new Map());
  const [workspacesMap, setWorkspacesMap] = useState<Map<string, string>>(new Map());
  const [queryDraft, setQueryDraft] = useState('');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<LeadFilterValues>({});
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [state, setState] = useState<LeadListState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [reloadToken, setReloadToken] = useState(0);

  const canRead = hasPermission('crm.read');
  const canManage = hasPermission('crm.manage');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setQuery((current) => (current === queryDraft ? current : queryDraft.trim()));
      setCursor(undefined);
      setCursorHistory([]);
      clearSelectedLead();
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [clearSelectedLead, queryDraft]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCursor(undefined);
      setCursorHistory([]);
      clearSelectedLead();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [activeOrganizationId, clearSelectedLead]);

  useEffect(() => () => clearSelectedLead(), [clearSelectedLead]);

  useEffect(() => {
    if (!activeOrganizationId) {
      const resetTimeout = window.setTimeout(() => {
        setContactsMap(new Map());
        setBrandsMap(new Map());
        setWorkspacesMap(new Map());
      }, 0);
      return () => window.clearTimeout(resetTimeout);
    }

    if (mode !== 'real') {
      const resetTimeout = window.setTimeout(() => {
        setBrandsMap(new Map());
        setWorkspacesMap(new Map());
      }, 0);
      return () => window.clearTimeout(resetTimeout);
    }

    let isMounted = true;
    const supabase = createClient();

    Promise.allSettled([
      searchLeadContacts({ organizationId: activeOrganizationId, limit: 100 }, undefined, mode),
      supabase.from('brands').select('id, name').eq('organization_id', activeOrganizationId),
      supabase.from('workspaces').select('id, name').eq('organization_id', activeOrganizationId),
    ]).then(([contactsRes, brandsRes, workspacesRes]) => {
      if (!isMounted) return;

      if (contactsRes.status === 'fulfilled' && contactsRes.value?.items) {
        const cMap = new Map<string, CrmContact>();
        contactsRes.value.items.forEach((contact) => cMap.set(contact.id, contact));
        setContactsMap(cMap);
      }

      if (brandsRes.status === 'fulfilled' && brandsRes.value?.data) {
        const bMap = new Map<string, string>();
        brandsRes.value.data.forEach((b: { id: string; name: string }) => bMap.set(b.id, b.name));
        setBrandsMap(bMap);
      }

      if (workspacesRes.status === 'fulfilled' && workspacesRes.value?.data) {
        const wMap = new Map<string, string>();
        workspacesRes.value.data.forEach((w: { id: string; name: string }) =>
          wMap.set(w.id, w.name),
        );
        setWorkspacesMap(wMap);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeOrganizationId, mode]);

  useEffect(() => {
    if (!activeOrganizationId || isLoadingPermissions || !canRead) {
      const timeout = window.setTimeout(
        () => setState(!activeOrganizationId || isLoadingPermissions ? 'loading' : 'forbidden'),
        0,
      );
      return () => window.clearTimeout(timeout);
    }

    const controller = new AbortController();
    const loadingTimeout = window.setTimeout(() => {
      setState('loading');
      setErrorMessage(undefined);
    }, 0);
    const queryInput = {
      organizationId: activeOrganizationId,
      limit: PAGE_SIZE,
      ...(cursor ? { cursor } : {}),
      ...(filters.status ? { status: filters.status as CrmLead['status'] } : {}),
      ...(filters.source ? { source: filters.source as CrmLead['source']['kind'] } : {}),
      ...(filters.assignedUserId ? { assignedUserId: filters.assignedUserId } : {}),
      ...(filters.workspaceId ? { workspaceId: filters.workspaceId } : {}),
    };

    getLeads(queryInput, controller.signal, mode)
      .then((page) => {
        setRawLeads(page.items);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setState(page.items.length === 0 ? 'empty' : 'ready');
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        if (requestError instanceof LeadApiError && requestError.status === 403) {
          setState('forbidden');
          return;
        }
        setErrorMessage(
          requestError instanceof LeadApiError
            ? requestError.message
            : 'No se pudieron cargar los Leads. Inténtalo de nuevo.',
        );
        setState('error');
      });

    return () => {
      window.clearTimeout(loadingTimeout);
      controller.abort();
    };
  }, [
    activeOrganizationId,
    canRead,
    cursor,
    filters.assignedUserId,
    filters.source,
    filters.status,
    filters.workspaceId,
    isLoadingPermissions,
    reloadToken,
    mode,
  ]);

  const rows = useMemo(
    () => mapLeadsToRowViewModels(rawLeads, contactsMap, brandsMap, workspacesMap),
    [rawLeads, contactsMap, brandsMap, workspacesMap],
  );

  const visibleRows = useMemo(() => {
    const normalized = query.toLocaleLowerCase();
    if (!normalized) return rows;
    return rows.filter((lead) =>
      [
        lead.contactName,
        lead.contactCompany,
        lead.contactEmail,
        lead.brandName,
        lead.workspaceName,
        lead.contactId,
        lead.statusLabel,
        lead.sourceLabel,
        lead.interest,
        lead.assignedUserId,
        lead.brandId,
        lead.workspaceId,
        lead.campaign,
      ]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(normalized)),
    );
  }, [query, rows]);

  const tableState: LeadListState =
    state === 'ready' && visibleRows.length === 0 ? 'filtered-empty' : state;

  const updateFilter = (key: LeadFilterKey, value: string | undefined) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCursor(undefined);
    setCursorHistory([]);
    clearSelectedLead();
  };

  const selectDesktopLead = (lead: LeadRowViewModel) => selectLead(lead);
  const selectMobileLead = (lead: LeadRowViewModel) => router.push(`/sales-crm/leads/${lead.id}`);

  const goNext = () => {
    if (!nextCursor) return;
    setCursorHistory((history) => [...history, cursor ?? '']);
    setCursor(nextCursor);
    clearSelectedLead();
  };

  const goPrevious = () => {
    const previous = cursorHistory.at(-1);
    if (previous === undefined) return;
    setCursorHistory((history) => history.slice(0, -1));
    setCursor(previous || undefined);
    clearSelectedLead();
  };

  return (
    <SuiteCanvas
      mode="data"
      header={
        <ModuleHeader
          segments={[{ id: 'leads', label: 'Leads', href: '/sales-crm/leads' }]}
          leftSlot={
            <Heading as="h1" size="lg" weight="semibold">
              Leads
            </Heading>
          }
          rightSlot={
            canManage ? (
              <Link
                href="/sales-crm/leads/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
              >
                <Plus size={14} strokeWidth={2} />
                <span>Crear lead</span>
              </Link>
            ) : null
          }
          ariaLabel="Leads header"
        />
      }
    >
      <div className="w-full space-y-4">
        <TechnicalSurface variant="surface" radius="md" border="technical" className="w-full p-4">
          <LeadFilters
            query={queryDraft}
            onQueryChange={setQueryDraft}
            filters={filters}
            onFilterChange={updateFilter}
            disabled={tableState === 'loading' || tableState === 'forbidden'}
          />
        </TechnicalSurface>
        <TechnicalSurface variant="surface" radius="md" border="technical" className="w-full p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-text-muted text-xs" aria-live="polite">
              {tableState === 'loading' ? 'Cargando Leads' : `${visibleRows.length} Leads visibles`}
            </p>
            {hasMore || cursorHistory.length ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={!cursorHistory.length}
                  onClick={goPrevious}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={!nextCursor}
                  onClick={goNext}
                >
                  Siguiente
                </Button>
              </div>
            ) : null}
          </div>
          <LeadTable
            rows={visibleRows}
            state={tableState}
            selectedLeadId={selectedLead?.id}
            onSelect={selectDesktopLead}
            onMobileSelect={selectMobileLead}
            errorMessage={errorMessage}
            errorAction={
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setReloadToken((value) => value + 1)}
              >
                Reintentar
              </Button>
            }
          />
        </TechnicalSurface>
      </div>
    </SuiteCanvas>
  );
}
