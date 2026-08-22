'use client';

import React from 'react';
import {
  Controller,
  FormProvider,
  useController,
  useFormContext,
  type Control,
  type FieldValues,
} from 'react-hook-form';
import { cn } from '../../../helpers/cn';
import { Button } from '../../atoms/inputs/Button';
import { Icon } from '../../atoms/surfaces/Icon';
import { Label } from '../../atoms/surfaces/Label';
import type {
  FormActionsProps,
  FieldErrorProps,
  FormFieldProps,
  FormLayoutProps,
  FormProps,
  FormSectionProps,
} from './types';

export function Form<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        {...props}
        className={cn('flex min-w-0 flex-col gap-6', className)}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  required,
  leadingIcon,
  className,
  children,
}: FormFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorId = `${field.name}-error`;
        const descriptionId = `${field.name}-description`;
        const describedBy = [fieldState.error ? errorId : null, description ? descriptionId : null]
          .filter(Boolean)
          .join(' ') || undefined;

        return (
          <div className={cn('flex min-w-0 flex-col gap-2', className)}>
            <div className="flex min-w-0 items-center gap-2">
              {leadingIcon && (
                <span aria-hidden="true" className="shrink-0 text-text-muted">
                  <Icon name={leadingIcon} size="sm" />
                </span>
              )}
              <Label
                as="label"
                htmlFor={field.name}
                required={required}
                variant="form"
                textSize="sm"
                textWeight="medium"
              >
                {label}
              </Label>
            </div>
            {children({
              field: {
                ...field,
                name: field.name,
              },
              error: fieldState.error?.message,
              invalid: fieldState.invalid,
              required: Boolean(required),
              id: field.name,
              describedBy,
            })}
            {description && (
              <p id={descriptionId} className="text-xs text-text-muted">
                {description}
              </p>
            )}
            {fieldState.error?.message && (
              <FieldError id={errorId}>
                {fieldState.error.message}
              </FieldError>
            )}
          </div>
        );
      }}
    />
  );
}

export function FieldError({ children, className, ...props }: FieldErrorProps) {
  return (
    <p
      {...props}
      role="alert"
      className={cn('text-xs font-medium text-danger', className)}
    >
      {children}
    </p>
  );
}

export function FormSection({
  sectionId,
  title,
  description,
  leadingIcon,
  children,
  className,
  ...props
}: FormSectionProps) {
  const titleId = `${sectionId}-title`;
  const descriptionId = description ? `${sectionId}-description` : undefined;

  return (
    <fieldset
      {...props}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={cn('min-w-0 space-y-4 border-0 p-0', className)}
    >
      <legend className="w-full">
        <span className="flex min-w-0 items-center gap-3 border-b border-border-subtle pb-3">
          {leadingIcon && (
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-primary"
            >
              <Icon name={leadingIcon} size="md" />
            </span>
          )}
          <span className="min-w-0">
            <span id={titleId} className="block text-sm font-semibold text-text-main">
              {title}
            </span>
            {description && (
              <span id={descriptionId} className="mt-1 block text-xs leading-relaxed text-text-muted">
                {description}
              </span>
            )}
          </span>
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

export function FormLayout<TFieldValues extends FieldValues>({
  recipe,
  sections,
  className,
  ...props
}: FormLayoutProps<TFieldValues>) {
  return (
    <div
      {...props}
      className={cn(recipe === 'CompactCreate' && 'flex min-w-0 flex-col gap-6', className)}
      data-form-recipe={recipe}
    >
      {sections.map((section) => (
        <FormSection
          key={section.id}
          sectionId={section.id}
          title={section.title}
          description={section.description}
          leadingIcon={section.leadingIcon}
        >
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            {section.fields.map((definition) => (
              <FormField<TFieldValues>
                key={definition.name}
                name={definition.name}
                label={definition.label}
                description={definition.description}
                required={definition.required}
                leadingIcon={definition.leadingIcon}
                className={definition.span === 'full' ? 'md:col-span-2' : undefined}
              >
                {definition.render}
              </FormField>
            ))}
          </div>
        </FormSection>
      ))}
    </div>
  );
}

export function FormActions({ children, align = 'end', className, ...props }: FormActionsProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row',
        align === 'start' && 'justify-start',
        align === 'center' && 'justify-center',
        align === 'end' && 'justify-end',
        align === 'between' && 'justify-between',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface SubmitButtonProps extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  children: React.ReactNode;
}

export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  const { formState } = useFormContext();
  return (
    <Button type="submit" isLoading={formState.isSubmitting} disabled={formState.isSubmitting} {...props}>
      {children}
    </Button>
  );
}

export type { Control };
export { useController };
export type {
  FormActionsProps,
  FieldErrorProps,
  FormFieldDefinition,
  FormFieldProps,
  FormFieldRenderProps,
  FormFieldSpan,
  FormLayoutProps,
  FormLayoutRecipe,
  FormProps,
  FormSectionDefinition,
  FormSectionProps,
} from './types';
