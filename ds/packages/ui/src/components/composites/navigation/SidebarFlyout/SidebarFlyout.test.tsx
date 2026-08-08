import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SidebarFlyout } from './index';

describe('SidebarFlyout', () => {
  it('renders learning content and supports closing', () => {
    const onClose = vi.fn();
    render(
      <SidebarFlyout title="Brand Hub" description="Manage brand context." onClose={onClose}>
        <p>Guidance</p>
      </SidebarFlyout>,
    );

    expect(screen.getByText('Brand Hub')).toBeInTheDocument();
    expect(screen.getByText('Guidance')).toBeInTheDocument();
    screen.getByRole('button', { name: 'Close Flyout' }).click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations in navigation mode', async () => {
    const { container } = render(
      <SidebarFlyout
        title="Brand Hub"
        mode="navigate"
        links={[{ id: 'brands', label: 'Brands', href: '/brands' }]}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});