import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ProximityIndicator } from './index';

describe('ProximityIndicator', () => {
  it('renders semantic label and percentage', () => {
    render(<ProximityIndicator value={72} />);
    expect(screen.getByText('Signal_Proximity')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('clamps values above range to 100%', () => {
    const { container } = render(<ProximityIndicator value={140} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(container.querySelector('[style*="width: 100%"]')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ProximityIndicator value={35} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
