import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Divider } from './index';

describe('Divider', () => {
  it('renders horizontal separator by default', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders center label when label is provided', () => {
    render(<Divider label="Telemetry" />);
    expect(screen.getByText('Telemetry')).toBeInTheDocument();
  });

  it('supports vertical orientation', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Divider label="Cluster" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
