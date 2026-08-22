import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ICON_REGISTRY } from '../../atoms/surfaces/IconRegistry';
import { Form, FormActions, FormField, FormLayout, SubmitButton } from './Form';
import type { FormLayoutProps, FormSectionDefinition } from './types';
import { Input } from '../../../components/atoms/inputs/Input';

type Values = {
  name: string;
};

function TestForm({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const form = useForm<Values>({
    defaultValues: { name: '' },
  });

  return (
    <Form form={form} onSubmit={onSubmit} aria-label="Example form">
      <FormField<Values> name="name" label="Name" required>
        {({ field, error, id, describedBy }) => (
          <Input {...field} id={id} error={error} aria-describedby={describedBy} />
        )}
      </FormField>
      <SubmitButton>Save</SubmitButton>
    </Form>
  );
}

function SectionedForm() {
  const form = useForm<Values>({
    defaultValues: { name: '' },
  });
  const sections: readonly FormSectionDefinition<Values>[] = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Describe the record.',
      leadingIcon: ICON_REGISTRY.forms.identity,
      fields: [
        {
          name: 'name',
          label: 'Display name',
          description: 'Use a recognizable name.',
          required: true,
          leadingIcon: ICON_REGISTRY.forms.person,
          span: 'full',
          render: ({ field, id, describedBy, invalid }) => (
            <Input
              {...field}
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
            />
          ),
        },
      ],
    },
  ];

  return (
    <Form form={form} onSubmit={vi.fn()} aria-label="Sectioned form">
      <FormLayout recipe="CompactCreate" sections={sections} />
      <FormActions>
        <SubmitButton>Submit record</SubmitButton>
      </FormActions>
    </Form>
  );
}

describe('Form primitives', () => {
  it('does not expose discarded content props in the layout contract', () => {
    type HasChildren = 'children' extends keyof FormLayoutProps<Values> ? true : false;
    type HasUnsafeHtml = 'dangerouslySetInnerHTML' extends keyof FormLayoutProps<Values>
      ? true
      : false;
    const hasChildren: HasChildren = false;
    const hasUnsafeHtml: HasUnsafeHtml = false;

    expect(hasChildren).toBe(false);
    expect(hasUnsafeHtml).toBe(false);
  });

  it('associates labels and submits values through react-hook-form', async () => {
    const onSubmit = vi.fn();
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(<TestForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Name *'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada' }, expect.anything());
  });

  it('renders the CompactCreate recipe from typed sections in declaration order', () => {
    const { container } = render(<SectionedForm />);

    expect(container.querySelector('[data-form-recipe="CompactCreate"]')).toHaveClass(
      'flex',
      'flex-col',
    );
    expect(screen.getByRole('group', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByLabelText('Display name *')).toHaveAttribute(
      'aria-describedby',
      'name-description',
    );
    expect(screen.getByText('Use a recognizable name.')).toHaveAttribute(
      'id',
      'name-description',
    );
  });

  it('has no accessibility violations for a sectioned compact form', async () => {
    const { container } = render(<SectionedForm />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
