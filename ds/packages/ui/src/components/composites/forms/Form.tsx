'use client';

import React from 'react';
import {
  Controller,
  FormProvider,
  useController,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type UseFormReturn,
} from 'react-hook-form';
import { cn } from '../../../helpers/cn';
import { Button } from '../../atoms/inputs/Button';
import { Label } from '../../atoms/surfaces/Label';

export interface FormProps<TFieldValues extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  children: React.ReactNode;
}

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

export interface FormFieldRenderProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  error?: string;
  invalid: boolean;
  id: string;
  describedBy?: string;
}

export interface FormFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: (props: FormFieldRenderProps<TFieldValues>) => React.ReactNode;
}

export function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  required,
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
            {children({
              field: {
                ...field,
                name: field.name,
              },
              error: fieldState.error?.message,
              invalid: fieldState.invalid,
              id: field.name,
              describedBy,
            })}
            {description && (
              <p id={descriptionId} className="text-xs text-text-muted">
                {description}
              </p>
            )}
            {fieldState.error?.message && (
              <p id={errorId} role="alert" className="text-xs font-medium text-danger">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end' | 'between';
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

export function SubmitButton({ children = 'Save', ...props }: React.ComponentProps<typeof Button>) {
  const { formState } = useFormContext();
  return (
    <Button type="submit" isLoading={formState.isSubmitting} disabled={formState.isSubmitting} {...props}>
      {children}
    </Button>
  );
}

export type { Control };
export { useController };
