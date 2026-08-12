import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { QualityShield } from './index';

describe('QualityShield', () => {
  const metrics = {
    unit: { label: 'Unit', status: 'pass' as const, value: '96%' },
    a11y: { label: 'A11y', status: 'warn' as const, value: '1 issue' },
    visual: { label: 'Visual', status: 'fail' as const, value: '2 diffs' },
  };

  it('renders quality matrix rows and values', () => {
    render(<QualityShield metrics={metrics} />);

    expect(screen.getByText('QA_Matrix_v1.5')).toBeInTheDocument();
    expect(screen.getByText('Unit:')).toBeInTheDocument();
    expect(screen.getByText('96%')).toBeInTheDocument();
    expect(screen.getByText('1 issue')).toBeInTheDocument();
    expect(screen.getByText('2 diffs')).toBeInTheDocument();
  });

  it('applies status color classes to metric values', () => {
    render(<QualityShield metrics={metrics} />);
    expect(screen.getByText('96%')).toHaveClass('text-emerald-500');
    expect(screen.getByText('2 diffs')).toHaveClass('text-rose-500');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QualityShield metrics={metrics} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
