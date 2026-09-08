'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Customer360RecordView } from '@loopdev/contracts';
import { useOrganization } from '@/hooks/useOrganization';
import { usePlatformRuntime } from '@/providers/PlatformRuntimeProvider';
import { crmCustomer360 } from '@/suites/sales-crm/runtimeAdapter';

export function useCustomer360Data(contactId: string) {
  const { activeOrganizationId } = useOrganization();
  const [view, setView] = useState<Customer360RecordView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [lifecycleStage, setLifecycleStage] = useState('customer');
  const { mode } = usePlatformRuntime();

  const loadCustomer360 = useCallback(
    async (signal?: AbortSignal) => {
      if (!activeOrganizationId) return;
      setIsLoading(true);
      setError(null);
      try {
        setView(await crmCustomer360(mode, activeOrganizationId, contactId));
      } catch (requestError: unknown) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Customer 360 could not be loaded.',
        );
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [activeOrganizationId, contactId, mode],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadCustomer360(controller.signal);
    return () => controller.abort();
  }, [loadCustomer360]);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    void navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const displayedOpportunities = useMemo(() => view?.opportunities ?? [], [view?.opportunities]);
  const displayedTasks = useMemo(() => view?.tasks ?? [], [view?.tasks]);
  const displayedTimeline = useMemo(() => view?.timeline ?? [], [view?.timeline]);
  const displayedNotes = useMemo(() => view?.notes ?? [], [view?.notes]);
  const displayedLeads = useMemo(() => view?.leads ?? [], [view?.leads]);

  const totalPipelineValue = useMemo(() => {
    if (view?.opportunities?.length) {
      return view.opportunities.reduce((acc, opp) => acc + (opp.amount ?? 0), 0);
    }
    return 0;
  }, [view?.opportunities]);

  const openTasksCount = useMemo(() => {
    if (view?.tasks?.length) {
      return view.tasks.filter((t) => t.status !== 'completed').length;
    }
    return 0;
  }, [view?.tasks]);

  const isOpportunitiesSimulated = mode !== 'real';
  const isTasksSimulated = mode !== 'real';
  const isTimelineSimulated = mode !== 'real';
  const isNotesSimulated = mode !== 'real';
  const isLeadsSimulated = mode !== 'real';

  return {
    activeOrganizationId,
    view,
    setView,
    isLoading,
    error,
    loadCustomer360,
    copiedEmail,
    copiedPhone,
    copyToClipboard,
    lifecycleStage,
    setLifecycleStage,
    isSimulationActive: mode !== 'real',
    toggleSimulation: () => undefined,
    displayedOpportunities,
    displayedTasks,
    displayedTimeline,
    displayedNotes,
    displayedLeads,
    totalPipelineValue,
    openTasksCount,
    isOpportunitiesSimulated,
    isTasksSimulated,
    isTimelineSimulated,
    isNotesSimulated,
    isLeadsSimulated,
  };
}
