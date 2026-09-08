'use client';

import {
  Button,
  FilterDropdown,
  Heading,
  InspectorPanel,
  PageHeader,
  Pagination,
  QueryToolbar,
  StatusBadge,
  TechnicalSurface,
} from '@loopdev/ui';
import { useMemo, useState } from 'react';

type Contact = {
  id: string;
  name: string;
  company: string;
  segment: string;
  status: 'Active' | 'Paused' | 'Prospect';
  owner: string;
};

const CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Marta Ruiz',
    company: 'Northstar Labs',
    segment: 'Enterprise',
    status: 'Active',
    owner: 'Ana',
  },
  {
    id: 'contact-2',
    name: 'Leo Martín',
    company: 'Acme Health',
    segment: 'SMB',
    status: 'Prospect',
    owner: 'Luis',
  },
  {
    id: 'contact-3',
    name: 'Nora Silva',
    company: 'Blue Harbor',
    segment: 'Enterprise',
    status: 'Paused',
    owner: 'Ana',
  },
  {
    id: 'contact-4',
    name: 'Sergio Costa',
    company: 'Orbit Systems',
    segment: 'SMB',
    status: 'Active',
    owner: 'Mina',
  },
  {
    id: 'contact-5',
    name: 'Irene Vidal',
    company: 'Cedar Works',
    segment: 'SMB',
    status: 'Active',
    owner: 'Luis',
  },
  {
    id: 'contact-6',
    name: 'Diego Soler',
    company: 'Atlas Group',
    segment: 'Enterprise',
    status: 'Prospect',
    owner: 'Mina',
  },
];

const statusTone = {
  Active: 'success',
  Paused: 'warning',
  Prospect: 'info',
} as const;

