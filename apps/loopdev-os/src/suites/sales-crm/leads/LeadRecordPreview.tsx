'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Heading, TechnicalSurface } from '@loopdev/ui';
import { getLeadById, getLeadCustomer360, LeadApiError } from './api';
import { CreateOpportunityFromLead } from './CreateOpportunityFromLead';
import { getLeadSourceLabel, getLeadStatusLabel } from './mapper';
import { QualifiedLeadGuard } from './QualifiedLeadGuard';
import type { LeadDetailViewModel, LeadRowViewModel } from './types';

type LeadRecordPreviewProps = {
  lead: LeadRowViewModel;
  organizationId?: string;
  initialDetail?: LeadDetailViewModel;
  canManage?: boolean;
  onClose: () => void;
  onOpenRecord: () => void;
  onOpenContact: () => void;
  onEdit?: () => void;
};

function contactName(detail: LeadDetailViewModel | null, lead: LeadRowViewModel) {
  const contact = detail?.contact;
  return contact
    ? [contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.id
    : lead.contactId;
}

export function LeadRecordPreview({
  lead,
  organizationId,
  initialDetail,
  canManage = false,
  onClose,
  onOpenRecord,
  onOpenContact,
  onEdit,
}: LeadRecordPreviewProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const [detail, setDetail] = useState<LeadDetailViewModel | null>(initialDetail ?? null);
  const [isConversionOpen, setIsConversionOpen] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, [lead.id]);

  useEffect(() => {
    if (initialDetail) return;
    if (!organizationId) {
      return;
    }
    const controller = new AbortController();
    getLeadById(organizationId, lead.id, controller.signal)
      .then((loadedLead) =>
        getLeadCustomer360(organizationId, loadedLead.contactId, controller.signal).then(
          (context) => ({
            lead: loadedLead,
            contact: context.contact,
            opportunities: context.opportunities.filter(
              (opportunity) => opportunity.leadId === loadedLead.id,
            ),
            activity: context.timeline,
            state: 'ready' as const,
          }),
        ),
      )
      .then((loaded) => {
        if (!controller.signal.aborted) setDetail(loaded);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setDetail((current) => ({
          lead: current?.lead ?? (lead as unknown as LeadDetailViewModel['lead']),
          contact: current?.contact ?? null,
          opportunities: current?.opportunities ?? [],
          activity: current?.activity ?? [],
          state: error instanceof LeadApiError && error.status === 403 ? 'forbidden' : 'error',
          errorMessage:
            error instanceof LeadApiError
              ? error.message
              : 'No se pudo cargar el detalle del Lead.',
        }));
      });
    return () => controller.abort();
  }, [initialDetail, lead, organizationId]);

  const matchingDetail = detail?.lead.id === lead.id ? detail : null;
  const detailForRender = matchingDetail ?? initialDetail;
  const currentLead = detailForRender?.lead;
  const currentStatus = currentLead?.status ?? lead.status;
  const currentSourceKind = currentLead?.source.kind ?? lead.sourceKind;
  const currentCampaign = currentLead?.source.campaign ?? lead.campaign;
  const currentAssignedUserId = currentLead?.assignedUserId ?? lead.assignedUserId;
  const currentProvider = currentLead?.source.provider;
  const currentExternalId = currentLead?.source.externalId;
  const currentUtm = currentLead?.source.utm ?? {};
  const contactLabel = contactName(detailForRender ?? null, lead);
  const isLoading =
    (Boolean(organizationId) && !detailForRender) || detailForRender?.state === 'loading';

  const refreshDetail = useCallback(async () => {
    if (!organizationId) return;
    setDetail((current) =>
      current
        ? { ...current, state: 'loading' }
        : {
            lead: lead as unknown as LeadDetailViewModel['lead'],
            contact: null,
            opportunities: [],
            activity: [],
            state: 'loading',
          },
    );
    try {
      const loadedLead = await getLeadById(organizationId, lead.id);
      const context = await getLeadCustomer360(organizationId, loadedLead.contactId);
      setDetail({
        lead: loadedLead,
        contact: context.contact,
        opportunities: context.opportunities.filter(
          (opportunity) => opportunity.leadId === loadedLead.id,
        ),
        activity: context.timeline,
        state: 'ready',
      });
    } catch (error: unknown) {
      setDetail((current) => ({
        lead: current?.lead ?? (lead as unknown as LeadDetailViewModel['lead']),
        contact: current?.contact ?? null,
        opportunities: current?.opportunities ?? [],
        activity: current?.activity ?? [],
        state: error instanceof LeadApiError && error.status === 403 ? 'forbidden' : 'error',
        errorMessage:
          error instanceof LeadApiError ? error.message : 'No se pudo actualizar el Lead.',
      }));
    }
  }, [lead, organizationId]);

  return (
    <div className="flex min-h-0 flex-col gap-4 p-4" data-testid="lead-record-preview">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div ref={headingRef} tabIndex={-1} className="outline-none">
            <Heading as="h2" size="base" className="truncate">
              {contactLabel}
            </Heading>
          </div>
          <p className="text-text-muted mt-1 text-xs">Previsualización del Lead</p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}>
          Cerrar
        </Button>
      </div>

      {detailForRender?.state === 'forbidden' ? (
        <p role="alert" className="text-text-muted text-sm">
          No tienes permiso para consultar el detalle de este Lead.
        </p>
      ) : detailForRender?.state === 'error' ? (
        <p role="alert" className="text-text-muted text-sm">
          {detailForRender.errorMessage}
        </p>
      ) : null}

      <TechnicalSurface variant="surface" radius="sm" border="technical" className="p-3">
        <Heading as="h3" size="sm" weight="semibold">
          Estado y atribución
        </Heading>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-text-muted">Estado</dt>
            <dd className="text-text-main font-medium">{getLeadStatusLabel(currentStatus)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-text-muted">Origen</dt>
            <dd className="text-text-main">{getLeadSourceLabel(currentSourceKind)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-text-muted">Campaña</dt>
            <dd className="text-text-main text-right">{currentCampaign ?? 'Sin campaña'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-text-muted">Proveedor</dt>
            <dd className="text-text-main text-right">{currentProvider ?? 'Sin proveedor'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-text-muted">ID externo</dt>
            <dd className="text-text-main text-right">{currentExternalId ?? 'Sin ID externo'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-text-muted">UTM</dt>
            <dd className="text-text-main max-w-[12rem] text-right">
              {Object.entries(currentUtm)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' · ') || 'Sin UTM'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-text-muted">Asignado a</dt>
            <dd className="text-text-main text-right">{currentAssignedUserId ?? 'Sin asignar'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-text-muted">Interés</dt>
            <dd className="text-text-main text-right">
              {currentLead?.interest ?? lead.interest ?? 'Sin interés'}
            </dd>
          </div>
        </dl>
      </TechnicalSurface>

      <TechnicalSurface variant="surface" radius="sm" border="technical" className="p-3">
        <Heading as="h3" size="sm" weight="semibold">
          Contacto
        </Heading>
        {detailForRender?.contact ? (
          <p className="text-text-muted mt-2 text-sm">
            {detailForRender.contact.email ??
              detailForRender.contact.phone ??
              'Sin canal de contacto'}
          </p>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="mt-3"
          aria-label="Abrir Contacto"
          onClick={onOpenContact}
        >
          Abrir Contact 360
        </Button>
      </TechnicalSurface>

      <TechnicalSurface variant="surface" radius="sm" border="technical" className="p-3">
        <Heading as="h3" size="sm" weight="semibold">
          Oportunidad
        </Heading>
        {isLoading ? (
          <p className="text-text-muted mt-2 text-sm">Cargando oportunidades…</p>
        ) : detailForRender?.opportunities.length ? (
          <ul className="text-text-main mt-2 space-y-1 text-sm">
            {detailForRender.opportunities.map((opportunity) => (
              <li key={opportunity.id}>{opportunity.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted mt-2 text-sm">Sin oportunidades relacionadas.</p>
        )}
      </TechnicalSurface>

      <TechnicalSurface variant="surface" radius="sm" border="technical" className="p-3">
        <Heading as="h3" size="sm" weight="semibold">
          Actividad
        </Heading>
        {isLoading ? (
          <p className="text-text-muted mt-2 text-sm">Cargando actividad…</p>
        ) : detailForRender?.activity.length ? (
          <ul className="text-text-muted mt-2 space-y-1 text-sm">
            {detailForRender.activity.slice(0, 5).map((item) => (
              <li key={`${item.kind}-${item.source.sourceId}`}>
                {item.kind === 'event'
                  ? item.event.summary
                  : item.kind === 'task'
                    ? item.task.title
                    : item.note.body}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted mt-2 text-sm">Sin actividad reciente.</p>
        )}
      </TechnicalSurface>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="primary" onClick={onOpenRecord}>
          Ver ficha
        </Button>
        <QualifiedLeadGuard
          lead={currentLead ?? lead}
          canManage={canManage}
          onConvert={() => setIsConversionOpen(true)}
        />
        {canManage && onEdit ? (
          <Button type="button" size="sm" variant="secondary" onClick={onEdit}>
            Editar Lead
          </Button>
        ) : null}
      </div>
      {currentLead && organizationId ? (
        <CreateOpportunityFromLead
          open={isConversionOpen}
          organizationId={organizationId}
          lead={currentLead}
          onClose={() => setIsConversionOpen(false)}
          onSuccess={() => void refreshDetail()}
        />
      ) : null}
    </div>
  );
}
