import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModuleSidebar } from './index';
import { MODULE_SIDEBAR_FIXTURES } from './fixtures';

describe('ModuleSidebar Composite', () => {
  it('renders title and children', () => {
    render(<ModuleSidebar {...MODULE_SIDEBAR_FIXTURES.default} />);
    
    expect(screen.getByText('Navegación')).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('handles search input', () => {
    const onChange = vi.fn();
    const props = {
      ...MODULE_SIDEBAR_FIXTURES.default,
      search: { value: '', onChange }
    };
    
    render(<ModuleSidebar {...props} />);
    
    const input = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(onChange).toHaveBeenCalledWith('test');
  });
});
