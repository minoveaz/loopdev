import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { SuiteSidebar } from './index';
import { MARKETING_STUDIO_SCHEMA } from './fixtures';

describe('SuiteSidebar', () => {
  const renderSidebar = (navMode: 'expanded' | 'rail' | 'hover' = 'expanded') => {
    const onNavModeChange = vi.fn();
    const result = render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode={navMode}
        accessMap={{}}
        onNavModeChange={onNavModeChange}
        onNavigate={vi.fn()}
      />,
    );

    return { ...result, onNavModeChange };
  };

  describe('modos básicos', () => {
    it('muestra las etiquetas en expanded y las oculta en rail', () => {
      const { unmount } = renderSidebar('expanded');
      expect(screen.getByText('Brand Hub')).toBeInTheDocument();
      unmount();

      renderSidebar('rail');
      expect(screen.queryByText('Brand Hub')).not.toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Brand Hub' })).toBeInTheDocument();
    });

    it('expone y activa las tres opciones desde el control', async () => {
      const user = userEvent.setup();
      const { onNavModeChange } = renderSidebar('hover');

      await user.click(screen.getByRole('button', { name: 'Sidebar control' }));
      expect(screen.getByRole('menuitem', { name: 'Expanded' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Expand on hover' })).toBeInTheDocument();

      await user.click(screen.getByRole('menuitem', { name: 'Expanded' }));
      expect(onNavModeChange).toHaveBeenCalledWith('expanded');
    });
  });

  describe('expand on hover', () => {
    it('inicia como rail y expande al entrar al sidebar', () => {
      const { container } = renderSidebar('hover');
      const sidebar = container.querySelector('.sidebar-hover-surface');

      expect(sidebar).toHaveClass('!w-16');
      fireEvent.mouseEnter(sidebar!);
      expect(sidebar).toHaveClass('!w-56');
      expect(screen.getByText('Brand Hub')).toBeInTheDocument();
    });

    it('mantiene el estado expandido mientras el menú portalizado está abierto', async () => {
      const user = userEvent.setup();
      const { container } = renderSidebar('hover');
      const sidebar = container.querySelector('.sidebar-hover-surface');
      const control = screen.getByRole('button', { name: 'Sidebar control' });

      await user.click(control);
      fireEvent.mouseLeave(sidebar!);

      await waitFor(() => expect(sidebar).toHaveClass('!w-56'));
      expect(screen.getByRole('menu', { name: 'Sidebar control' })).toBeInTheDocument();
    });
  });

  describe('dropdown del footer', () => {
    it('expande antes de abrir el selector cuando parte desde rail', async () => {
      const user = userEvent.setup();
      const { container } = renderSidebar('hover');
      const sidebar = container.querySelector('.sidebar-hover-surface');

      await user.click(screen.getByRole('button', { name: 'Sidebar control' }));

      expect(sidebar).toHaveClass('!w-56');
      expect(screen.getByRole('menu', { name: 'Sidebar control' })).toBeInTheDocument();
    });

    it('permite seleccionar un modo y conserva el estado accesible del control', async () => {
      const user = userEvent.setup();
      const { onNavModeChange } = renderSidebar('expanded');
      const control = screen.getByRole('button', { name: 'Sidebar control' });

      expect(control).toHaveAttribute('aria-haspopup', 'menu');
      await user.click(control);
      await user.click(screen.getByRole('menuitem', { name: 'Collapsed' }));

      expect(onNavModeChange).toHaveBeenCalledWith('rail');
    });

    it('restaura el foco al control tras cerrar el menú portalizado', async () => {
      const user = userEvent.setup();
      renderSidebar('expanded');
      const control = screen.getByRole('button', { name: 'Sidebar control' });

      await user.click(control);
      await user.click(screen.getByRole('menuitem', { name: 'Collapsed' }));

      expect(control).toHaveFocus();
    });
  });

  describe('permisos y navegación', () => {
    it('oculta módulos restricted y conserva Suite Dashboard', () => {
      render(
        <SuiteSidebar
          schema={MARKETING_STUDIO_SCHEMA}
          navMode="expanded"
          accessMap={{ 'brand-hub': 'hidden' } as any}
          onNavigate={vi.fn()}
        />,
      );

      expect(screen.getByRole('menuitem', { name: 'Suite Dashboard' })).toBeInTheDocument();
      expect(screen.queryByText('Brand Hub')).not.toBeInTheDocument();
    });

    it('oculta Suite Dashboard solo cuando se desactiva explícitamente', () => {
      render(
        <SuiteSidebar
          schema={MARKETING_STUDIO_SCHEMA}
          navMode="expanded"
          showSuiteHome={false}
          accessMap={{}}
          onNavModeChange={vi.fn()}
          onNavigate={vi.fn()}
        />,
      );

      expect(screen.queryByRole('menuitem', { name: 'Suite Dashboard' })).not.toBeInTheDocument();
      expect(screen.getByText('Brand Hub')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sidebar control' })).toBeInTheDocument();
    });

    it('mantiene el módulo activo con su indicador de página', () => {
      render(
        <SuiteSidebar
          schema={MARKETING_STUDIO_SCHEMA}
          navMode="expanded"
          accessMap={{}}
          onNavigate={vi.fn()}
        />,
      );

      expect(screen.getByRole('menuitem', { name: 'Suite Dashboard' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('marca solo el módulo activo cuando la suite está dentro de un módulo', () => {
      render(
        <SuiteSidebar
          schema={MARKETING_STUDIO_SCHEMA}
          navMode="expanded"
          activeModuleId="brand-hub"
          accessMap={{}}
          onNavigate={vi.fn()}
        />,
      );

      expect(screen.getByRole('menuitem', { name: 'Suite Dashboard' })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('menuitem', { name: 'Brand Hub' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('recupera el indicador al dashboard si el módulo activo queda forbidden', () => {
      render(
        <SuiteSidebar
          schema={MARKETING_STUDIO_SCHEMA}
          navMode="expanded"
          activeModuleId="brand-hub"
          accessMap={{ 'brand-hub': 'forbidden' }}
          onNavigate={vi.fn()}
        />,
      );

      expect(screen.getByRole('menuitem', { name: 'Suite Dashboard' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('menuitem', { name: 'Brand Hub' })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
    });
  });

  describe('accesibilidad', () => {
    it.each(['expanded', 'rail', 'hover'] as const)(
      'no tiene violaciones en modo %s',
      async (navMode) => {
        const { container } = renderSidebar(navMode);
        expect(await axe(container)).toHaveNoViolations();
      },
    );
  });

  it('renders the suite context and hides modules with hidden access', () => {
    render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode="expanded"
        accessMap={{ 'brand-hub': 'hidden' } as any}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByRole('menuitem', { name: 'Suite Dashboard' })).toBeInTheDocument();
    expect(screen.queryByText('Brand Hub')).not.toBeInTheDocument();
    expect(screen.getByText('Suite Dashboard')).toBeInTheDocument();
  });

  it('renders only suite home, navigation and behavior selector', () => {
    render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode="expanded"
        accessMap={{}}
        onNavModeChange={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByRole('menuitem', { name: 'Suite Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sidebar control' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Back to OS' })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Ajustes de cuenta')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Contraer')).not.toBeInTheDocument();
  });

  it('exposes the three sidebar behavior options and selects hover mode', () => {
    const onNavModeChange = vi.fn();

    render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode="hover"
        accessMap={{}}
        onNavModeChange={onNavModeChange}
        onNavigate={vi.fn()}
      />,
    );

    const control = screen.getByRole('button', { name: 'Sidebar control' });
    expect(control).toHaveAttribute('aria-haspopup', 'menu');
    expect(onNavModeChange).not.toHaveBeenCalled();
  });

  it('keeps the behavior control after the flexible navigation region', () => {
    const { container } = render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode="rail"
        accessMap={{}}
        onNavigate={vi.fn()}
      />,
    );

    const sidebar = Array.from(container.querySelectorAll('.flex.h-full.flex-col'))
      .filter((element) => element.querySelector('footer'))
      .at(-1);
    const flexibleNavigation = container.querySelector('.min-h-0.flex-1');
    const footer = container.querySelector('footer');
    expect(sidebar).toHaveClass('flex', 'flex-col');
    expect(sidebar).toContainElement(flexibleNavigation);
    expect(flexibleNavigation).toHaveClass('overflow-y-auto');
    expect(footer?.parentElement).toBe(sidebar);
    expect(footer).toHaveClass('mt-auto', 'shrink-0');
  });

  it('has no accessibility violations in expanded mode', async () => {
    const { container } = render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode="expanded"
        accessMap={{}}
        onNavigate={vi.fn()}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
