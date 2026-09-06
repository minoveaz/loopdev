'use client';

import { Button, Form, FormLayout, FormSection, Input, Select } from '@loopdev/ui';
import type { FormSectionDefinition } from '@loopdev/ui';
import type { UseFormReturn } from 'react-hook-form';
import type { CrmContact } from '@loopdev/contracts';
import { ContactLookupField, type ContactLookupValue } from './ContactLookupField';
import { CreateContactFromLead } from './CreateContactFromLead';
import { LeadAttributionFields } from './LeadAttributionFields';
import { LEAD_SOURCE_KINDS, type LeadCaptureFormValues } from './leadCaptureForm';
import { getLeadSourceLabel } from './mapper';

function contactLabel(contact: CrmContact) {
  return [contact.firstName, contact.lastName].filter(Boolean).join(' ');
}

export type LeadFormProps = {
  formId: string;
  organizationId: string;
  form: UseFormReturn<LeadCaptureFormValues>;
  onSubmit: (values: LeadCaptureFormValues) => void | Promise<void>;
};

/**
 * Shared field composition for QuickLeadCapture (dialog) and
 * LeadCaptureWorkspace (`/sales-crm/leads/new`), implementing
 * CRM_LEADS_UI_IMPLEMENTATION_PLAN.md Fase 2. A Lead always resolves to an
 * existing Contact (`ContactLookupField`) or a new one created through the
 * Contacts contract (`CreateContactFromLead`); it never leaves both unset.
 */
export function LeadForm({ formId, organizationId, form, onSubmit }: LeadFormProps) {
  const contactMode = form.watch('contactMode');
  const contactId = form.watch('contactId');
  const contactLookupValue: ContactLookupValue = contactId
    ? { id: contactId, label: form.getValues('contactLabel') ?? contactId }
    : null;

  const selectContactMode = (mode: LeadCaptureFormValues['contactMode']) => {
    if (mode === contactMode) return;
    form.setValue('contactMode', mode);
    form.setValue('contactId', undefined, { shouldValidate: form.formState.isSubmitted });
    form.setValue('contactLabel', undefined);
    if (mode === 'existing') {
      form.setValue('firstName', '');
      form.setValue('lastName', '');
      form.setValue('email', '');
      form.setValue('phone', '');
      form.setValue('companyName', '');
    }
  };

  const selectContact = (contact: CrmContact | null) => {
    form.setValue('contactId', contact?.id, { shouldValidate: form.formState.isSubmitted });
    form.setValue('contactLabel', contact ? contactLabel(contact) : undefined);
  };

  const leadDetailsSection: FormSectionDefinition<LeadCaptureFormValues> = {
    id: 'lead-details',
    title: 'Detalle del Lead',
    description: 'Información mínima para operar el Lead.',
    fields: [
      {
        name: 'interest',
        label: 'Interés/producto',
        required: true,
        span: 'full',
        render: ({ field, invalid, required, id, describedBy }) => (
          <Input
            {...field}
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            required={required}
          />
        ),
      },
      {
        name: 'sourceKind',
        label: 'Origen',
        required: true,
        render: ({ field, id, describedBy }) => (
          <Select {...field} id={id} aria-describedby={describedBy}>
            {LEAD_SOURCE_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {getLeadSourceLabel(kind)}
              </option>
            ))}
          </Select>
        ),
      },
      {
        name: 'assignedUserId',
        label: 'Asignado a',
        description: 'ID de usuario. Vacío = te lo asignas a ti mismo.',
        render: ({ field, invalid, id, describedBy }) => (
          <Input
            {...field}
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            placeholder="uuid del usuario"
          />
        ),
      },
    ],
  };

  return (
    <Form id={formId} form={form} onSubmit={onSubmit} className="gap-6">
      {form.formState.errors.root?.message && (
        <p
          role="alert"
          className="border-danger/30 bg-danger/10 text-danger rounded-md border p-3 text-sm"
        >
          {form.formState.errors.root.message}
        </p>
      )}
      <FormSection
        sectionId="lead-contact"
        title="Contacto"
        description="El Lead siempre queda vinculado a un Contacto autorizado."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={contactMode === 'existing' ? 'primary' : 'secondary'}
            onClick={() => selectContactMode('existing')}
          >
            Contacto existente
          </Button>
          <Button
            type="button"
            size="sm"
            variant={contactMode === 'new' ? 'primary' : 'secondary'}
            onClick={() => selectContactMode('new')}
          >
            Crear contacto nuevo
          </Button>
        </div>
        <div className="mt-4">
          {contactMode === 'existing' ? (
            <ContactLookupField
              organizationId={organizationId}
              value={contactLookupValue}
              onChange={selectContact}
              error={form.formState.errors.contactId?.message}
            />
          ) : (
            <CreateContactFromLead />
          )}
        </div>
      </FormSection>
      <FormLayout recipe="CompactCreate" sections={[leadDetailsSection]} />
      <LeadAttributionFields />
    </Form>
  );
}
