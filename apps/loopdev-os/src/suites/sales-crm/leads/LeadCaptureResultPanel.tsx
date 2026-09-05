'use client';

import { useRouter } from 'next/navigation';
import { Button, Heading, TechnicalSurface } from '@loopdev/ui';
import type { LeadCaptureCompletion } from './api';

type LeadCaptureResultPanelProps = {
  result: LeadCaptureCompletion;
  onCreateAnother: () => void;
  onRetryInitialNote: () => void;
  isRetryingInitialNote: boolean;
};

/**
 * Success surface after a Lead capture (CRM_LEADS_UI_IMPLEMENTATION_PLAN.md
 * Fase 2 "mostrar resultado con acceso al detalle... o lista"). Links to the
 * Leads list (where the captured Lead is immediately visible and openable
 * in the `split` detail) and to the linked Contact; a dedicated Lead detail
 * route (`/sales-crm/leads/:leadId`) and Task/Note quick actions ship with
 * Fase 3, so they are intentionally not linked here yet.
 */
export function LeadCaptureResultPanel({
  result,
  onCreateAnother,
  onRetryInitialNote,
  isRetryingInitialNote,
}: LeadCaptureResultPanelProps) {
  const router = useRouter();
  const noteFailed = result.initialNote.status === 'failed';

  return (
    <TechnicalSurface
      variant="surface"
      radius="md"
      border="technical"
      className="mx-auto w-full max-w-2xl space-y-4 p-6"
    >
      <div role={noteFailed ? undefined : 'status'} aria-live={noteFailed ? undefined : 'polite'}>
        <Heading as="h2" size="lg" weight="semibold" className="text-text-main">
          {result.reused ? 'Lead ya existente reutilizado' : 'Lead capturado correctamente'}
        </Heading>
        <p className="text-text-muted mt-1 text-sm">
          {result.reused
            ? 'El origen y el ID externo ya estaban registrados; se devolvió el Lead existente en lugar de duplicarlo.'
            : 'El Lead quedó vinculado al Contacto y disponible en la lista.'}
        </p>
      </div>
      {noteFailed ? (
        <div
          className="border-status-warning/40 bg-status-warning/10 rounded-md border p-3"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-text-main text-sm font-medium">Lead creado; nota inicial pendiente</p>
          <p className="text-text-muted mt-1 text-sm">
            El Lead ya está guardado. Reintenta solo la nota para evitar una captura duplicada.
          </p>
          {result.initialNote.status === 'failed' &&
          result.initialNote.errorCode === 'IDEMPOTENCY_CONFLICT' ? (
            <p className="text-text-muted mt-1 text-sm">
              Ya existe una nota inicial distinta para este Lead; revisa el registro antes de
              cambiarla.
            </p>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="mt-3"
            onClick={onRetryInitialNote}
            disabled={isRetryingInitialNote}
          >
            {isRetryingInitialNote ? 'Guardando nota…' : 'Reintentar nota'}
          </Button>
        </div>
      ) : result.initialNote.status === 'saved' ? (
        <p className="text-text-muted text-sm" role="status">
          La nota inicial quedó guardada.
        </p>
      ) : null}
      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Contacto</dt>
          <dd className="text-text-main font-medium">
            {[result.contact.firstName, result.contact.lastName].filter(Boolean).join(' ')}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Interés</dt>
          <dd className="text-text-main font-medium">{result.lead.interest ?? 'Sin interés'}</dd>
        </div>
      </dl>
      <div className="border-border-subtle flex flex-wrap gap-2 border-t pt-4">
        <Button type="button" variant="primary" onClick={() => router.push('/sales-crm/leads')}>
          Ver en la lista
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            router.push(`/sales-crm/contacts?q=${encodeURIComponent(result.contact.id)}`)
          }
        >
          Abrir Contacto
        </Button>
        <Button type="button" variant="ghost" onClick={onCreateAnother}>
          Capturar otro Lead
        </Button>
      </div>
    </TechnicalSurface>
  );
}
