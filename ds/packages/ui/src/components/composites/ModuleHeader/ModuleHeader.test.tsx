import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModuleHeader } from './index';
import { MODULE_HEADER_FIXTURES } from './fixtures';

describe('ModuleHeader Composite', () => {
  it('renders title and status correctly', () => {
    render(<ModuleHeader {...MODULE_HEADER_FIXTURES.default} />);
    
    expect(screen.getByText('Brand Hub')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(<ModuleHeader {...MODULE_HEADER_FIXTURES.default} />);
    
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Identidad Visual')).toBeInTheDocument();
  });

  it('triggers sidebar toggle', () => {
    const onToggle = vi.fn();
    const props = {
      ...MODULE_HEADER_FIXTURES.default,
      sidebarToggle: { isOpen: true, onToggle }
    };
    
    render(<ModuleHeader {...props} />);
    
    const toggleBtn = screen.getByRole('button', { name: /alternar menú/i });
    fireEvent.click(toggleBtn);
    
    expect(onToggle).toHaveBeenCalled();
  });

  it('renders back button when showBack is true', () => {
    const onBack = vi.fn();
    render(<ModuleHeader {...MODULE_HEADER_FIXTURES.draft} onBack={onBack} />);
    
    const backBtn = screen.getByRole('button', { name: /volver atrás/i });
    fireEvent.click(backBtn);
    
    expect(onBack).toHaveBeenCalled();
  });
});
