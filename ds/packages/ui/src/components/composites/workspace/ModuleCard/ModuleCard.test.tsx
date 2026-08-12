import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { ModuleCard } from './index';

describe('ModuleCard Composite', () => {
  it('renders status, split title and footer content', () => {
    render(
      <ModuleCard
        statusBadge="ACTIVE"
        title="Brand Hub"
        footerContent={<span>Team Atlas</span>}
      />,
    );

    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Hub')).toBeInTheDocument();
    expect(screen.getByText('Team Atlas')).toBeInTheDocument();
  });

  it('fires click handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ModuleCard
        statusBadge="LIVE"
        title="Risk Console"
        footerContent={<span>Ops</span>}
        onClick={onClick}
      />,
    );

    await user.click(screen.getByText('Risk'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations in base render', async () => {
    const { container } = render(
      <ModuleCard
        statusBadge="LIVE"
        title="Module Alpha"
        footerContent={<span>Footer</span>}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
