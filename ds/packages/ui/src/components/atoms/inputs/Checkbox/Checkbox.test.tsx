import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './index';

describe('Checkbox Primitive', () => {
  it('renders a labeled custom checkbox and toggles with the label', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Select contact" label="Select contact" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select contact' });

    expect(checkbox).not.toBeChecked();
    await user.click(screen.getByText('Select contact'));
    expect(checkbox).toBeChecked();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Checkbox aria-label="Select contact" label="Select contact" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
