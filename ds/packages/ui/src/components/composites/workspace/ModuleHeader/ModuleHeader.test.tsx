import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { ModuleHeader } from './index';
import { MODULE_HEADER_FIXTURES } from './fixtures';

describe('ModuleHeader Composite', () => {
  it('renders title and status correctly', () => {
    render(<ModuleHeader {...MODULE_HEADER_FIXTURES.moduleMode} />);
    
    expect(screen.getByText(/Brand Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/SYSTEM_ACTIVE/i)).toBeInTheDocument();
    expect(screen.getByRole('banner', { name: 'Module header' })).toHaveAttribute(
      'data-module-header-rows',
      '1',
    );
  });

  it('renders breadcrumbs', () => {
    render(<ModuleHeader {...MODULE_HEADER_FIXTURES.brandMode} />);
    
    expect(screen.getByText(/Marketing/i)).toBeInTheDocument();
    expect(screen.getByText(/Acme Corp/i)).toBeInTheDocument();
  });

  it('renders the compact breadcrumb contract on mobile and the full path on desktop', () => {
    render(
      <ModuleHeader
        {...MODULE_HEADER_FIXTURES.moduleMode}
        mobileSegments={[{ id: 'contacts', label: 'Contacts', isActive: true }]}
      />,
    );

    expect(screen.getAllByRole('navigation', { name: 'Breadcrumb' })).toHaveLength(1);
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Brand Hub')).toBeInTheDocument();
  });

  it('triggers sidebar toggle', () => {
    const onToggle = vi.fn();
    const props = {
      ...MODULE_HEADER_FIXTURES.moduleMode,
      sidebarToggle: { isOpen: true, onToggle }
    };
    
    render(<ModuleHeader {...props} />);
    
    const toggleBtn = screen.getByRole('button', { name: 'Toggle module context' });
    fireEvent.click(toggleBtn);
    
    expect(onToggle).toHaveBeenCalled();
  });

  it('keeps two-row headers explicit and exposes an accessible toggle name', () => {
    render(
      <ModuleHeader
        {...MODULE_HEADER_FIXTURES.moduleMode}
        rows={2}
        sidebarToggle={{
          isOpen: false,
          onToggle: () => undefined,
          ariaLabel: 'Open contact context',
        }}
      />,
    );

    expect(screen.getByRole('banner', { name: 'Module header' })).toHaveAttribute(
      'data-module-header-rows',
      '2',
    );
    expect(screen.getByRole('button', { name: 'Open contact context' })).toBeInTheDocument();
  });

  it('has no accessibility violations in the canonical two-row composition', async () => {
    const { container } = render(
      <ModuleHeader
        {...MODULE_HEADER_FIXTURES.moduleMode}
        rows={2}
        sidebarToggle={{ isOpen: true, onToggle: vi.fn() }}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
