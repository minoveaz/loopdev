import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModuleSidebar } from './index';
import { MODULE_SIDEBAR_FIXTURES } from './fixtures';

describe('ModuleSidebar Composite', () => {
  it('renders brand list in module mode', () => {
    render(<ModuleSidebar {...MODULE_SIDEBAR_FIXTURES.moduleMode} />);
    
    expect(screen.getByText(/Acme Corp/i)).toBeInTheDocument();
    expect(screen.getByText(/Loop Labs/i)).toBeInTheDocument();
  });

  it('handles search input', () => {
    const onSearchChange = vi.fn();
    const props = {
      ...MODULE_SIDEBAR_FIXTURES.moduleMode,
      onSearchChange
    };
    render(<ModuleSidebar {...props} />);
    
    const input = screen.getByPlaceholderText(/filter/i);
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(onSearchChange).toHaveBeenCalledWith('test');
  });

  it('renders navigation tree in brand mode', () => {
    render(<ModuleSidebar {...MODULE_SIDEBAR_FIXTURES.brandMode} />);
    
    expect(screen.getByText(/Brand Identity/i)).toBeInTheDocument();
    expect(screen.getByText(/Visual System/i)).toBeInTheDocument();
  });

  it('triggers back to directory', () => {
    const onBack = vi.fn();
    const props = {
      ...MODULE_SIDEBAR_FIXTURES.brandMode,
      onBackToDirectory: onBack
    };
    render(<ModuleSidebar {...props} />);
    
    const backBtn = screen.getByRole('button', { name: /back to directory/i });
    fireEvent.click(backBtn);
    
    expect(onBack).toHaveBeenCalled();
  });
});