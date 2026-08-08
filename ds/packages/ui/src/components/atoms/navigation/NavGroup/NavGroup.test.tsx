import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { NavGroup } from './index';

describe('NavGroup', () => {
  it('renders its label and navigation content', () => {
    render(
      <NavGroup label="Workspace">
        <button type="button">Brand Hub</button>
      </NavGroup>,
    );

    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Brand Hub' })).toBeInTheDocument();
  });

  it('has no accessibility violations in rail mode', async () => {
    const { container } = render(
      <NavGroup label="Workspace" isRail>
        <button type="button" aria-label="Brand Hub" />
      </NavGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});