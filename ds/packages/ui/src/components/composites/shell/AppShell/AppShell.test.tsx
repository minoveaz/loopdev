import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppShell } from './index';

describe('AppShell Industrial Certification - v1.1 Refined (🔵🔵)', () => {
  const mockSlots = {
    nav: <div data-testid="nav-slot">Navigation</div>,
    header: <div data-testid="header-slot">Header</div>,
    content: <div data-testid="content-slot">Main Content</div>,
    context: <div data-testid="context-slot">Context Panel</div>,
    footer: <div data-testid="footer-slot">Status Bar</div>,
    banner: <div data-testid="banner-slot">System Banner</div>,
    overlay: <div data-testid="overlay-slot">Overlay Content</div>,
  };

  // CATEGORÍA 1: ESTRUCTURA Y MODOS
  it('US-LAYOUT-01: renders nav tag for global navigation and aside for context', () => {
    render(
      <AppShell
        navSlot={mockSlots.nav}
        headerSlot={mockSlots.header}
        contextSlot={mockSlots.context}
      >
        {mockSlots.content}
      </AppShell>,
    );

    expect(screen.getByRole('navigation', { name: /global navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: /context panel/i })).toBeInTheDocument();
  });

  it('US-LAYOUT-02: respects navBehavior="hidden"', () => {
    const { container } = render(
      <AppShell
        navSlot={mockSlots.nav}
        headerSlot={mockSlots.header}
        config={{ navBehavior: 'hidden' }}
      >
        {mockSlots.content}
      </AppShell>,
    );

    const nav = container.querySelector('#app-shell-nav');
    expect(nav).not.toBeInTheDocument();

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--app-shell-nav-width')).toBe('0px');
  });

  // CATEGORÍA 6: ACCESIBILIDAD Y TOPMOST
  it('US-A11Y-04: closes only the topmost panel when Escape is pressed (Context priority)', () => {
    const onCloseNav = vi.fn();
    const onCloseContext = vi.fn();

    render(
      <AppShell
        navSlot={mockSlots.nav}
        headerSlot={mockSlots.header}
        contextSlot={mockSlots.context}
        config={{ isLeftSidebarOpen: true, isRightSidebarOpen: true }}
        onRequestCloseNav={onCloseNav}
        onRequestCloseContext={onCloseContext}
      >
        {mockSlots.content}
      </AppShell>,
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    // Debería intentar cerrar el contexto primero
    expect(onCloseContext).toHaveBeenCalledWith('escape');
    expect(onCloseNav).not.toHaveBeenCalled();
  });

  it('US-A11Y-05: backdrop closes the correct active panel based on hierarchy', () => {
    const onCloseNav = vi.fn();
    const onCloseContext = vi.fn();

    // Escenario: Ambos abiertos -> cierra context
    const { rerender } = render(
      <AppShell
        navSlot={mockSlots.nav}
        headerSlot={mockSlots.header}
        contextSlot={mockSlots.context}
        config={{ isLeftSidebarOpen: true, isRightSidebarOpen: true }}
        onRequestCloseNav={onCloseNav}
        onRequestCloseContext={onCloseContext}
      >
        {mockSlots.content}
      </AppShell>,
    );

    fireEvent.click(screen.getByRole('presentation', { hidden: true }));
    expect(onCloseContext).toHaveBeenCalledWith('backdrop');

    // Escenario: Solo Nav abierto
    rerender(
      <AppShell
        key="nav-open"
        navSlot={mockSlots.nav}
        headerSlot={mockSlots.header}
        contextSlot={mockSlots.context}
        config={{ isLeftSidebarOpen: true, isRightSidebarOpen: false }}
        onRequestCloseNav={onCloseNav}
        onRequestCloseContext={onCloseContext}
      >
        {mockSlots.content}
      </AppShell>,
    );
    fireEvent.click(screen.getByRole('presentation', { hidden: true }));
    expect(onCloseNav).toHaveBeenCalledWith('backdrop');
  });

  // CATEGORÍA 7: DENSIDAD E INDUSTRIALIZACIÓN
  it('US-STRESS-05: applies compact tokens when density is set', () => {
    const { container } = render(
      <AppShell headerSlot={mockSlots.header} config={{ density: 'compact' }}>
        {mockSlots.content}
      </AppShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--app-shell-header-height')).toBe('var(--lpd-space-12)');
    expect(wrapper.style.getPropertyValue('--app-shell-main-padding')).toBe('var(--lpd-space-4)');
  });

  it('US-SHELL-STATE-01: initializes with correct open/closed states from config', () => {
    const { container } = render(
      <AppShell
        navSlot={mockSlots.nav}
        headerSlot={mockSlots.header}
        config={{ isLeftSidebarOpen: false }}
      >
        {mockSlots.content}
      </AppShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--app-shell-nav-width')).toBe('var(--lpd-space-16)');
  });

  it('US-A11Y-06: exposes a mobile navigation toggle with state semantics', () => {
    const onToggle = vi.fn();

    render(
      <AppShell
        navSlot={mockSlots.nav}
        headerSlot={mockSlots.header}
        onToggleLeftSidebar={onToggle}
        config={{ isLeftSidebarOpen: false }}
      >
        {mockSlots.content}
      </AppShell>,
    );

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'app-shell-nav');

    fireEvent.click(toggle);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('US-MOBILE-01: renders persistent mobile navigation with accessible label', () => {
    render(
      <AppShell
        headerSlot={mockSlots.header}
        mobileBottomSlot={<div data-testid="mobile-bottom-slot">Quick actions</div>}
      >
        {mockSlots.content}
      </AppShell>,
    );

    expect(screen.getByRole('navigation', { name: 'Mobile suite navigation' })).toContainElement(
      screen.getByTestId('mobile-bottom-slot'),
    );
  });
});
