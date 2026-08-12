import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { IndustrialBreadcrumbs } from './index';

describe('IndustrialBreadcrumbs', () => {
  it('renders the hierarchy and active segment', () => {
    render(
      <IndustrialBreadcrumbs
        segments={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'current', label: 'Brand Hub', isActive: true },
        ]}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Brand Hub')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <IndustrialBreadcrumbs segments={[{ id: 'current', label: 'Brand Hub', isActive: true }]} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});