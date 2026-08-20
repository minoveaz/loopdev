'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  Button,
  Form,
  FormActions,
  FormField,
  Input,
  PhoneInput,
  SubmitButton,
  TechnicalDialog,
} from '@loopdev/ui';
import type { CrmContact } from '@loopdev/contracts';

const contactFormSchema = z
  .object({
    firstName: z.string().trim().min(1, 'El nombre es obligatorio.').max(120),
    lastName: z.string().trim().max(120).optional(),
    email: z.string().trim().email('Introduce un correo válido.').optional().or(z.literal('')),
    phone: z.string().trim().max(32).optional().or(z.literal('')).refine(
      (value) => !value || isValidPhoneNumber(value),
      'Introduce un teléfono válido y completo.',
    ),
    companyName: z.string().trim().max(160).optional(),
  })
  .refine((values) => Boolean(values.email || values.phone), {
    message: 'Introduce al menos un correo o teléfono.',
    path: ['email'],
  });

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormDialogProps {
  open: boolean;
  organizationId: string;
  onClose: () => void;
  onSuccess: (contact: CrmContact) => void;
}

export function ContactFormDialog({
  open,
  organizationId,
  onClose,
  onSuccess,
}: ContactFormDialogProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
    },
  });

  const submit = async (values: ContactFormValues) => {
    const response = await fetch('/api/crm/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationId,
        firstName: values.firstName,
        lastName: values.lastName || null,
        email: values.email || null,
        phone: values.phone || null,
        companyName: values.companyName || null,
      }),
    });

    if (!response.ok) {
      if (response.status === 403) {
        form.setError('root', { message: 'No tienes permisos para crear contactos.' });
      } else if (response.status === 400) {
        form.setError('root', { message: 'Verifica los datos ingresados.' });
      } else {
        form.setError('root', { message: 'No se pudo guardar el contacto. Inténtalo de nuevo.' });
      }
      return;
    }

    onSuccess((await response.json()) as CrmContact);
    form.reset();
    onClose();
  };

  return (
    <TechnicalDialog
      isOpen={open}
      onClose={onClose}
      title="Nuevo contacto"
      description="Completa la información básica para registrar el contacto."
      presentation="form"
      size="md"
      actions={null}
    >
      <Form form={form} onSubmit={submit} className="gap-5">
        {form.formState.errors.root?.message && (
          <p role="alert" className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {form.formState.errors.root.message}
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField<ContactFormValues> name="firstName" label="Nombre" required>
            {({ field, error, id, describedBy }) => (
              <Input {...field} id={id} error={error} aria-describedby={describedBy} autoFocus />
            )}
          </FormField>
          <FormField<ContactFormValues> name="lastName" label="Apellidos">
            {({ field, error, id, describedBy }) => (
              <Input {...field} id={id} error={error} aria-describedby={describedBy} />
            )}
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField<ContactFormValues> name="email" label="Correo electrónico">
            {({ field, error, id, describedBy }) => (
              <Input
                {...field}
                id={id}
                type="email"
                error={error}
                aria-describedby={[describedBy, 'contact-channels-help'].filter(Boolean).join(' ')}
              />
            )}
          </FormField>
          <FormField<ContactFormValues> name="phone" label="Teléfono">
            {({ field, error, id }) => (
              <PhoneInput
                id={id}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={error}
                helperText="Introduce al menos un correo o teléfono."
                defaultCountry="ES"
              />
            )}
          </FormField>
          <p className="text-xs text-text-muted sm:col-span-2">
            El teléfono se guardará con código internacional.
          </p>
        </div>
        <FormField<ContactFormValues> name="companyName" label="Empresa">
          {({ field, error, id, describedBy }) => (
            <Input {...field} id={id} error={error} aria-describedby={describedBy} />
          )}
        </FormField>
        <FormActions>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <SubmitButton>Crear contacto</SubmitButton>
        </FormActions>
      </Form>
    </TechnicalDialog>
  );
}
