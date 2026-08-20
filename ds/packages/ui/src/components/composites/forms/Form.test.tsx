import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { Form, FormField, SubmitButton } from './Form';
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

describe('Form primitives', () => {
  it('associates labels and submits values through react-hook-form', async () => {
    const onSubmit = vi.fn();
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(<TestForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Name *'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada' }, expect.anything());
  });
});
