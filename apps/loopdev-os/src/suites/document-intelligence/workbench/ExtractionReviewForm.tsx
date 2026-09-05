'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Badge, Button, Form, FormField, Input, LpdText, Textarea } from '@loopdev/ui';

import { WORKBENCH_FIELD_LABELS, WORKBENCH_FIELD_ORDER } from './fixtures';
import { useWorkbenchPrototype } from './workbench-context';

type ReviewFormValues = Record<string, string>;

function confidenceStatus(confidence: number | undefined): 'success' | 'primary' | 'error' {
  if (confidence === undefined) return 'primary';
  if (confidence >= 0.9) return 'success';
  if (confidence >= 0.75) return 'primary';
  return 'error';
}

/**
 * Formulario de revisión/edición manual de la extracción. Los campos son
 * nullables: un valor ausente se muestra vacío y editable, nunca como cadena
 * vacía inventada.
 */
export function ExtractionReviewForm() {
  const { result, completeReview, resetWorkbench } = useWorkbenchPrototype();

  const defaultValues = useMemo<ReviewFormValues>(() => {
    const values: ReviewFormValues = {};
    for (const field of WORKBENCH_FIELD_ORDER) {
      values[field] = result?.fields[field] ?? '';
    }
    return values;
  }, [result]);

  const form = useForm<ReviewFormValues>({ values: defaultValues });

  const invalidValidations = useMemo(
    () => (result?.validations ?? []).filter((validation) => !validation.valid),
    [result],
  );

  if (!result) return null;

  return (
    <Form
      form={form}
      onSubmit={() => completeReview('approved')}
      className="gap-5"
      aria-label="Revisión de campos extraídos"
    >
      {WORKBENCH_FIELD_ORDER.map((field) => {
        const confidence = result.fieldConfidence[field];
        const fieldError = invalidValidations.find((validation) => validation.field === field);
        const confidenceBadge =
          confidence !== undefined ? (
            <Badge status={confidenceStatus(confidence)} variant="outline" showDot={false}>
              {Math.round(confidence * 100)}%
            </Badge>
          ) : undefined;

        return (
          <FormField key={field} name={field} label={WORKBENCH_FIELD_LABELS[field]}>
            {({ field: controllerField, id, describedBy }) =>
              field === 'mrz' ? (
                <Textarea
                  {...controllerField}
                  id={id}
                  aria-describedby={describedBy}
                  placeholder="No detectado"
                  rows={3}
                  error={fieldError?.message}
                  fullWidth
                />
              ) : (
                <Input
                  {...controllerField}
                  id={id}
                  aria-describedby={describedBy}
                  placeholder="No detectado"
                  error={fieldError?.message}
                  endIcon={confidenceBadge}
                  fullWidth
                />
              )
            }
          </FormField>
        );
      })}

      <LpdText size="nano" className="text-text-muted">
        Las fechas se normalizan a DD/MM/YYYY en servidor (Fase 2). La edición local no persiste
        datos de identidad.
      </LpdText>

      <div className="border-border-subtle flex flex-wrap items-center justify-end gap-2 border-t pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={resetWorkbench}>
          Extraer nuevo
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => completeReview('rejected')}
        >
          Rechazar
        </Button>
        <Button type="submit" variant="primary" size="sm" startIcon="check_circle">
          Aprobar extracción
        </Button>
      </div>
    </Form>
  );
}
