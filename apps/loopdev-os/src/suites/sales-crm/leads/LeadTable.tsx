'use client';

import type { ReactNode } from 'react';
import { Button, ResponsiveTable, type ResponsiveTableColumn } from '@loopdev/ui';
import type { LeadListState, LeadRowViewModel } from './types';

type LeadTableProps = {
  rows: LeadRowViewModel[];
  state: LeadListState;
  selectedLeadId?: string | null;
  onSelect: (lead: LeadRowViewModel) => void;
  onMobileSelect: (lead: LeadRowViewModel) => void;
  errorMessage?: string;
  errorAction?: ReactNode;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(value));
}

export function LeadTable({
  rows,
  state,
  selectedLeadId,
  onSelect,
  onMobileSelect,
  errorMessage = 'No se pudieron cargar los Leads.',
  errorAction,
}: LeadTableProps) {
  const columns: ResponsiveTableColumn<LeadRowViewModel>[] = [
    {
      key: 'contact',
      header: 'Contacto',
      render: (lead) => (
        <div className="min-w-0">
          <p className="text-text-main truncate font-medium">{lead.contactId}</p>
          <p className="text-text-muted truncate text-xs">Contact 360 disponible</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (lead) => (
        <span className="border-border-subtle rounded-full border px-2 py-1 text-xs font-medium">
          {lead.statusLabel}
        </span>
      ),
    },
    { key: 'source', header: 'Origen', render: (lead) => lead.sourceLabel },
    {
      key: 'interest',
      header: 'Interés/producto',
      render: (lead) => lead.interest ?? 'Sin interés',
    },
    {
      key: 'assignedUserId',
      header: 'Asignado a',
      render: (lead) => lead.assignedUserId ?? 'Sin asignar',
    },
    { key: 'updatedAt', header: 'Última actividad', render: (lead) => formatDate(lead.updatedAt) },
    { key: 'brandId', header: 'Marca', render: (lead) => lead.brandId ?? 'Sin marca' },
    {
      key: 'workspaceId',
      header: 'Workspace',
      render: (lead) => lead.workspaceId ?? 'Sin workspace',
    },
    {
      key: 'duplicateReviewId',
      header: 'Duplicado',
      render: (lead) => (lead.duplicateReviewId ? 'Revisar' : '—'),
    },
  ];

  const stateMessage =
    state === 'loading'
      ? 'Cargando Leads'
      : state === 'forbidden'
        ? 'No tienes permiso para ver Leads.'
        : state === 'error'
          ? errorMessage
          : state === 'filtered-empty'
            ? 'Ningún Lead coincide con la búsqueda o los filtros.'
            : 'No hay Leads para mostrar.';

  return (
    <ResponsiveTable
      surface={false}
      caption="Lista de Leads"
      columns={columns}
      rows={rows}
      getRowKey={(lead) => lead.id}
      loading={state === 'loading'}
      loadingState="Cargando Leads"
      forbidden={state === 'forbidden'}
      forbiddenState="No tienes permiso para ver Leads."
      errorState={
        state === 'error' ? (
          <span className="inline-flex flex-wrap items-center gap-2">
            {errorMessage} {errorAction}
          </span>
        ) : undefined
      }
      emptyState={stateMessage}
      selectedRowKey={selectedLeadId ?? undefined}
      activeRowKey={selectedLeadId ?? undefined}
      onRowClick={onSelect}
      rowActions={(lead) => (
        <Button type="button" size="sm" variant="ghost" onClick={() => onSelect(lead)}>
          Abrir
        </Button>
      )}
      renderMobileRow={(lead) => (
        <Button
          type="button"
          variant="secondary"
          className="border-border-subtle bg-surface-light dark:bg-surface-dark h-auto w-full justify-start rounded-lg border p-3 text-left shadow-sm"
          onClick={() => onMobileSelect(lead)}
          aria-label={`Abrir Lead ${lead.contactId}`}
        >
          <span className="text-text-main block truncate font-medium">{lead.contactId}</span>
          <span className="text-text-muted mt-1 block text-xs">
            {lead.statusLabel} · {lead.sourceLabel}
          </span>
          <span className="text-text-muted mt-1 block truncate text-xs">
            {lead.assignedUserId ?? 'Sin asignar'} · {formatDate(lead.updatedAt)}
          </span>
        </Button>
      )}
      paginationVariant="compact"
      hidePageSizeSelector
      className="min-w-0"
    />
  );
}
