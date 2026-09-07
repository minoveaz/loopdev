'use client';

import { useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Heading, ModuleHeader, type ResponsiveTableColumn } from '@loopdev/ui';
import type { CrmContact } from '@loopdev/contracts';
import { Building2, ArrowUpRight, TrendingUp, Plus } from 'lucide-react';

import {
  FiltersActions,
  type FiltersActionsFilter,
  type FiltersActionsLabels,
} from '@/components/composites/data/FiltersActions';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { ContactFormDialog } from '@/app/sales-crm/contacts/ContactFormDialog';

import {
  contactFullName,
  formatRelativeActivity,
  formatCurrencyAmount,
  type ContactSegmentFilter,
} from './types';
import { ContactAvatar } from './components/ContactAvatar';
import { ContactIdentityBadge } from './components/ContactIdentityBadge';
import { ContactDirectChannels } from './components/ContactDirectChannels';
import { ContactMobileCard } from './components/ContactMobileCard';
import { ContactMobileCapa2 } from './components/ContactMobileCapa2';
import { ContactBulkActionsBar } from './components/ContactBulkActionsBar';
import { useContactsData } from './hooks/useContactsData';
import { useContactEnrichment } from './hooks/useContactEnrichment';

const CHANNEL_OPTIONS = ['Available', 'Missing'];

