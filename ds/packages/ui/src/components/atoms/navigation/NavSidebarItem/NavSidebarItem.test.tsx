import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavSidebarItem } from './index';
import React from 'react';

describe('NavSidebarItem Atom', () => {
  it('debe renderizar la etiqueta del módulo correctamente', () => {
    render(<NavSidebarItem label="Test Module" icon="LibraryBig" />);
    expect(screen.getByText('Test Module')).toBeInTheDocument();
  });

  it('debe disparar la navegación al hacer clic si está habilitado', () => {
    const mockNavigate = vi.fn();
    const testRoute = { routeId: '/test' };
    render(<NavSidebarItem label="Test" icon="LibraryBig" onNavigate={mockNavigate} route={testRoute} />);
    
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith(testRoute);
  });

  it('no debe disparar navegación si el estado es disabled', () => {
    const mockNavigate = vi.fn();
    render(<NavSidebarItem label="Locked" icon="Lock" status="disabled" onNavigate={mockNavigate} />);
    
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('debe ocultar el texto en modo Rail', () => {
    render(<NavSidebarItem label="Hidden Text" icon="LibraryBig" isRail={true} />);
    expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument();
  });

  it('debe mostrar el rol ARIA activo correctamente', () => {
    render(<NavSidebarItem label="Active" icon="LibraryBig" isActive={true} />);
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-current', 'page');
  });
});
