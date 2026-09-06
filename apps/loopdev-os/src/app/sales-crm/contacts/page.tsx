'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, Heading, ModuleHeader, type ResponsiveTableColumn } from '@loopdev/ui';
import type { CrmContact, CrmContactPage } from '@loopdev/contracts';

import {
  FiltersActions,
  type FiltersActionsFilter,
  type FiltersActionsLabels,
} from '@/components/composites/data/FiltersActions';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { getContactsDesignFixturePage } from '@/suites/sales-crm/contacts/contacts-design.fixture';
import { ContactFormDialog } from './ContactFormDialog';

const PAGE_SIZE = 25;
const USE_CONTACTS_DESIGN_FIXTURE = process.env.NEXT_PUBLIC_CRM_CONTACTS_FIXTURE === 'true';

function contactName(contact: CrmContact) {
  return [contact.firstName, contact.lastName].filter(Boolean).join(' ');
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
}

export default function ContactsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const query = searchParams.get('q') ?? '';
  const [draftQuery, setDraftQuery] = useState(query);
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
  const [activeCursor, setActiveCursor] = useState<string | undefined>();
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [contactsRefreshKey, setContactsRefreshKey] = useState(0);

  const canRead = hasPermission('crm.read');
  const canManage = hasPermission('crm.manage');

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  useEffect(() => {
    if (draftQuery === query) return;
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (draftQuery) params.set('q', draftQuery);
      else params.delete('q');
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [draftQuery, pathname, query, router, searchParams]);

  useEffect(() => {
    setActiveCursor(undefined);
    setCursorHistory([]);
    setSelectedIds([]);
  }, [query, activeOrganizationId]);

  useEffect(() => {
    if (!activeOrganizationId || isLoadingPermissions || !canRead) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      organizationId: activeOrganizationId,
      limit: String(PAGE_SIZE),
    });
    if (query) params.set('query', query);
    if (activeCursor) params.set('cursor', activeCursor);

    setIsLoading(true);
    setError(null);

    if (USE_CONTACTS_DESIGN_FIXTURE) {
      const page = getContactsDesignFixturePage({
        organizationId: activeOrganizationId,
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
        setContacts(page.items);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(requestError instanceof Error ? requestError.message : 'Unknown error.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [
    activeCursor,
    activeOrganizationId,
    canRead,
    contactsRefreshKey,
    isLoadingPermissions,
    query,
  ]);

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

  const columns = useMemo<ResponsiveTableColumn<CrmContact>[]>(
    () => [
      {
        key: 'name',
        header: 'Contact',
        sortable: true,
        render: (contact) => (
          <div className="min-w-0">
            <p className="text-text-main truncate font-medium">{contactName(contact)}</p>
            <p className="text-text-muted truncate text-xs">{contact.email ?? 'No email'}</p>
          </div>
        ),
        sortAccessor: (contact) => contactName(contact),
      },
      {
        key: 'phone',
        header: 'Phone',
        sortable: true,
        render: (contact) => contact.phone ?? 'No phone',
      },
      {
        key: 'companyName',
        header: 'Company',
        sortable: true,
        render: (contact) => contact.companyName ?? 'No company',
      },
      {
        key: 'updatedAt',
        header: 'Updated',
        sortable: true,
        render: (contact) => formatDate(contact.updatedAt),
        sortAccessor: (contact) => contact.updatedAt,
      },
    ],
    [],
  );

  const filterOptions = useMemo(
    () =>
      Array.from(
        new Set(contacts.map((contact) => contact.companyName).filter(Boolean) as string[]),
      ).sort(),
    [contacts],
  );

  const channelOptions = ['Available', 'Missing'];

  const filteredContacts = useMemo(() => {
    const companies = filterValues.companyName ?? [];
    const emailState = filterValues.emailState ?? [];
    const phoneState = filterValues.phoneState ?? [];
    return contacts.filter((contact) => {
      const matchesCompany =
        !companies.length ||
        (contact.companyName !== null &&
          contact.companyName !== undefined &&
          companies.includes(contact.companyName));
      const matchesEmail =
        !emailState.length ||
        (emailState[0] === 'Available' ? Boolean(contact.email) : !contact.email);
      const matchesPhone =
        !phoneState.length ||
        (phoneState[0] === 'Available' ? Boolean(contact.phone) : !contact.phone);
      return matchesCompany && matchesEmail && matchesPhone;
    });
  }, [contacts, filterValues.companyName, filterValues.emailState, filterValues.phoneState]);

  const filters = useMemo<FiltersActionsFilter[]>(
    () => [
      { id: 'companyName', label: 'Company', options: filterOptions, multiple: true },
      { id: 'emailState', label: 'Email', options: channelOptions, multiple: false },
      { id: 'phoneState', label: 'Phone', options: channelOptions, multiple: false },
    ],
    [filterOptions],
  );

  const filterLabels: FiltersActionsLabels = {
    title: 'Contacts',
    resultCount: (count) => `${count} visible`,
    searchLabel: 'Search contacts by name, email or company',
    searchPlaceholder: 'Search contacts',
    clearSearch: 'Clear search',
    moreFilters: 'More filters',
    clearFilters: 'Clear filters',
    activeFilters: 'Active filters',
    loading: 'Loading contacts',
    skeleton: 'Loading contact placeholders',
    empty: 'No contacts found.',
    filteredEmpty: 'No contacts match these filters.',
    error: error ?? 'Contacts could not be loaded.',
    forbidden: 'You do not have permission to view Contacts.',
  };

  if (isLoadingPermissions || !activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparing Contacts workspace...</div>;
  }

  if (!canRead) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <p className="text-text-muted text-sm">You do not have permission to view Contacts.</p>
      </div>
    );
  }

  return (
    <div className="bg-shell-canvas flex min-h-full flex-1 flex-col">
      <ModuleHeader
        segments={[{ id: 'contacts', label: 'Contacts', href: '/sales-crm/contacts' }]}
        leftSlot={
          <div className="flex min-w-0 items-center gap-3">
            <Heading as="h1" size="lg" weight="semibold" className="text-text-main truncate">
              Contacts
            </Heading>
          </div>
        }
        rightSlot={
          canManage ? (
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create contact
            </Button>
          ) : null
        }
        ariaLabel="Contacts header"
      />
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <FiltersActions
          rows={filteredContacts}
          columns={columns}
          getRowKey={(contact) => contact.id}
          search={{ value: draftQuery, onChange: setDraftQuery }}
          filters={filters}
          filterValues={filterValues}
          onFilterValuesChange={(id, values) =>
            setFilterValues((current) => ({ ...current, [id]: values }))
          }
          labels={filterLabels}
          state={isLoading ? 'loading' : error ? 'error' : undefined}
          paginationVariant="compact"
          selectedRowKeys={selectedIds}
          onSelectedRowKeysChange={setSelectedIds}
          onClearFilters={() => setFilterValues({})}
          renderMobileRow={(contact) => (
            <article className="space-y-2 rounded-lg border border-border-subtle bg-background px-3 py-3 shadow-sm">
              <p className="text-text-main truncate font-medium">{contactName(contact)}</p>
              <p className="text-text-muted truncate text-xs">
                {contact.email ?? contact.phone ?? 'No contact channel'}
              </p>
              <p className="text-text-muted truncate text-xs">
                {contact.companyName ?? 'No company'}
              </p>
              <Link
                href={`/sales-crm/contacts/${contact.id}`}
                className="text-primary inline-flex text-xs font-medium underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                Open Customer 360
              </Link>
            </article>
          )}
          rowActions={(contact) => (
            <Link
              href={`/sales-crm/contacts/${contact.id}`}
              className="text-primary text-xs font-medium underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Open 360
            </Link>
          )}
        />
      </main>
      {canManage && activeOrganizationId && (
        <ContactFormDialog
          open={isCreateDialogOpen}
          organizationId={activeOrganizationId}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={() => setContactsRefreshKey((current) => current + 1)}
        />
      )}
    </div>
  );
}
