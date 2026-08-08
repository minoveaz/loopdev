import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SuiteCard } from './index';

describe('SuiteCard Composite', () => {
  const illustration = <svg aria-label="suite-illustration" />;

  it('renders unlocked card with link', () => {
    render(
      <SuiteCard
        title="Marketing Suite"
        description="Brand automation suite"
        illustration={illustration}
        version="1.2.0"
        href="/marketing"
      />,
    );

    expect(screen.getByText('Marketing Suite')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/marketing');
    expect(screen.getByText('System_Ready')).toBeInTheDocument();
  });

  it('renders locked state without navigation link', () => {
    render(
      <SuiteCard
        title="Trading Suite"
        description="Execution workspace"
        illustration={illustration}
        version="2.0.0"
        href="/trading"
        isLocked
      />,
    );

    expect(screen.getByText('{ LOCKED }')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Auth_Required')).toBeInTheDocument();
  });

  it('has no accessibility violations in unlocked state', async () => {
    const { container } = render(
      <SuiteCard
        title="Ops Suite"
        description="Ops center"
        illustration={illustration}
        version="3.0.0"
        href="/ops"
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});