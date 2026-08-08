import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Label } from './index';

describe('Label', () => {
  it('renders as a semantic label and links with htmlFor', () => {
    render(
      <>
        <Label htmlFor="tenant-id">Tenant ID</Label>
        <input id="tenant-id" />
      </>,
    );

    const label = screen.getByText('Tenant ID').closest('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'tenant-id');
  });

  it('shows required mark when required is true', () => {
    render(<Label required>Suite Name</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="suite-code">Suite Code</Label>
        <input id="suite-code" />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
