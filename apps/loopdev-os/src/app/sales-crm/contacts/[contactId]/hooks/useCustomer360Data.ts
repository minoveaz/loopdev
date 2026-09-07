'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Customer360RecordView } from '@loopdev/contracts';
import { useOrganization } from '@/hooks/useOrganization';
import { useSimulation } from '@/providers/SimulationProvider';
import {
  MOCK_OPPORTUNITIES,
  MOCK_TASKS,
  MOCK_TIMELINE,
  MOCK_NOTES,
  MOCK_LEADS,
} from '../mocks/customer360Mocks';

export function useCustomer360Data(contactId: string) {
  const { activeOrganizationId } = useOrganization();
  const [view, setView] = useState<Customer360RecordView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [lifecycleStage, setLifecycleStage] = useState('customer');

  const { isSimulationActive, toggleSimulation } = useSimulation();

  const loadCustomer360 = useCallback(
    async (signal?: AbortSignal) => {
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
          requestError instanceof Error
            ? requestError.message
            : 'Customer 360 could not be loaded.',
        );
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [activeOrganizationId, contactId],
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

  const displayedOpportunities = useMemo(() => {
    if (view?.opportunities?.length) return view.opportunities;
    if (isSimulationActive) return MOCK_OPPORTUNITIES;
    return [];
  }, [view?.opportunities, isSimulationActive]);

  const displayedTasks = useMemo(() => {
    if (view?.tasks?.length) return view.tasks;
    if (isSimulationActive) return MOCK_TASKS;
    return [];
  }, [view?.tasks, isSimulationActive]);

  const displayedTimeline = useMemo(() => {
    if (view?.timeline?.length) return view.timeline;
    if (isSimulationActive) return MOCK_TIMELINE;
    return [];
  }, [view?.timeline, isSimulationActive]);

  const displayedNotes = useMemo(() => {
    if (view?.notes?.length) return view.notes;
    if (isSimulationActive) return MOCK_NOTES;
    return [];
  }, [view?.notes, isSimulationActive]);

  const displayedLeads = useMemo(() => {
    if (view?.leads?.length) return view.leads;
    if (isSimulationActive) return MOCK_LEADS;
    return [];
  }, [view?.leads, isSimulationActive]);

  const totalPipelineValue = useMemo(() => {
    if (view?.opportunities?.length) {
      return view.opportunities.reduce((acc, opp) => acc + (opp.amount ?? 0), 0);
    }
    if (isSimulationActive) {
      return MOCK_OPPORTUNITIES.reduce((acc, opp) => acc + opp.amount, 0);
    }
    return 0;
  }, [view?.opportunities, isSimulationActive]);

  const openTasksCount = useMemo(() => {
    if (view?.tasks?.length) {
      return view.tasks.filter((t) => t.status !== 'completed').length;
    }
    if (isSimulationActive) {
      return MOCK_TASKS.filter((t) => t.status !== 'completed').length;
    }
    return 0;
  }, [view?.tasks, isSimulationActive]);

  const isOpportunitiesSimulated =
    !view?.opportunities?.length && displayedOpportunities.length > 0;
  const isTasksSimulated = !view?.tasks?.length && displayedTasks.length > 0;
  const isTimelineSimulated = !view?.timeline?.length && displayedTimeline.length > 0;
  const isNotesSimulated = !view?.notes?.length && displayedNotes.length > 0;
  const isLeadsSimulated = !view?.leads?.length && displayedLeads.length > 0;

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
    isSimulationActive,
    toggleSimulation,
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
