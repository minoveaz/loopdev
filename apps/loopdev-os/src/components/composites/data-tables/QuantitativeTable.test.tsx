import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { QuantitativeTable } from './QuantitativeTable';

describe('QuantitativeTable', () => {
  it('renders right-priority metrics with semantic trends and goal progress without pagination', async () => {
    const { container } = render(<QuantitativeTable />);

    expect(screen.getByRole('table', { name: 'Quantitative metrics' })).toBeInTheDocument();
    expect(screen.getByText('Change')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
    expect(screen.getAllByText('+18%')).toHaveLength(2);
    expect(screen.getAllByText('-4 days')).toHaveLength(2);
    expect(screen.getByRole('columnheader', { name: 'Current' })).toHaveClass('text-right');
    expect(screen.getByRole('columnheader', { name: /Change/ })).toHaveClass('text-right');
    expect(screen.getByRole('columnheader', { name: 'Target vs goal' })).toHaveClass('text-right');
    expect(screen.getByRole('cell', { name: '$248,000' })).toHaveClass('text-right');
    expect(screen.getAllByRole('progressbar', { name: 'Pipeline value target progress' })).toHaveLength(2);
    expect(screen.getAllByRole('progressbar', { name: 'Pipeline value target progress' })[0]).toHaveAttribute('aria-valuenow', '82.66666666666667');
    expect(screen.getAllByRole('progressbar')).toHaveLength(6);
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    expect(screen.getByText('Last calculated: Today at 08:00 AM')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});