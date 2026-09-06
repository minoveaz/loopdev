'use client';

import { FormLayout, Input, Textarea } from '@loopdev/ui';
import type { FormSectionDefinition } from '@loopdev/ui';
import type { LeadCaptureFormValues } from './leadCaptureForm';

/**
 * Optional attribution fields for a Lead capture: provider, external id and
 * UTM data (CRM_LEAD_CONTRACT.md `LeadSource`, reserved for future
 * Marketing/WhatsApp integrations). `externalId` also drives the capture
 * endpoint's idempotency per organization+source+externalId, so a retry
 * with the same value reuses the existing Lead instead of duplicating it.
 * Must be rendered inside the `LeadForm`'s `<Form>`.
 */
export function LeadAttributionFields() {
  const sections: readonly FormSectionDefinition<LeadCaptureFormValues>[] = [
    {
      id: 'lead-attribution',
      title: 'Atribución (opcional)',
      description:
        'Datos de campaña para trazabilidad. El ID externo evita duplicados en reintentos del mismo proveedor.',
      fields: [
        {
          name: 'provider',
          label: 'Proveedor',
          render: ({ field, invalid, id, describedBy }) => (
            <Input {...field} id={id} aria-describedby={describedBy} aria-invalid={invalid} />
          ),
        },
        {
          name: 'externalId',
          label: 'ID externo',
          description: 'Identificador del lead en el proveedor de origen.',
          render: ({ field, invalid, id, describedBy }) => (
            <Input {...field} id={id} aria-describedby={describedBy} aria-invalid={invalid} />
          ),
        },
        {
          name: 'campaign',
          label: 'Campaña',
          render: ({ field, invalid, id, describedBy }) => (
            <Input {...field} id={id} aria-describedby={describedBy} aria-invalid={invalid} />
          ),
        },
        {
          name: 'utmMedium',
          label: 'UTM medium',
          render: ({ field, invalid, id, describedBy }) => (
            <Input {...field} id={id} aria-describedby={describedBy} aria-invalid={invalid} />
          ),
        },
        {
          name: 'utmContent',
          label: 'UTM content',
          render: ({ field, invalid, id, describedBy }) => (
            <Input {...field} id={id} aria-describedby={describedBy} aria-invalid={invalid} />
          ),
        },
        {
          name: 'utmTerm',
          label: 'UTM term',
          render: ({ field, invalid, id, describedBy }) => (
            <Input {...field} id={id} aria-describedby={describedBy} aria-invalid={invalid} />
          ),
        },
        {
          name: 'note',
          label: 'Nota inicial',
          description: 'Contexto comercial opcional para el equipo.',
          span: 'full',
          render: ({ field, invalid, id, describedBy }) => (
            <Textarea
              {...field}
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              rows={4}
            />
          ),
        },
      ],
    },
  ];

  return <FormLayout recipe="CompactCreate" sections={sections} />;
}
