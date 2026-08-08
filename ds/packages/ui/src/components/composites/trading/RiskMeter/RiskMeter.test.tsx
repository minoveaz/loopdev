import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RiskMeter } from './index';

describe('RiskMeter Composite', () => {
  it('renders title and value labels', () => {
    render(
      <RiskMeter
        title="Exposure_Limit"
        subtitle="Warning"
        value={64}
        maxValue={100}
        valueLabel="64%"
        maxLabel="/ 100%"
      />,
    );

    expect(screen.getByText('Exposure_Limit')).toBeInTheDocument();
    expect(screen.getByText('64%')).toBeInTheDocument();
    expect(screen.getByText('/ 100%')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('caps progress width at 100%', () => {
    const { container } = render(<RiskMeter title="Risk" value={300} maxValue={100} />);
    const bar = container.querySelector('[style*="width"]') as HTMLElement;

    expect(bar.style.width).toBe('100%');
  });

  it('has no accessibility violations in base render', async () => {
    const { container } = render(<RiskMeter title="Drawdown" value={25} maxValue={100} subtitle="Stable" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
