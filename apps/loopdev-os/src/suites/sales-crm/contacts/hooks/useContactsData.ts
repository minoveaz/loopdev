'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CrmContact, CrmContactPage } from '@loopdev/contracts';
import { getContactsDesignFixturePage } from '../contacts-design.fixture';
import { usePlatformRuntime } from '@/providers/PlatformRuntimeProvider';
import { crmContacts } from '../../runtimeAdapter';

const PAGE_SIZE = 25;

interface UseContactsDataOptions {
  organizationId: string | null | undefined;
  canRead: boolean;
  isLoadingPermissions: boolean;
  query: string;
  refreshKey: number;
}

export function useContactsData({
  organizationId,
  canRead,
  isLoadingPermissions,
  query,
  refreshKey,
}: UseContactsDataOptions) {
  const { mode } = usePlatformRuntime();
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCursor, setActiveCursor] = useState<string | undefined>();

  const [prevQuery, setPrevQuery] = useState(query);
  const [prevOrg, setPrevOrg] = useState(organizationId);

  if (query !== prevQuery || organizationId !== prevOrg) {
    setPrevQuery(query);
    setPrevOrg(organizationId);
    setActiveCursor(undefined);
    setCursorHistory([]);
  }

  const loadContacts = useCallback(
    async (signal?: AbortSignal) => {
      if (!canRead || isLoadingPermissions) return;
      const orgId = organizationId || 'default-organization';
      const params = new URLSearchParams({
        organizationId: orgId,
        limit: String(PAGE_SIZE),
      });
      if (query) params.set('query', query);
      if (activeCursor) params.set('cursor', activeCursor);

      setIsLoading(true);
      setError(null);

      if (mode !== 'real') {
        const page = await crmContacts(mode, orgId, query);
        setContacts(page.items);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setIsLoading(false);
        return;
      }
      if (!organizationId) {
        const page = getContactsDesignFixturePage({
          organizationId: orgId,
          query,
          cursor: activeCursor,
          limit: PAGE_SIZE,
        });
        setContacts(page.items);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/crm/contacts?${params.toString()}`, { signal });
        if (!response.ok) throw new Error('Contacts could not be loaded.');
        const page = (await response.json()) as CrmContactPage;
        if (page.items.length === 0) {
          const fixturePage = getContactsDesignFixturePage({
            organizationId: orgId,
            query,
            cursor: activeCursor,
            limit: PAGE_SIZE,
          });
          setContacts(fixturePage.items);
          setNextCursor(fixturePage.nextCursor);
          setHasMore(fixturePage.hasMore);
        } else {
          setContacts(page.items);
          setNextCursor(page.nextCursor);
          setHasMore(page.hasMore);
        }
      } catch (requestError: unknown) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(requestError instanceof Error ? requestError.message : 'Contacts could not be loaded.');
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [activeCursor, canRead, isLoadingPermissions, mode, organizationId, query],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadContacts(controller.signal);
    return () => controller.abort();
  }, [loadContacts, refreshKey]);

  const goNext = () => {
    if (!nextCursor) return;
    setCursorHistory((history) => [...history, activeCursor ?? '']);
    setActiveCursor(nextCursor);
  };

  const goPrevious = () => {
    const previous = cursorHistory.at(-1);
    if (previous === undefined) return;
    setCursorHistory((history) => history.slice(0, -1));
    setActiveCursor(previous || undefined);
  };

  return {
    contacts,
    setContacts,
    isLoading,
    error,
    hasMore,
    canGoPrevious: cursorHistory.length > 0,
    goNext,
    goPrevious,
  };
}
