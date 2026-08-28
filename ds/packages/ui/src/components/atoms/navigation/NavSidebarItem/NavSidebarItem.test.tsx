import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavSidebarItem } from './index';
import React from 'react';
import { axe } from 'vitest-axe';

describe('NavSidebarItem Atom', () => {
  it('debe renderizar la etiqueta del módulo correctamente', () => {
    render(<NavSidebarItem label="Test Module" icon="LibraryBig" />);
    expect(screen.getByText('Test Module')).toBeInTheDocument();
  });

  it('debe disparar la navegación al hacer clic si está habilitado', () => {
    const mockNavigate = vi.fn();
    const testRoute = { routeId: '/test' };
    render(
      <NavSidebarItem label="Test" icon="LibraryBig" onNavigate={mockNavigate} route={testRoute} />,
    );

    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith(testRoute);
  });

  it('no debe disparar navegación si el estado es disabled', () => {
    const mockNavigate = vi.fn();
    render(
      <NavSidebarItem label="Locked" icon="Lock" status="disabled" onNavigate={mockNavigate} />,
    );

    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('no debe disparar navegación si el estado es forbidden', () => {
    const mockNavigate = vi.fn();
    render(
      <NavSidebarItem label="Forbidden" icon="Lock" status="forbidden" onNavigate={mockNavigate} />,
    );

    const item = screen.getByRole('menuitem');
    fireEvent.click(item);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('mantiene la navegación disponible en modo read-only', () => {
    const mockNavigate = vi.fn();
    const testRoute = { routeId: '/read-only' };
    render(
      <NavSidebarItem
        label="Read only"
        icon="Eye"
        status="read-only"
        onNavigate={mockNavigate}
        route={testRoute}
      />,
    );

    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith(testRoute);
  });

  it('debe ocultar el texto en modo Rail', () => {
    render(<NavSidebarItem label="Hidden Text" icon="LibraryBig" isRail={true} />);
    expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Hidden Text' })).toBeInTheDocument();
  });

  it('debe mostrar el tooltip del módulo al pasar el cursor en Rail', async () => {
    const user = userEvent.setup();
    render(<NavSidebarItem label="Rail Tooltip" icon="LibraryBig" isRail={true} />);

    await user.hover(screen.getByRole('menuitem', { name: 'Rail Tooltip' }));

    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Rail Tooltip'));
  });

  it('no debe mostrar tooltip cuando el rail pertenece a Expand on hover', async () => {
    const user = userEvent.setup();
    render(
      <NavSidebarItem label="Hover Module" icon="LibraryBig" isRail={true} revealOnHover={true} />,
    );

    await user.hover(screen.getByRole('menuitem', { name: 'Hover Module' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('debe mantener el icono en el rail y preparar la etiqueta para reveal on hover', () => {
    render(
      <NavSidebarItem label="Hover Label" icon="LibraryBig" isRail={true} revealOnHover={true} />,
    );
    expect(screen.getByText('Hover Label')).toHaveAttribute('data-sidebar-label');
    expect(screen.getByText('Hover Label')).toHaveClass(
      'absolute',
      'left-12',
      'top-1/2',
      'text-text-main',
      'hidden',
    );
    expect(screen.getByRole('menuitem', { name: 'Hover Label' })).toHaveClass(
      'size-10',
      'justify-center',
    );
  });

  it('debe mostrar el rol ARIA activo correctamente', () => {
    render(<NavSidebarItem label="Active" icon="LibraryBig" isActive={true} />);
    const item = screen.getByRole('menuitem');
    expect(item).toHaveAttribute('aria-current', 'page');
    expect(item).toHaveClass(
      'border-l-4',
      'border-l-[var(--lpd-color-brand-primary)]',
      'bg-[var(--lpd-color-bg-primary-subtle)]',
      'text-slate-800',
    );
  });

  it('debe usar una superficie sutil y texto principal para hover en estados interactivos', () => {
    render(<NavSidebarItem label="Hoverable" icon="LibraryBig" />);
    expect(screen.getByRole('menuitem')).toHaveClass(
      'hover:border-primary/20',
      'hover:bg-surface-elevated',
      'hover:!text-text-main',
    );
  });

  it('has no accessibility violations in the active navigation state', async () => {
    const { container } = render(
      <div role="menu">
        <NavSidebarItem label="Brand Hub" icon="LibraryBig" isActive={true} />
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations in rail navigation state', async () => {
    const { container } = render(
      <div role="menu">
        <NavSidebarItem label="Brand Hub" icon="LibraryBig" isRail={true} />
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
