import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TechnicalStatusBadge } from './index';

describe('TechnicalStatusBadge Atom', () => {
  it('renders label with brackets', () => {
    render(<TechnicalStatusBadge label="active" />);
    expect(screen.getByText('{')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('}')).toBeInTheDocument();
  });

  it('renders pulse when withPulse is true', () => {
    const { container } = render(<TechnicalStatusBadge label="live" withPulse />);
    // Check if StatusPulse is rendered (usually a rounded-full div)
    expect(container.querySelector('.rounded-full')).toBeInTheDocument();
  });

  it('applies correct severity classes', () => {
    const { container } = render(<TechnicalStatusBadge label="warning" severity="warning" />);
    expect(screen.getByText('warning')).toHaveClass('text-energy-yellow');
  });
});
