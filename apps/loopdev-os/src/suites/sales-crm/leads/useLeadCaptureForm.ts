'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useFeedback } from '@loopdev/ui';
import { captureLead, createLeadNote, type LeadCaptureResult } from './api';
import {
  DEFAULT_LEAD_CAPTURE_VALUES,
  buildCaptureLeadCommand,
  leadCaptureFormSchema,
  type LeadCaptureFormValues,
} from './leadCaptureForm';

type UseLeadCaptureFormOptions = {
  organizationId: string;
  onSuccess: (result: LeadCaptureResult) => void;
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
  const form = useForm<LeadCaptureFormValues>({
    resolver: zodResolver(leadCaptureFormSchema),
    defaultValues: DEFAULT_LEAD_CAPTURE_VALUES,
  });

  const submit = async (values: LeadCaptureFormValues) => {
    const command = buildCaptureLeadCommand(organizationId, values);
    try {
      const result = await captureLead(command);
      if (values.note?.trim()) {
        await createLeadNote({
          organizationId,
          relationType: 'lead',
          relationId: result.lead.id,
          body: values.note.trim(),
          idempotencyKey: `lead-capture-note-${result.lead.id}`,
        });
      }
      onSuccess(result);
      feedback.success(
        result.reused
          ? 'Este Lead ya existía; se reutilizó el registro existente.'
          : 'Lead capturado correctamente.',
      );
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
    }
  };

  return { form, submit };
}