export function ContactListWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);

  const queryParam = searchParams.get('q') ?? '';
  const segmentParam = (searchParams.get('segment') as ContactSegmentFilter) ?? 'all';

  const [draftQuery, setDraftQuery] = useState(queryParam);
  const [activeSegment, setActiveSegment] = useState<ContactSegmentFilter>(segmentParam);
  const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [contactsRefreshKey, setContactsRefreshKey] = useState(0);

  const canRead = hasPermission('crm.read');
  const canManage = hasPermission('crm.manage');

  // Sync draft query from URL
  useEffect(() => {
    setDraftQuery(queryParam);
  }, [queryParam]);

  // Sync segment from URL
  useEffect(() => {
    if (segmentParam) setActiveSegment(segmentParam);
  }, [segmentParam]);

  // Debounced search sync to URL
  useEffect(() => {
    if (draftQuery === queryParam) return;
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (draftQuery) params.set('q', draftQuery);
      else params.delete('q');
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [draftQuery, pathname, queryParam, router, searchParams]);

  const { contacts, setContacts, isLoading, error } = useContactsData({
    organizationId: activeOrganizationId,
    canRead,
    isLoadingPermissions,
    query: queryParam,
    refreshKey: contactsRefreshKey,
  });

  const { getMeta } = useContactEnrichment(contacts);

  // Quick segment change with URL update
  const handleSelectSegment = (segment: ContactSegmentFilter) => {
    setActiveSegment(segment);
    const params = new URLSearchParams(searchParams.toString());
    if (segment !== 'all') params.set('segment', segment);
    else params.delete('segment');
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Filter calculation including quick segments
  const filteredContacts = useMemo(() => {
    const companies = filterValues.companyName ?? [];
    const emailState = filterValues.emailState ?? [];
    const phoneState = filterValues.phoneState ?? [];

    return contacts.filter((contact) => {
      // 1. Dropdown Filters
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

      if (!matchesCompany || !matchesEmail || !matchesPhone) return false;

      // 2. Segment Filter (Capa 2)
      const meta = getMeta(contact.id);
      if (activeSegment === 'verified') return contact.identityStatus === 'verified';
      if (activeSegment === 'pending') return contact.identityStatus !== 'verified';
      if (activeSegment === 'with_deals') return meta.dealCount > 0;
      if (activeSegment === 'with_phone') return Boolean(contact.phone);

      return true;
    });
  }, [activeSegment, contacts, filterValues, getMeta]);

  // Segment counts for Capa 2
  const segmentCounts = useMemo(() => {
    return {
      all: contacts.length,
      verified: contacts.filter((c) => c.identityStatus === 'verified').length,
      pending: contacts.filter((c) => c.identityStatus !== 'verified').length,
      withDeals: contacts.filter((c) => getMeta(c.id).dealCount > 0).length,
      withPhone: contacts.filter((c) => Boolean(c.phone)).length,
    };
  }, [contacts, getMeta]);

  // Columns with Untitled UI rich design
  const columns = useMemo<ResponsiveTableColumn<CrmContact>[]>(
    () => [
      {
        key: 'name',
        header: 'Contacto',
        sortable: true,
        render: (contact) => {
          const fullName = contactFullName(contact);
          const meta = getMeta(contact.id);
          return (
            <div className="flex items-center gap-3 min-w-0 py-1">
              <ContactAvatar
                name={fullName}
                size="md"
                showStatusDot
                statusDotColor={contact.identityStatus === 'verified' ? 'emerald' : 'amber'}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/sales-crm/contacts/${contact.id}`}
                    className="font-medium text-text-main truncate text-sm hover:underline hover:text-primary"
                  >
                    {fullName}
                  </Link>
                  <ContactIdentityBadge status={contact.identityStatus} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                  <span className="truncate">{contact.email ?? 'Sin email'}</span>
                  {meta.dealCount > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[10px] font-medium bg-primary/10 text-primary">
                      {meta.dealCount} tratos
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        },
        sortAccessor: (contact) => contactFullName(contact),
      },
      {
        key: 'channels',
        header: 'Canales directos',
        render: (contact) => (
          <ContactDirectChannels email={contact.email} phone={contact.phone} variant="inline" />
        ),
      },
      {
        key: 'companyName',
        header: 'Empresa / Cuenta',
        sortable: true,
        render: (contact) => {
          if (!contact.companyName) {
            return <span className="text-xs text-text-muted italic">Particular</span>;
          }
          return (
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface text-text-muted">
                <Building2 size={13} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-main truncate">{contact.companyName}</p>
                <span className="text-[11px] text-text-muted truncate">Corporativo</span>
              </div>
            </div>
          );
        },
      },
      {
        key: 'pipeline',
        header: 'Pipeline activo',
        render: (contact) => {
          const meta = getMeta(contact.id);
          if (meta.dealCount === 0) {
            return <span className="text-xs text-text-muted">Sin tratos</span>;
          }
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-xs text-text-main">
                {formatCurrencyAmount(meta.totalPipelineValue)}
              </span>
              <span className="text-[11px] text-text-muted flex items-center gap-1">
                <TrendingUp size={11} className="text-emerald-500" />
                {meta.dealCount} en curso
              </span>
            </div>
          );
        },
      },
      {
        key: 'updatedAt',
        header: 'Última actividad',
        sortable: true,
        render: (contact) => (
          <div className="text-xs text-text-muted">
            <p className="text-text-main font-medium">
              {formatRelativeActivity(contact.updatedAt)}
            </p>
            <p className="text-[11px] text-text-muted">Actualizado</p>
          </div>
        ),
        sortAccessor: (contact) => contact.updatedAt,
      },
    ],
    [getMeta],
  );

  const filterOptions = useMemo(
    () =>
      Array.from(
        new Set(contacts.map((contact) => contact.companyName).filter(Boolean) as string[]),
      ).sort(),
    [contacts],
  );

  const filters = useMemo<FiltersActionsFilter[]>(
    () => [
      { id: 'companyName', label: 'Empresa', options: filterOptions, multiple: true },
      { id: 'emailState', label: 'Email', options: CHANNEL_OPTIONS, multiple: false },
      { id: 'phoneState', label: 'Teléfono', options: CHANNEL_OPTIONS, multiple: false },
    ],
    [filterOptions],
  );

  const filterLabels: FiltersActionsLabels = {
    title: 'Contactos y Cuentas',
    resultCount: (count) => `${count} visibles`,
    searchLabel: 'Buscar contactos por nombre, email o empresa',
    searchPlaceholder: 'Buscar contactos o cuentas...',
    clearSearch: 'Limpiar búsqueda',
    moreFilters: 'Más filtros',
    clearFilters: 'Restablecer',
    activeFilters: 'Filtros activos',
    loading: 'Cargando contactos...',
    skeleton: 'Cargando marcadores de posición...',
    empty: 'No se encontraron contactos.',
    filteredEmpty: 'Ningún contacto coincide con estos filtros.',
    error: error ?? 'No se pudieron cargar los contactos.',
    forbidden: 'No tienes permiso para ver contactos.',
  };

  const handleToggleSelectCard = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((k) => k !== id) : [...current, id],
    );
  };

  const handleBulkMarkVerified = () => {
    setContacts((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, identityStatus: 'verified' } : c)),
    );
    setSelectedIds([]);
  };

  if (isLoadingPermissions && !contacts.length) {
    return <div className="text-text-muted p-6 text-sm">Preparando espacio de Contactos...</div>;
  }

  return (
    <div className="bg-shell-canvas flex min-h-full flex-1 flex-col relative pb-36 lg:pb-6">
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
              onClick={() => setIsCreateDialogOpen(true)}
              variant="primary"
              size="sm"
              aria-label="Create contact"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
            >
              <Plus size={14} strokeWidth={2} />
              <span>Crear contacto</span>
            </Button>
          ) : null
        }
        ariaLabel="Cabecera de contactos"
      />

      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        {/* Desktop Segments Bar (Untitled UI Tabs) */}
        <div className="hidden lg:flex items-center gap-2 mb-4 border-b border-border-subtle pb-3">
          {(
            [
              { id: 'all', label: 'Todos los contactos', count: segmentCounts.all },
              { id: 'with_deals', label: 'Con Pipeline Activo', count: segmentCounts.withDeals },
              { id: 'verified', label: 'Verificados', count: segmentCounts.verified },
              { id: 'pending', label: 'Pendientes de Revisión', count: segmentCounts.pending },
              { id: 'with_phone', label: 'Con Teléfono', count: segmentCounts.withPhone },
            ] as const
          ).map((seg) => {
            const isActive = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => handleSelectSegment(seg.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-surface-active text-text-main font-semibold shadow-xs'
                    : 'text-text-muted hover:bg-surface hover:text-text-main'
                }`}
              >
                <span>{seg.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'bg-surface-subtle text-text-muted'
                  }`}
                >
                  {seg.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Enhanced Table / Mobile View */}
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
          mobileListLabel="Contacts mobile list"
          state={isLoading ? 'loading' : error ? 'error' : undefined}
          paginationVariant="compact"
          selectedRowKeys={selectedIds}
          onSelectedRowKeysChange={setSelectedIds}
          onClearFilters={() => {
            setFilterValues({});
            setActiveSegment('all');
          }}
          renderMobileRow={(contact) => (
            <ContactMobileCard
              key={contact.id}
              contact={contact}
              meta={getMeta(contact.id)}
              isSelected={selectedIds.includes(contact.id)}
              onToggleSelect={() => handleToggleSelectCard(contact.id)}
            />
          )}
          rowActions={(contact) => (
            <Link
              href={`/sales-crm/contacts/${contact.id}`}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <span>Ver 360</span>
              <ArrowUpRight size={13} strokeWidth={2} />
            </Link>
          )}
        />
      </main>

      {/* Capa 2: Floating segmented bar on mobile */}
      <ContactMobileCapa2
        activeSegment={activeSegment}
        onSelectSegment={handleSelectSegment}
        counts={segmentCounts}
      />

      {/* Floating Bulk Actions Bar */}
      <ContactBulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onExportSelected={() => {
          alert(`Exportando ${selectedIds.length} contactos...`);
        }}
        onAssignPipeline={() => {
          alert(`Asignando ${selectedIds.length} contactos a pipeline...`);
        }}
        onMarkVerified={handleBulkMarkVerified}
      />

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
