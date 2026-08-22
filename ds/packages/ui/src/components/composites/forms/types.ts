import type {
  FormHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import type { IconName } from '../../atoms/surfaces/IconRegistry';

export interface FormProps<TFieldValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  children: ReactNode;
}

export interface FormFieldRenderProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  error?: string;
  invalid: boolean;
  required: boolean;
  id: string;
  describedBy?: string;
}

export interface FormFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  required?: boolean;
  leadingIcon?: IconName;
  className?: string;
  children: (props: FormFieldRenderProps<TFieldValues>) => ReactNode;
}

export type FormFieldSpan = 'half' | 'full';

export interface FormFieldDefinition<TFieldValues extends FieldValues>
  extends Omit<FormFieldProps<TFieldValues>, 'children' | 'className'> {
  span?: FormFieldSpan;
  render: FormFieldProps<TFieldValues>['children'];
}

export interface FormSectionDefinition<TFieldValues extends FieldValues> {
  id: string;
  title: string;
  description?: string;
  leadingIcon?: IconName;
  fields: readonly FormFieldDefinition<TFieldValues>[];
}

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'title'> {
  sectionId: string;
  title: string;
  description?: string;
  leadingIcon?: IconName;
  children: ReactNode;
}

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export type FormLayoutRecipe = 'CompactCreate';

export interface FormLayoutProps<TFieldValues extends FieldValues>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML'> {
  recipe: FormLayoutRecipe;
  sections: readonly FormSectionDefinition<TFieldValues>[];
}

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'start' | 'center' | 'end' | 'between';
}
