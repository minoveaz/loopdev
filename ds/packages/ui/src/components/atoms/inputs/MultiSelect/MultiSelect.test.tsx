import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { MultiSelect } from './index';

describe('MultiSelect Primitive', () => {
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ];

  it('has no accessibility violations with default configuration', async () => {
    const { container } = render(
      <MultiSelect
        label="Technologies"
        options={options}
        defaultValue={['react']}
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders selected tags properly', () => {
    render(
      <MultiSelect
        label="Technologies"
        options={options}
        value={['react', 'vue']}
      />
    );

    expect(screen.getByText('React')).toBeDefined();
    expect(screen.getByText('Vue')).toBeDefined();
  });

  it('allows removing a tag via its close button', () => {
    const onChange = vi.fn();
    render(
      <MultiSelect
        label="Technologies"
        options={options}
        value={['react']}
        onChange={onChange}
      />
    );

    const removeBtn = screen.getByLabelText('Remove React');
    fireEvent.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
