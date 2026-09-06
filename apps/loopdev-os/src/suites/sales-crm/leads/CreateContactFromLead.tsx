'use client';

import { FormLayout, Input, PhoneInput } from '@loopdev/ui';
import type { FormSectionDefinition } from '@loopdev/ui';
import type { LeadCaptureFormValues } from './leadCaptureForm';

/**
 * Inline "new Contact" fields for a Lead capture. Reuses the same field set
 * and validation as the certified Contacts creation form
 * (app/sales-crm/contacts/ContactFormDialog.tsx); Leads never introduces a
 * parallel Contact creation flow. Must be rendered inside the `LeadForm`'s
 * `<Form>` so `FormField` can reach the shared `react-hook-form` context.
 */
export function CreateContactFromLead() {
  const sections: readonly FormSectionDefinition<LeadCaptureFormValues>[] = [
    {
      id: 'lead-new-contact',
      title: 'Contacto nuevo',
      description: 'Se crea junto con el Lead usando el flujo autorizado de Contacts.',
      fields: [
        {
          name: 'firstName',
          label: 'Nombre',
          required: true,
          render: ({ field, invalid, required, id, describedBy }) => (
            <Input
              {...field}
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              autoComplete="given-name"
              required={required}
            />
          ),
        },
        {
          name: 'lastName',
          label: 'Apellidos',
          render: ({ field, invalid, id, describedBy }) => (
            <Input
              {...field}
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              autoComplete="family-name"
            />
          ),
        },
        {
          name: 'email',
          label: 'Email',
          description: 'Introduce al menos un canal de contacto (email o teléfono).',
          render: ({ field, invalid, id, describedBy }) => (
            <Input
              {...field}
              id={id}
              type="email"
              aria-describedby={describedBy}
              aria-invalid={invalid}
              autoComplete="email"
            />
          ),
        },
        {
          name: 'phone',
          label: 'Teléfono',
          render: ({ field, invalid, id, describedBy }) => (
            <PhoneInput
              ref={field.ref}
              id={id}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              defaultCountry="ES"
              countryPlaceholder="País"
              countrySelectLabel="Prefijo del país"
              countrySearchLabel="Buscar país"
              countrySearchPlaceholder="Buscar por país o prefijo"
              countryNoResultsLabel="Ningún país encontrado."
              numberInputProps={{
                'aria-describedby': describedBy,
                'aria-invalid': invalid,
              }}
            />
          ),
        },
        {
          name: 'companyName',
          label: 'Empresa',
          span: 'full',
          render: ({ field, invalid, id, describedBy }) => (
            <Input
              {...field}
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              autoComplete="organization"
            />
          ),
        },
      ],
    },
  ];

  return <FormLayout recipe="CompactCreate" sections={sections} />;
}
