'use client';

import { useState } from 'react';
import { Button, FormActions, TechnicalDialog } from '@loopdev/ui';
import { LeadForm } from './LeadForm';
import type { LeadCaptureCompletion, LeadCaptureResult } from './api';
import { LeadCaptureResultPanel } from './LeadCaptureResultPanel';
import { useLeadCaptureForm } from './useLeadCaptureForm';

const QUICK_CAPTURE_FORM_ID = 'quick-lead-capture-form';

type QuickLeadCaptureProps = {
  open: boolean;
  organizationId: string;
  onClose: () => void;
  onSuccess: (result: LeadCaptureResult) => void;
};

/**
 * Fast Lead capture in a `TechnicalDialog` (CRM_LEADS_UI_IMPLEMENTATION_PLAN.md
 * Fase 2). Reuses the same responsive dialog presentation as
 * `ContactFormDialog` (bottom sheet on mobile, centered on desktop) instead
 * of a parallel mobile surface.
 */
export function QuickLeadCapture({
  open,
  organizationId,
  onClose,
  onSuccess,
}: QuickLeadCaptureProps) {
  const [completion, setCompletion] = useState<LeadCaptureCompletion | null>(null);
  const { form, submit, retryInitialNote, isRetryingInitialNote } = useLeadCaptureForm({
    organizationId,
    onSuccess: (result) => {
      onSuccess(result);
      if (result.initialNote.status === 'failed') {
        setCompletion(result);
      } else {
        onClose();
        form.reset();
      }
    },
  });

  const close = () => {
    setCompletion(null);
    onClose();
    form.reset();
  };

  return (
    <TechnicalDialog
      isOpen={open}
      onClose={close}
      title="Captura rápida de Lead"
      description="Vincula un Contacto y registra el interés y el origen del Lead."
      presentation="form"
      size="lg"
      closeLabel="Cerrar captura de Lead"
      className="items-end p-0 md:items-center md:p-8"
      actions={
        completion ? null : (
          <FormActions className="w-full justify-between md:w-auto md:justify-end">
            <Button type="button" variant="ghost" onClick={close}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={QUICK_CAPTURE_FORM_ID}
              variant="primary"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Capturando…' : 'Capturar lead'}
            </Button>
          </FormActions>
        )
      }
    >
      {completion ? (
        <LeadCaptureResultPanel
          result={completion}
          isRetryingInitialNote={isRetryingInitialNote}
          onRetryInitialNote={async () => setCompletion(await retryInitialNote(completion))}
          onCreateAnother={() => {
            setCompletion(null);
            form.reset();
          }}
        />
      ) : (
        <LeadForm
          formId={QUICK_CAPTURE_FORM_ID}
          organizationId={organizationId}
          form={form}
          onSubmit={submit}
        />
      )}
    </TechnicalDialog>
  );
}
