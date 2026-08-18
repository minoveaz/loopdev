import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { ModuleToolbar } from './index';
import { MODULE_TOOLBAR_FIXTURES } from './fixtures';

describe('ModuleToolbar Composite', () => {
  it('renders all slots correctly', () => {
    render(<ModuleToolbar {...MODULE_TOOLBAR_FIXTURES.default} />);
    
    expect(screen.getByRole('toolbar', { name: 'Module toolbar' })).toHaveAttribute(
      'data-module-toolbar-rows',
      '1',
    );
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

  it('keeps two-row layouts and the center slot reachable on small screens', () => {
    render(
      <ModuleToolbar
        {...MODULE_TOOLBAR_FIXTURES.default}
        rows={2}
        centerSlot={<span>View controls</span>}
      />,
    );

    expect(screen.getByRole('toolbar', { name: 'Module toolbar' })).toHaveAttribute(
      'data-module-toolbar-rows',
      '2',
    );
    expect(screen.getByText('View controls')).toBeVisible();
    expect(screen.getByRole('toolbar')).toHaveClass('grid-cols-2', 'grid-rows-2');
  });

  it('does not render if all slots are empty', () => {
    const { container } = render(<ModuleToolbar {...MODULE_TOOLBAR_FIXTURES.empty} />);
    expect(container.firstChild).toBeNull();
  });

  it('has no accessibility violations in the canonical two-row composition', async () => {
    const { container } = render(
      <ModuleToolbar
        {...MODULE_TOOLBAR_FIXTURES.default}
        rows={2}
        centerSlot={<span>View controls</span>}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
