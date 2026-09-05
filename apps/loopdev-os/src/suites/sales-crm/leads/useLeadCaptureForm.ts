'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useFeedback } from '@loopdev/ui';
import {
  captureLead,
  createLeadNote,
  LeadApiError,
  type LeadCaptureCompletion,
  type LeadCaptureResult,
} from './api';
import {
  DEFAULT_LEAD_CAPTURE_VALUES,
  buildCaptureLeadCommand,
  leadCaptureFormSchema,
  type LeadCaptureFormValues,
} from './leadCaptureForm';

type UseLeadCaptureFormOptions = {
  organizationId: string;
  onSuccess: (result: LeadCaptureCompletion) => void;
};

/**
 * Shared submit logic for QuickLeadCapture and LeadCaptureWorkspace so both
 * surfaces apply the same validation, permission/error mapping and safe
 * retry behavior (CRM_LEADS_UI_IMPLEMENTATION_PLAN.md Fase 2). RHF disables
 * duplicate submits via `formState.isSubmitting`; a failed submit leaves the
 * form populated so the user can retry explicitly.
 */
export function useLeadCaptureForm({ organizationId, onSuccess }: UseLeadCaptureFormOptions) {
  const feedback = useFeedback();
  const [isRetryingInitialNote, setIsRetryingInitialNote] = useState(false);
  const form = useForm<LeadCaptureFormValues>({
    resolver: zodResolver(leadCaptureFormSchema),
    defaultValues: DEFAULT_LEAD_CAPTURE_VALUES,
  });

  const submit = async (values: LeadCaptureFormValues) => {
    const command = buildCaptureLeadCommand(organizationId, values);
    let result: LeadCaptureResult;
    try {
      result = await captureLead(command);
    } catch (error) {
      const code =
        error instanceof Error && 'code' in error ? (error as { code?: string }).code : undefined;
      if (code === 'UNAUTHENTICATED' || code === 'FORBIDDEN') {
        form.setError('root', { message: 'No tienes permiso para capturar Leads.' });
      } else if (code === 'CONTACT_REQUIRED') {
        form.setError('contactId', {
          message: 'Selecciona un contacto existente o completa los datos de un contacto nuevo.',
        });
      } else if (code === 'VALIDATION_ERROR') {
        form.setError('root', { message: 'Revisa los datos introducidos e inténtalo de nuevo.' });
      } else if (code === 'CONFLICT') {
        form.setError('root', {
          message: 'El Lead ya fue actualizado por otra persona. Actualiza e inténtalo de nuevo.',
        });
      } else if (code === 'IDEMPOTENCY_CONFLICT') {
        form.setError('root', {
          message:
            'La nota ya existe con otro contenido. Revisa el formulario antes de reintentar.',
        });
      } else {
        form.setError('root', { message: 'No se pudo capturar el Lead. Inténtalo de nuevo.' });
      }
      feedback.error('No se pudo capturar el Lead. Revisa el formulario e inténtalo de nuevo.');
      return;
    }

    const noteBody = values.note?.trim();
    if (!noteBody) {
      onSuccess({ ...result, initialNote: { status: 'not-requested' } });
      feedback.success(
        result.reused
          ? 'Este Lead ya existía; se reutilizó el registro existente.'
          : 'Lead capturado correctamente.',
      );
      return;
    }

    const noteCommand = {
      organizationId,
      relationType: 'lead' as const,
      relationId: result.lead.id,
      body: noteBody,
      idempotencyKey: `lead-capture-note-${result.lead.id}`,
    };
    try {
      await createLeadNote(noteCommand);
      onSuccess({ ...result, initialNote: { status: 'saved' } });
      feedback.success(
        result.reused
          ? 'Este Lead ya existía; se reutilizó el registro existente y se guardó la nota.'
          : 'Lead capturado correctamente con su nota inicial.',
      );
    } catch (error: unknown) {
      const errorCode = error instanceof LeadApiError ? error.code : 'UNKNOWN';
      onSuccess({
        ...result,
        initialNote: { status: 'failed', command: noteCommand, errorCode },
      });
      feedback.warning('El Lead se creó, pero la nota inicial quedó pendiente.');
    }
  };

  const retryInitialNote = async (
    completion: LeadCaptureCompletion,
  ): Promise<LeadCaptureCompletion> => {
    if (completion.initialNote.status !== 'failed') return completion;

    setIsRetryingInitialNote(true);
    try {
      await createLeadNote(completion.initialNote.command);
      feedback.success('Nota inicial guardada correctamente.');
      return { ...completion, initialNote: { status: 'saved' } };
    } catch (error: unknown) {
      const errorCode = error instanceof LeadApiError ? error.code : 'UNKNOWN';
      feedback.error('No se pudo guardar la nota inicial. El Lead ya está creado.');
      return {
        ...completion,
        initialNote: { ...completion.initialNote, errorCode },
      };
    } finally {
      setIsRetryingInitialNote(false);
    }
  };

  return { form, submit, retryInitialNote, isRetryingInitialNote };
}
