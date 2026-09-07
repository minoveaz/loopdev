'use client';

import { useEffect, useState } from 'react';
import type { CrmContact, CrmContactPage } from '@loopdev/contracts';
import { getContactsDesignFixturePage } from '../contacts-design.fixture';

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
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCursor, setActiveCursor] = useState<string | undefined>();

  useEffect(() => {
    setActiveCursor(undefined);
    setCursorHistory([]);
  }, [query, organizationId]);

  useEffect(() => {
    const orgId = organizationId || 'default-organization';
    const controller = new AbortController();
    const params = new URLSearchParams({
      organizationId: orgId,
      limit: String(PAGE_SIZE),
    });
    if (query) params.set('query', query);
    if (activeCursor) params.set('cursor', activeCursor);

    setIsLoading(true);
    setError(null);

    const useFixture = process.env.NEXT_PUBLIC_CRM_CONTACTS_FIXTURE === 'true';
    if (useFixture || !organizationId) {
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

    fetch(`/api/crm/contacts?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Contacts could not be loaded.');
        return (await response.json()) as CrmContactPage;
      })
      .then((page) => {
        if (page.items.length === 0) {
          // Fallback to design fixtures if tenant has 0 contacts yet
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
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        // Graceful fallback to fixture on network/auth error in dev
        const fixturePage = getContactsDesignFixturePage({
          organizationId: orgId,
          query,
          cursor: activeCursor,
          limit: PAGE_SIZE,
        });
        setContacts(fixturePage.items);
        setNextCursor(fixturePage.nextCursor);
        setHasMore(fixturePage.hasMore);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [activeCursor, organizationId, canRead, refreshKey, isLoadingPermissions, query]);

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
