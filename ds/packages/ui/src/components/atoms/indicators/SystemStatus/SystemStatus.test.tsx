import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SystemStatus } from './index';

describe('SystemStatus', () => {
  it('renders semantic status state', () => {
    render(<SystemStatus state="degraded" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Degraded')).toBeInTheDocument();
  });

  it('formats long identifiers using technical bracket syntax', () => {
    render(<SystemStatus id="123456789012345" label="Tenant" />);
    expect(screen.getByText('Tenant:')).toBeInTheDocument();
    expect(screen.getByText('12345678...')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SystemStatus state="maintenance" id="acme-tenant" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
