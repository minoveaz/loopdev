import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { PulseSparkline } from './index';

describe('PulseSparkline', () => {
  it('shows fallback state when data is insufficient', () => {
    render(<PulseSparkline data={[10]} />);
    expect(screen.getByText('Market_Silence')).toBeInTheDocument();
  });

  it('renders activity bars and hover scan value', () => {
    const { container } = render(<PulseSparkline data={[10, 14, 11, 19]} />);

    expect(screen.getByText('HI: $19')).toBeInTheDocument();
    expect(screen.getByText('LO: $10')).toBeInTheDocument();

    const bars = container.querySelectorAll('.cursor-crosshair');
    expect(bars.length).toBeGreaterThan(0);
    fireEvent.mouseEnter(bars[1]);
    expect(screen.getByText(/SCAN:/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PulseSparkline data={[10, 12, 11]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