export function SuiteCompositionPatternsCertification() {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('table');
  const [page, setPage] = useState(1);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(CONTACTS[0].id);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const segments = filterValues.segment ?? [];
    const statuses = filterValues.status ?? [];
    return CONTACTS.filter(
      (contact) =>
        !normalizedQuery ||
        `${contact.name} ${contact.company}`.toLowerCase().includes(normalizedQuery),
    )
      .filter((contact) => segments.length === 0 || segments.includes(contact.segment))
      .filter((contact) => statuses.length === 0 || statuses.includes(contact.status))
      .sort((left, right) =>
        sort === 'owner'
          ? left.owner.localeCompare(right.owner)
          : left.name.localeCompare(right.name),
      );
  }, [filterValues, query, sort]);

  const selectedContact = CONTACTS.find((contact) => contact.id === selectedContactId);
  const hasActiveFilters =
    Boolean(query.trim()) || Object.values(filterValues).some((values) => values.length > 0);
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const firstVisible = filteredContacts.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastVisible = Math.min(page * pageSize, filteredContacts.length);
  const resetQuery = () => {
    setQuery('');
    setFilterValues({});
    setPage(1);
  };
  const updateFilter = (id: string, values: string[]) => {
    setFilterValues((current) => ({ ...current, [id]: values }));
    setPage(1);
  };

  return (
    <div className="space-y-6" data-testid="suite-composition-patterns">
      <PageHeader
        eyebrow="Phase B · B6-B8"
        title="Suite composition patterns"
        description="A shared operational flow from query controls to responsive records and list-detail workspace."
        actions={
          <Button size="sm" variant="outline" onClick={() => setLoading((current) => !current)}>
            {loading ? 'Stop loading' : 'Simulate loading'}
          </Button>
        }
      />

      <section className="space-y-4" aria-labelledby="phase-b-query-toolbar">
        <div>
          <h2
            id="phase-b-query-toolbar"
            className="text-text-main font-mono text-sm uppercase tracking-[0.14em]"
          >
            B6 · Query and toolbar
          </h2>
          <p className="text-text-muted mt-1 text-xs">
            Search, active filters, reset, sort, view and pagination remain controlled by the
            composition.
          </p>
        </div>
        <TechnicalSurface
          variant="surface"
          radius="md"
          border="technical"
          className="space-y-4 p-4"
        >
          <QueryToolbar
            search={{
              value: query,
              onChange: setQuery,
              placeholder: 'Search records by name, ID or owner...',
              ariaLabel: 'Search contacts',
            }}
            filters={[
              { id: 'status', label: 'Status', options: ['Active', 'Paused', 'Prospect'] },
              { id: 'segment', label: 'Segment', options: ['Enterprise', 'SMB'], multiple: true },
            ]}
            filterValues={filterValues}
            onFilterValuesChange={updateFilter}
            showClear={false}
            actions={
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-text-muted disabled:text-text-muted disabled:opacity-100"
                onClick={resetQuery}
                disabled={!hasActiveFilters}
              >
                Reset filters
              </Button>
            }
            sort={{
              value: sort,
              onChange: (value) => {
                setSort(value);
                setPage(1);
              },
              options: [
                { value: 'name', label: 'Name' },
                { value: 'owner', label: 'Owner' },
              ],
              control: (
                <FilterDropdown
                  icon="sort"
                  label={sort === 'name' ? 'Name (A-Z)' : 'Owner (A-Z)'}
                  options={['Name (A-Z)', 'Owner (A-Z)']}
                  selected={[sort === 'name' ? 'Name (A-Z)' : 'Owner (A-Z)']}
                  multiple={false}
                  showSelectionCount={false}
                  disabled={loading}
                  onToggle={(value) => {
                    setSort(value === 'Owner (A-Z)' ? 'owner' : 'name');
                    setPage(1);
                  }}
                />
              ),
            }}
            view={{
              value: view,
              onChange: setView,
              options: [
                { value: 'table', label: 'Table' },
                { value: 'compact', label: 'Compact' },
              ],
            }}
            pagination={
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                showSummary={false}
                compact
                className="min-w-0"
              />
            }
            resultCount={filteredContacts.length}
            resultCountLabel={() =>
              `Showing ${firstVisible}-${lastVisible} of ${filteredContacts.length} results`
            }
          />
        </TechnicalSurface>
      </section>

      <section className="space-y-4" aria-labelledby="phase-b-data-listings">
        <div>
          <h2
            id="phase-b-data-listings"
            className="text-text-main font-mono text-sm uppercase tracking-[0.14em]"
          >
            B7 · Data surface handoff
          </h2>
          <p className="text-text-muted mt-1 text-xs">
            The query composition hands a stable result set to the existing data-listing patterns;
            table certification remains owned by the dedicated data catalog.
          </p>
        </div>
        <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              [
                'Filtered result set',
                `${filteredContacts.length} records`,
                'Owned by B6 query state',
              ],
              ['Listing contract', 'ResponsiveTable', 'Certified in Data Tables catalog'],
              [
                'Selection handoff',
                selectedContact?.name ?? 'No record selected',
                'Consumed by B8 inspector',
              ],
            ].map(([label, value, detail]) => (
              <div key={label} className="border-border-subtle bg-surface-elevated/40 border p-3">
                <p className="text-text-muted text-xs">{label}</p>
                <p className="text-text-main mt-1 text-sm font-medium">{value}</p>
                <p className="text-text-muted mt-1 text-xs">{detail}</p>
              </div>
            ))}
          </div>
        </TechnicalSurface>
      </section>

      <section className="space-y-4" aria-labelledby="phase-b-record-workspace">
        <div>
          <h2
            id="phase-b-record-workspace"
            className="text-text-main font-mono text-sm uppercase tracking-[0.14em]"
          >
            B8 · Workspace and record detail
          </h2>
          <p className="text-text-muted mt-1 text-xs">
            List-detail selection, inspector closure, focus-safe actions and dirty state are owned
            by the composition.
          </p>
        </div>
        <TechnicalSurface
          variant="surface"
          radius="md"
          border="technical"
          className="min-h-64 overflow-hidden p-0"
        >
          <div className="grid min-h-64 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-4 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-[0.14em]">
                    Selected record
                  </p>
                  <Heading as="h3" size="lg" weight="bold" className="text-text-main mt-1">
                    {selectedContact?.name ?? 'No contact selected'}
                  </Heading>
                </div>
                {dirty ? (
                  <div className="flex items-center gap-2">
                    <span className="text-warning text-xs font-medium">Unsaved changes</span>
                    <Button size="sm" variant="outline" onClick={() => setDirty(false)}>
                      Discard
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setDirty(true)}>
                    Edit contact
                  </Button>
                )}
              </div>
              <div className="border-border-subtle border-y py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-text-muted text-xs">Contacts in current result</p>
                  <p className="text-text-muted text-xs">{filteredContacts.length} records</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {filteredContacts.map((contact) => (
                    <Button
                      key={contact.id}
                      type="button"
                      variant={contact.id === selectedContactId ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedContactId(contact.id)}
                    >
                      {contact.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border-border-subtle bg-surface-elevated/40 border p-3">
                  <p className="text-text-muted text-xs">Company</p>
                  <p className="text-text-main mt-1 text-sm">
                    {selectedContact?.company ?? 'Select a row'}
                  </p>
                </div>
                <div className="border-border-subtle bg-surface-elevated/40 border p-3">
                  <p className="text-text-muted text-xs">Owner</p>
                  <p className="text-text-main mt-1 text-sm">
                    {selectedContact?.owner ?? 'Select a row'}
                  </p>
                </div>
              </div>
            </div>
            {selectedContact ? (
              <InspectorPanel
                title="Contact detail"
                subtitle={selectedContact.id}
                onClose={() => setSelectedContactId(undefined)}
              >
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-text-muted text-xs">Record ID</p>
                    <p className="text-text-main font-mono text-xs">{selectedContact.id}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Company</p>
                    <p className="text-text-main">{selectedContact.company}</p>
                  </div>
                  <StatusBadge
                    severity={statusTone[selectedContact.status]}
                    label={selectedContact.status}
                  />
                  {dirty ? (
                    <p className="border-warning/30 bg-warning/10 text-warning border p-3">
                      Unsaved changes
                    </p>
                  ) : null}
                </div>
              </InspectorPanel>
            ) : (
              <div className="border-border-technical text-text-muted flex items-center justify-center border-l p-4 text-sm">
                Select a record to open the inspector.
              </div>
            )}
          </div>
        </TechnicalSurface>
      </section>
    </div>
  );
}
