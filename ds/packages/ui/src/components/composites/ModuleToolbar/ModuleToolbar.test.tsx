import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModuleToolbar } from './index';
import { MODULE_TOOLBAR_FIXTURES } from './fixtures';

describe('ModuleToolbar Composite', () => {
  it('renders all slots correctly', () => {
    render(<ModuleToolbar {...MODULE_TOOLBAR_FIXTURES.default} />);
    
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('renders selection state and clear action', () => {
    const onClear = vi.fn();
    const props = {
      ...MODULE_TOOLBAR_FIXTURES.withSelection,
      selection: { count: 5, onClear }
    };
    
    render(<ModuleToolbar {...props} />);
    
    expect(screen.getByText(/5 seleccionados/i)).toBeInTheDocument();
    
    const clearBtn = screen.getByRole('button', { name: /limpiar selección/i });
    fireEvent.click(clearBtn);
    
    expect(onClear).toHaveBeenCalled();
  });

  it('does not render if all slots are empty', () => {
    const { container } = render(<ModuleToolbar {...MODULE_TOOLBAR_FIXTURES.empty} />);
    expect(container.firstChild).toBeNull();
  });
});
