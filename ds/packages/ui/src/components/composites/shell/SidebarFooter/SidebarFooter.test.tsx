import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarFooter } from './index';
import React from 'react';

describe('SidebarFooter Composite', () => {
  it('no debe duplicar la identidad del usuario en el sidebar', () => {
    render(<SidebarFooter userName="Miller Vega" onToggleRail={() => {}} />);
    expect(screen.queryByText(/miller/i)).not.toBeInTheDocument();
    expect(document.querySelector('.rounded-full')).not.toBeInTheDocument();
  });

  it('debe disparar el toggle al pulsar el botón de colapso', () => {
    const mockToggle = vi.fn();
    render(<SidebarFooter userName="Test" onToggleRail={mockToggle} />);
    
    const btn = screen.getByTitle('Contraer');
    fireEvent.click(btn);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

});
