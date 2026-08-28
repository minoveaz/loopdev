import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from './index';

describe('RadioGroup', () => {
  const options = [
    { value: 'table', label: 'Table' },
    { value: 'cards', label: 'Cards' },
  ];

  it('renders a labelled native radio group and reports changes', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label="View mode"
        name="view"
        defaultValue="table"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole('group', { name: 'View mode' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Table' })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: 'Cards' }));
    expect(onValueChange).toHaveBeenCalledWith('cards', expect.anything());
  });

  it('supports disabled options and Axe', async () => {
    const { container } = render(
      <RadioGroup
        label="View mode"
        options={[{ value: 'table', label: 'Table', disabled: true }]}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Table' })).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not mix controlled and uncontrolled input props', () => {
    const { container } = render(
      <RadioGroup
        name="view"
        value="table"
        defaultValue="cards"
        options={options}
        onValueChange={() => undefined}
      />,
    );

    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toBeChecked();
    expect(radios[0]).not.toHaveAttribute('defaultChecked');
    expect(radios[1]).not.toHaveAttribute('defaultChecked');
  });
});
