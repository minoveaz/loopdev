import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MetricCard } from './index';

describe('MetricCard Composite', () => {
  it('renders metric values and trend information', () => {
    render(<MetricCard label="PnL" value="$1200" delta="+3.5%" trend="up" icon="query_stats" />);

    expect(screen.getByText('PnL')).toBeInTheDocument();
    expect(screen.getByText('$1200')).toBeInTheDocument();
    expect(screen.getByText('+3.5%')).toBeInTheDocument();
  });

  it('renders skeleton mode when loading', () => {
    const { container } = render(<MetricCard label="Exposure" value="0" isLoading />);
    expect(container.querySelectorAll('[class*="animate"]').length).toBeGreaterThan(0);
  });

  it('has no accessibility violations in base render', async () => {
    const { container } = render(<MetricCard label="Sharpe" value="1.42" delta="+0.1" trend="up" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
