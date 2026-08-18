import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Switch } from './index';

describe('Switch', () => {
  it('uses switch semantics and toggles from its label', async () => {
    const user = userEvent.setup();
    render(<Switch label="Enable automation" />);
    const control = screen.getByRole('switch', { name: 'Enable automation' });
    expect(control).not.toBeChecked();
    await user.click(screen.getByText('Enable automation'));
    expect(control).toBeChecked();
  });

  it('supports disabled state and Axe', async () => {
    const { container } = render(<Switch label="Enable automation" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });
});
