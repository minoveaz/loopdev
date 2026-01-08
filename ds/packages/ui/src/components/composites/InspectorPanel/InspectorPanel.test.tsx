import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InspectorPanel } from './index';
import { INSPECTOR_PANEL_FIXTURES } from '../ModuleSidebar/fixtures';

describe('InspectorPanel Composite', () => {
  it('renders title and subtitle', () => {
    render(<InspectorPanel {...INSPECTOR_PANEL_FIXTURES.default} />);
    
    expect(screen.getByText('Atributos')).toBeInTheDocument();
    expect(screen.getByText(/ID-90210/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<InspectorPanel {...INSPECTOR_PANEL_FIXTURES.default} onClose={onClose} />);
    
    const closeBtn = screen.getByRole('button', { name: /cerrar panel/i });
    fireEvent.click(closeBtn);
    
    expect(onClose).toHaveBeenCalled();
  });
});
