import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { IndustrialMetric } from './index';

describe('IndustrialMetric', () => {
  it('renders label, primary value and secondary value', () => {
    render(<IndustrialMetric label="PnL" value="+128" secondaryValue="24 trades" />);

    expect(screen.getByText('PnL')).toBeInTheDocument();
    expect(screen.getByText('+128')).toBeInTheDocument();
    expect(screen.getByText('24 trades')).toBeInTheDocument();
  });

  it('renders trend icon for down trend', () => {
    render(<IndustrialMetric label="Winrate" value="42%" trend="down" />);
    expect(screen.getByText('arrow_downward')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<IndustrialMetric label="Score" value="88" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
