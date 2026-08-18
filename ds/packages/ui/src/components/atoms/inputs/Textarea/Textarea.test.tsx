import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Textarea } from './index';

describe('Textarea', () => {
  it('associates label and helper text', () => {
    render(<Textarea label="Notes" helperText="Add context." />);
    const textarea = screen.getByLabelText('Notes');
    expect(textarea).toHaveAttribute('aria-describedby');
    expect(screen.getByText('Add context.')).toHaveAttribute('id', textarea.getAttribute('aria-describedby'));
  });

  it('supports error and disabled states', () => {
    render(<Textarea label="Notes" error="Required" disabled />);
    expect(screen.getByLabelText('Notes')).toBeDisabled();
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true');
  });

  it('emits native changes and has no accessibility violations', async () => {
    const { container } = render(<Textarea label="Notes" />);
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Updated' } });
    expect(screen.getByLabelText('Notes')).toHaveValue('Updated');
    expect(await axe(container)).toHaveNoViolations();
  });
});
