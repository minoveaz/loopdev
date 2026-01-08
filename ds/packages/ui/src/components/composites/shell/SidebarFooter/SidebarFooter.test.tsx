import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarFooter } from './index';
import React from 'react';

describe('SidebarFooter Composite', () => {
  it('debe mostrar el nombre del usuario en modo expandido', () => {
    render(<SidebarFooter userName="Miller Vega" onToggleRail={() => {}} />);
    expect(screen.getByText(/miller/i)).toBeInTheDocument();
  });

  it('debe ocultar el texto en modo Rail', () => {
    render(<SidebarFooter userName="Miller Vega" isRail={true} onToggleRail={() => {}} />);
    expect(screen.queryByText('Miller')).not.toBeInTheDocument();
  });

  it('debe disparar el toggle al pulsar el botón de colapso', () => {
    const mockToggle = vi.fn();
    render(<SidebarFooter userName="Test" onToggleRail={mockToggle} />);
    
    const btn = screen.getByTitle('Contraer');
    fireEvent.click(btn);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar el avatar del usuario siempre', () => {
    const { container } = render(<SidebarFooter userName="Test" onToggleRail={() => {}} />);
    // Buscamos el contenedor del avatar
    expect(container.querySelector('.rounded-full')).toBeInTheDocument();
  });
});
