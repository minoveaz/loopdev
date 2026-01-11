import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModuleHeader } from './index';
import { MODULE_HEADER_FIXTURES } from './fixtures';

describe('ModuleHeader Composite', () => {
  it('renders title and status correctly', () => {
    render(<ModuleHeader {...MODULE_HEADER_FIXTURES.moduleMode} />);
    
    expect(screen.getByText(/Brand Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/SYSTEM_ACTIVE/i)).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(<ModuleHeader {...MODULE_HEADER_FIXTURES.brandMode} />);
    
    expect(screen.getByText(/Marketing/i)).toBeInTheDocument();
    expect(screen.getByText(/Acme Corp/i)).toBeInTheDocument();
  });

  it('triggers sidebar toggle', () => {
    const onToggle = vi.fn();
    const props = {
      ...MODULE_HEADER_FIXTURES.moduleMode,
      sidebarToggle: { isOpen: true, onToggle }
    };
    
    render(<ModuleHeader {...props} />);
    
    const toggleBtn = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(toggleBtn);
    
    expect(onToggle).toHaveBeenCalled();
  });
});