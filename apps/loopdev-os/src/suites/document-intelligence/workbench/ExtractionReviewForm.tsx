'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Badge,
  Button,
  Form,
  FormField,
  Input,
  LpdText,
  Select,
  Textarea,
} from '@loopdev/ui';
import type { IdentityDocumentFields } from '@loopdev/contracts';

import { useWorkbenchPrototype } from './workbench-context';
import {
  buildSurnames,
  DEFAULT_EXPORT_PROFILE_ID,
  EXPORT_PROFILES,
  formatFieldsForProfile,
  getExportProfile,
  selectFieldsForProfile,
  splitSurnames,
  type ExportProfileField,
  type ExportProfileId,
} from './export-profiles';

type ReviewFormValues = Record<ExportProfileField, string>;

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
  const [profileId, setProfileId] = useState<ExportProfileId>(DEFAULT_EXPORT_PROFILE_ID);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const defaultValues = useMemo<ReviewFormValues>(() => {
    return Object.fromEntries(
      Object.keys(result?.fields ?? {}).map((field) => [
        field,
        result?.fields[field as ExportProfileField] ?? '',
      ]),
    ) as ReviewFormValues;
  }, [result]);

  const form = useForm<ReviewFormValues>({ values: defaultValues });

  if (!result) return null;

  const profile = getExportProfile(profileId);
  const values = form.watch();

  const updateField = (field: ExportProfileField, value: string) => {
    form.setValue(field, value, { shouldDirty: true });
    if (field === 'firstSurname' || field === 'secondSurname') {
      form.setValue(
        'surnames',
        buildSurnames(
          field === 'firstSurname' ? value : values.firstSurname,
          field === 'secondSurname' ? value : values.secondSurname,
        ) ?? '',
        { shouldDirty: true },
      );
    }
    if (field === 'surnames') {
      const { firstSurname, secondSurname } = splitSurnames(value || null);
      form.setValue('firstSurname', firstSurname ?? '', { shouldDirty: true });
      form.setValue('secondSurname', secondSurname ?? '', { shouldDirty: true });
    }
  };

  const currentFields: IdentityDocumentFields = {
    documentType: result.classification.type,
    issuingCountry: values.issuingCountry || result.fields.issuingCountry || null,
    fullName: values.fullName || result.fields.fullName || null,
    givenNames: values.givenNames || result.fields.givenNames || null,
    surnames: values.surnames || result.fields.surnames || null,
    firstSurname: values.firstSurname || result.fields.firstSurname || null,
    secondSurname: values.secondSurname || result.fields.secondSurname || null,
    documentNumber: values.documentNumber || result.fields.documentNumber || null,
    birthDate: values.birthDate || result.fields.birthDate || null,
    nationality: values.nationality || result.fields.nationality || null,
    sex: values.sex || result.fields.sex || null,
    issueDate: values.issueDate || result.fields.issueDate || null,
    expiryDate: values.expiryDate || result.fields.expiryDate || null,
    birthplace: values.birthplace || result.fields.birthplace || null,
    supportNumber: values.supportNumber || result.fields.supportNumber || null,
    address: values.address || result.fields.address || null,
    mrz: values.mrz || result.fields.mrz || null,
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(formatFieldsForProfile(currentFields, profileId));
    setCopyFeedback('Campos copiados');
    window.setTimeout(() => setCopyFeedback(null), 1800);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify(selectFieldsForProfile(currentFields, profileId), null, 2),
    );
    setCopyFeedback('JSON copiado');
    window.setTimeout(() => setCopyFeedback(null), 1800);
  };

  return (
    <Form
      form={form}
      onSubmit={() => completeReview('approved')}
      className="gap-5"
      aria-label="Revisión de campos extraídos"
    >
      <div className="border-border-subtle flex flex-wrap items-end justify-between gap-4 border-b pb-4">
        <div className="min-w-0 flex-1">
          <LpdText size="sm" weight="semibold">
            Datos extraídos
          </LpdText>
          <LpdText size="nano" className="text-text-muted">
            {profile.description}
          </LpdText>
        </div>
        <div className="flex min-w-0 flex-wrap items-end justify-end gap-2">
          <Select
            label="Formato de datos"
            aria-label="Formato de datos"
            value={profileId}
            onChange={(event) => setProfileId(event.target.value as ExportProfileId)}
            size="sm"
            fullWidth={false}
          >
            {EXPORT_PROFILES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button type="button" variant="outline" size="sm" onClick={copyText}>
            Copiar campos
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={copyJson}>
            Copiar JSON
          </Button>
        </div>
        {copyFeedback ? (
          <LpdText size="nano" role="status" className="text-text-muted w-full">
            {copyFeedback}
          </LpdText>
        ) : null}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {profile.fields.map(({ field, label, span }) => {
          const confidence = result.fieldConfidence[field];
          const confidenceBadge =
            confidence !== undefined ? (
              <Badge status={confidenceStatus(confidence)} variant="outline" showDot={false}>
                {Math.round(confidence * 100)}%
              </Badge>
            ) : undefined;

          return (
            <FormField
              key={field}
              name={field}
              label={label}
              className={span === 'full' ? 'sm:col-span-2' : undefined}
            >
              {({ field: controllerField, id, describedBy }) =>
                field === 'mrz' ? (
                  <Textarea
                    {...controllerField}
                    id={id}
                    aria-describedby={describedBy}
                    placeholder="No detectado"
                    rows={3}
                    fullWidth
                    onChange={(event) => updateField(field, event.target.value)}
                  />
                ) : (
                  <Input
                    {...controllerField}
                    id={id}
                    aria-describedby={describedBy}
                    placeholder="No detectado"
                    endIcon={confidenceBadge}
                    fullWidth
                    onChange={(event) => updateField(field, event.target.value)}
                  />
                )
              }
            </FormField>
          );
        })}
      </div>

      <LpdText size="nano" className="text-text-muted">
        Los campos ausentes permanecen vacíos y editables. Cambiar el formato reorganiza la vista y
        el texto copiado sin duplicar ni perder los datos extraídos.
      </LpdText>

      <div className="border-border-subtle flex flex-wrap items-center justify-end gap-2 border-t pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={resetWorkbench}>
          Extraer nuevo
        </Button>
        <Button type="button" variant="danger" size="sm" onClick={() => completeReview('rejected')}>
          Rechazar
        </Button>
        <Button type="submit" variant="primary" size="sm" startIcon="check_circle">
          Aprobar extracción
        </Button>
      </div>
    </Form>
  );
}
