'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  Button,
  Form,
  FormActions,
  FormLayout,
  ICON_REGISTRY,
  Input,
  PhoneInput,
  TechnicalDialog,
  useFeedback,
} from '@loopdev/ui';
import type { FormSectionDefinition } from '@loopdev/ui';
import type { CrmContact } from '@loopdev/contracts';

const contactFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required.')
      .max(120, 'First name must be 120 characters or fewer.'),
    lastName: z
      .string()
      .trim()
      .max(120, 'Last name must be 120 characters or fewer.')
      .optional(),
    email: z
      .string()
      .trim()
      .email('Enter a valid email address.')
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .trim()
      .max(32, 'Phone number must be 32 characters or fewer.')
      .optional()
      .or(z.literal(''))
      .refine(
        (value) => !value || isValidPhoneNumber(value),
        'Enter a complete, valid phone number.',
      ),
    companyName: z
      .string()
      .trim()
      .max(160, 'Company name must be 160 characters or fewer.')
      .optional(),
  })
  .refine((values) => Boolean(values.email || values.phone), {
    message: 'Enter at least one email address or phone number.',
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
  const feedback = useFeedback();
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
        form.setError('root', { message: 'You do not have permission to create contacts.' });
      } else if (response.status === 400) {
        form.setError('root', { message: 'Review the entered information and try again.' });
      } else {
        form.setError('root', { message: 'The contact could not be saved. Try again.' });
      }
      feedback.error('The contact could not be saved. Review the form and try again.');
      return;
    }

    onSuccess((await response.json()) as CrmContact);
    form.reset();
    onClose();
    feedback.success('Contact created successfully.');
  };

  const sections: readonly FormSectionDefinition<ContactFormValues>[] = [
    {
      id: 'contact-identity',
      title: 'Identity',
      description: 'Add the name used to identify this contact.',
      leadingIcon: ICON_REGISTRY.forms.identity,
      fields: [
        {
          name: 'firstName',
          label: 'First name',
          description: 'Required for every contact.',
          required: true,
          leadingIcon: ICON_REGISTRY.forms.person,
          render: ({ field, invalid, required, id, describedBy }) => (
            <Input
              {...field}
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              autoComplete="given-name"
              autoFocus
              required={required}
            />
          ),
        },
        {
          name: 'lastName',
          label: 'Last name',
          leadingIcon: ICON_REGISTRY.forms.person,
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
      ],
    },
    {
      id: 'contact-channels',
      title: 'Contact channels',
      description: 'Provide at least one way to reach this contact.',
      leadingIcon: ICON_REGISTRY.forms.contactChannels,
      fields: [
        {
          name: 'email',
          label: 'Email address',
          description: 'Use a monitored address when available.',
          leadingIcon: ICON_REGISTRY.forms.email,
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
          label: 'Phone number',
          description: 'The number is stored with its international calling code.',
          leadingIcon: ICON_REGISTRY.forms.phone,
          render: ({ field, invalid, id, describedBy }) => (
            <PhoneInput
              ref={field.ref}
              id={id}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              defaultCountry="ES"
              countryPlaceholder="Country"
              countrySelectLabel="Country code"
              countrySearchLabel="Search countries"
              countrySearchPlaceholder="Search by country or calling code"
              countryNoResultsLabel="No countries found."
              numberInputProps={{
                'aria-describedby': describedBy,
                'aria-invalid': invalid,
              }}
            />
          ),
        },
      ],
    },
    {
      id: 'contact-organization',
      title: 'Organization',
      description: 'Connect the contact to a company when relevant.',
      leadingIcon: ICON_REGISTRY.forms.organization,
      fields: [
        {
          name: 'companyName',
          label: 'Company',
          span: 'full',
          leadingIcon: ICON_REGISTRY.forms.company,
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

  return (
    <TechnicalDialog
      isOpen={open}
      onClose={onClose}
      title="Create contact"
      description="Add the essential information for this contact."
      presentation="form"
      size="md"
      closeLabel="Close contact form"
      className="items-end p-0 md:items-center md:p-8"
      actions={
        <FormActions className="w-full justify-between md:w-auto md:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="create-contact-form">Create contact</Button>
        </FormActions>
      }
    >
      <Form id="create-contact-form" form={form} onSubmit={submit} className="gap-5">
        {form.formState.errors.root?.message && (
          <p role="alert" className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {form.formState.errors.root.message}
          </p>
        )}
        <FormLayout recipe="CompactCreate" sections={sections} />
      </Form>
    </TechnicalDialog>
  );
}
