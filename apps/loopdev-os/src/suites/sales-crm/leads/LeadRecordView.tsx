'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Heading, Input, Select, TechnicalSurface } from '@loopdev/ui';
import type { CrmLead } from '@loopdev/contracts';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { getLeadById, getLeadCustomer360, LeadApiError, moveLeadStatus, updateLead } from './api';
import { LeadRecordPreview } from './LeadRecordPreview';
import { getLeadSourceLabel, getLeadStatusLabel } from './mapper';
import type { LeadDetailViewModel } from './types';

const EDITABLE_STATUSES: CrmLead['status'][] = [
  'nuevo',
  'contactado',
  'cualificado',
  'estancado',
  'inactivo',
];

function displayContact(detail: LeadDetailViewModel) {
  return (
    [detail.contact?.firstName, detail.contact?.lastName].filter(Boolean).join(' ') ||
    detail.lead.contactId
  );
}

export function LeadRecordView() {
  const params = useParams<{ leadId: string }>();
  const router = useRouter();
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const [detail, setDetail] = useState<LeadDetailViewModel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [interest, setInterest] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const canRead = hasPermission('crm.read');

  const load = useCallback(async () => {
    if (!activeOrganizationId || !params.leadId || isLoadingPermissions || !canRead) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setDetail((current) => (current ? { ...current, state: 'loading' } : null));
    setErrorMessage(null);
    try {
      const lead = await getLeadById(activeOrganizationId, params.leadId, controller.signal);
      const context = await getLeadCustomer360(
        activeOrganizationId,
        lead.contactId,
        controller.signal,
      );
      const next: LeadDetailViewModel = {
        lead,
        contact: context.contact,
        opportunities: context.opportunities.filter(
          (opportunity) => opportunity.leadId === lead.id,
        ),
        activity: context.timeline,
        state: 'ready',
      };
      setDetail(next);
      setInterest(lead.interest ?? '');
      setAssignedUserId(lead.assignedUserId ?? '');
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setDetail((current) => ({
        lead: current?.lead ?? ({} as LeadDetailViewModel['lead']),
        contact: current?.contact ?? null,
        opportunities: current?.opportunities ?? [],
        activity: current?.activity ?? [],
        state: error instanceof LeadApiError && error.status === 403 ? 'forbidden' : 'error',
        errorMessage: error instanceof LeadApiError ? error.message : 'No se pudo cargar el Lead.',
      }));
      setErrorMessage(error instanceof LeadApiError ? error.message : 'No se pudo cargar el Lead.');
    }
  }, [activeOrganizationId, canRead, isLoadingPermissions, params.leadId]);

  useEffect(() => {
    void load();
    return () => controllerRef.current?.abort();
  }, [load]);

  if (isLoadingPermissions || !activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparando el detalle del Lead…</div>;
  }
  if (!canRead) {
    return <div className="text-text-muted p-6 text-sm">No tienes permiso para ver Leads.</div>;
  }
  if (!detail || detail.state === 'loading') {
    return <div className="text-text-muted p-6 text-sm">Cargando detalle del Lead…</div>;
  }
  if (detail.state === 'forbidden') {
    return <div className="text-text-muted p-6 text-sm">No tienes permiso para ver este Lead.</div>;
  }
  if (detail.state === 'error' && !detail.lead.id) {
    return (
      <div className="space-y-3 p-6">
        <p role="alert" className="text-text-muted text-sm">
          {errorMessage ?? detail.errorMessage}
        </p>
        <Button type="button" size="sm" variant="secondary" onClick={() => void load()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const canManage = hasPermission('crm.manage');
  const save = async () => {
    if (!canManage) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const lead = await updateLead({
        organizationId: activeOrganizationId,
        leadId: detail.lead.id,
        interest: interest.trim() || null,
        assignedUserId: assignedUserId.trim() || null,
        expectedUpdatedAt: detail.lead.updatedAt,
      });
      setDetail((current) => (current ? { ...current, lead, state: 'ready' } : current));
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof LeadApiError && error.code === 'CONFLICT') {
        setDetail((current) => (current ? { ...current, state: 'stale' } : current));
        setErrorMessage(
          'El Lead cambió mientras lo editabas. Actualiza los datos antes de guardar.',
        );
      } else {
        setErrorMessage(
          error instanceof LeadApiError ? error.message : 'No se pudo guardar el Lead.',
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = async (status: CrmLead['status']) => {
    if (!canManage || status === detail.lead.status) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const lead = await moveLeadStatus({
        organizationId: activeOrganizationId,
        leadId: detail.lead.id,
        status,
        expectedUpdatedAt: detail.lead.updatedAt,
      });
      setDetail((current) => (current ? { ...current, lead, state: 'ready' } : current));
    } catch (error: unknown) {
      if (error instanceof LeadApiError && error.code === 'CONFLICT') {
        setDetail((current) => (current ? { ...current, state: 'stale' } : current));
        setErrorMessage('El Lead está desactualizado. Actualiza los datos para continuar.');
      } else {
        setErrorMessage(
          error instanceof LeadApiError ? error.message : 'No se pudo cambiar el estado.',
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openContact = () =>
    router.push(`/sales-crm/contacts?q=${encodeURIComponent(detail.lead.contactId)}`);

  return (
    <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col">
      <header className="border-border-technical flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 lg:px-6">
        <div className="min-w-0">
          <p className="text-text-muted text-xs">Leads / Detalle</p>
          <Heading as="h1" size="lg" className="truncate">
            {displayContact(detail)}
          </Heading>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => router.push('/sales-crm/leads')}
        >
          Volver a Leads
        </Button>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">
        {detail.state === 'stale' ? (
          <div
            role="alert"
            className="border-danger/30 bg-danger/10 text-danger mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"
          >
            <span>{errorMessage ?? 'Los datos están desactualizados.'}</span>
            <Button type="button" size="sm" variant="secondary" onClick={() => void load()}>
              Actualizar datos
            </Button>
          </div>
        ) : errorMessage ? (
          <p role="alert" className="text-danger mb-4 text-sm">
            {errorMessage}
          </p>
        ) : null}

        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
          <section className="min-w-0 space-y-4" aria-label="Lead details">
            <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Heading as="h2" size="base" weight="semibold">
                    Estado y responsable
                  </Heading>
                  <p className="text-text-muted mt-1 text-sm">
                    {getLeadSourceLabel(detail.lead.source.kind)} ·{' '}
                    {detail.lead.interest ?? 'Sin interés'}
                  </p>
                </div>
                {canManage ? (
                  <Select
                    label="Estado"
                    aria-label="Cambiar estado del Lead"
                    value={detail.lead.status}
                    disabled={
                      isSaving || detail.state === 'stale' || detail.lead.status === 'convertido'
                    }
                    onChange={(event) => void changeStatus(event.target.value as CrmLead['status'])}
                  >
                    {EDITABLE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {getLeadStatusLabel(status)}
                      </option>
                    ))}
                    {detail.lead.status === 'convertido' ? (
                      <option value="convertido">Convertido</option>
                    ) : null}
                  </Select>
                ) : (
                  <p className="text-text-main text-sm font-medium">
                    {getLeadStatusLabel(detail.lead.status)}
                  </p>
                )}
              </div>
              {canManage && !isEditing ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setIsEditing(true)}
                >
                  Editar y reasignar
                </Button>
              ) : null}
              {canManage && isEditing ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Interés/producto"
                    value={interest}
                    onChange={(event) => setInterest(event.target.value)}
                  />
                  <Input
                    label="ID de usuario asignado"
                    value={assignedUserId}
                    onChange={(event) => setAssignedUserId(event.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      disabled={isSaving || detail.state === 'stale'}
                      onClick={() => void save()}
                    >
                      {isSaving ? 'Guardando…' : 'Guardar cambios'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={isSaving}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : null}
            </TechnicalSurface>

            <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
              <Heading as="h2" size="base" weight="semibold">
                Actividad
              </Heading>
              {detail.activity.length ? (
                <ol className="mt-3 space-y-3">
                  {detail.activity.map((item) => (
                    <li
                      key={`${item.kind}-${item.source.sourceId}`}
                      className="border-border-subtle border-l-2 pl-3 text-sm"
                    >
                      <p className="text-text-main">
                        {item.kind === 'event'
                          ? item.event.summary
                          : item.kind === 'task'
                            ? item.task.title
                            : item.note.body}
                      </p>
                      <p className="text-text-muted mt-1 text-xs">
                        {item.kind === 'event'
                          ? item.event.occurredAt
                          : item.kind === 'task'
                            ? item.task.updatedAt
                            : item.note.updatedAt}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-text-muted mt-3 text-sm">Sin actividad registrada.</p>
              )}
            </TechnicalSurface>
          </section>

          <aside className="min-w-0">
            <LeadRecordPreview
              lead={{
                id: detail.lead.id,
                organizationId: detail.lead.organizationId,
                contactId: detail.lead.contactId,
                status: detail.lead.status,
                statusLabel: getLeadStatusLabel(detail.lead.status),
                sourceKind: detail.lead.source.kind,
                sourceLabel: getLeadSourceLabel(detail.lead.source.kind),
                interest: detail.lead.interest ?? null,
                assignedUserId: detail.lead.assignedUserId ?? null,
                brandId: detail.lead.brandId ?? null,
                workspaceId: detail.lead.workspaceId ?? null,
                duplicateReviewId: detail.lead.duplicateReviewId ?? null,
                campaign: detail.lead.source.campaign ?? null,
                createdAt: detail.lead.createdAt,
                updatedAt: detail.lead.updatedAt,
              }}
              initialDetail={detail}
              organizationId={activeOrganizationId}
              onClose={() => undefined}
              onOpenRecord={() => undefined}
              onOpenContact={openContact}
              canManage={canManage}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
