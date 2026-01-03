import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppShell } from './index';

describe('AppShell Industrial Certification - Parity 1:1 (🔵🔵)', () => {
  
  const mockSlots = {
    nav: <div data-testid="nav-slot">Navigation</div>,
    header: <div data-testid="header-slot">Header</div>,
    content: <div data-testid="content-slot">Main Content</div>,
    context: <div data-testid="context-slot">Context Panel</div>,
    footer: <div data-testid="footer-slot">Status Bar</div>,
    banner: <div data-testid="banner-slot">System Banner</div>,
    overlay: <div data-testid="overlay-slot">Overlay Content</div>,
  };

  // CATEGORÍA 1: ESTRUCTURA Y NAVEGACIÓN
  it('US-LAYOUT-01: renders all 4 primary slots with correct ARIA landmarks', () => {
    render(
      <AppShell 
        navSlot={mockSlots.nav}
        headerSlot={mockSlots.header}
        contextSlot={mockSlots.context}
        footerSlot={mockSlots.footer}
      >
        {mockSlots.content}
      </AppShell>
    );

    expect(screen.getByRole('navigation', { name: /global navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: /context panel/i })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('US-LAYOUT-02: updates CSS variables and state for collapsible sidebar', () => {
    const { container, rerender } = render(
      <AppShell navSlot={mockSlots.nav} headerSlot={mockSlots.header} config={{ isLeftSidebarOpen: true }}>
        {mockSlots.content}
      </AppShell>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--app-shell-nav-width')).toBe('var(--lpd-space-64)');

    rerender(
      <AppShell navSlot={mockSlots.nav} headerSlot={mockSlots.header} config={{ isLeftSidebarOpen: false }}>
        {mockSlots.content}
      </AppShell>
    );
    expect(wrapper.style.getPropertyValue('--app-shell-nav-width')).toBe('var(--lpd-space-16)');
  });

  // CATEGORÍA 2: ESCENARIOS DE ESTRÉS
  it('US-STRESS-02: handles context panel visibility and push behavior tokens', () => {
    const { rerender, container } = render(
      <AppShell contextSlot={mockSlots.context} headerSlot={mockSlots.header} config={{ isRightSidebarOpen: true }}>
        {mockSlots.content}
      </AppShell>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--app-shell-context-width')).toBe('var(--lpd-space-80)');

    rerender(
      <AppShell contextSlot={mockSlots.context} headerSlot={mockSlots.header} config={{ isRightSidebarOpen: false }}>
        {mockSlots.content}
      </AppShell>
    );
    expect(wrapper.style.getPropertyValue('--app-shell-context-width')).toBe('var(--lpd-space-0)');
  });

  it('US-STRESS-04: supports complex slot composition without breakage', () => {
    render(
      <AppShell 
        headerSlot={mockSlots.header} 
        bannerSlot={mockSlots.banner}
        overlaySlot={mockSlots.overlay}
      >
        {mockSlots.content}
      </AppShell>
    );
    expect(screen.getByTestId('banner-slot')).toBeInTheDocument();
    expect(screen.getByTestId('overlay-slot')).toBeInTheDocument();
  });

  // CATEGORÍA 3: ACCESIBILIDAD Y UX
  it('US-A11Y-02: applies technical scrollbar classes to all scrollable areas', () => {
    const { container } = render(
      <AppShell navSlot={mockSlots.nav} headerSlot={mockSlots.header}>
        {mockSlots.content}
      </AppShell>
    );
    const scrollAreas = container.querySelectorAll('.custom-scrollbar');
    expect(scrollAreas.length).toBeGreaterThanOrEqual(2);
  });

  // CATEGORÍA 4: MULTI-TENANCY Y ESTADO
  it('US-TENANT-01: triggers state handlers when backdrop is interacted with', () => {
    const onToggleNav = vi.fn();
    render(
      <AppShell 
        navSlot={mockSlots.nav} 
        headerSlot={mockSlots.header} 
        config={{ isLeftSidebarOpen: true }}
        onToggleLeftSidebar={onToggleNav}
      />
    );

    const backdrop = screen.getByRole('presentation', { hidden: true });
    fireEvent.click(backdrop);
    expect(onToggleNav).toHaveBeenCalled();
  });

  it('US-TENANT-02: maintains structural integrity with global system banners', () => {
    render(
      <AppShell headerSlot={mockSlots.header} bannerSlot={mockSlots.banner}>
        {mockSlots.content}
      </AppShell>
    );
    const banner = screen.getByTestId('banner-slot');
    const header = screen.getByRole('banner');
    expect(banner.compareDocumentPosition(header)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  // CATEGORÍA 5: PERSISTENCIA
  it('US-SHELL-STATE-01: initializes with correct open/closed states from config', () => {
    const { container } = render(
      <AppShell navSlot={mockSlots.nav} headerSlot={mockSlots.header} config={{ isLeftSidebarOpen: false }}>
        {mockSlots.content}
      </AppShell>
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--app-shell-nav-width')).toBe('var(--lpd-space-16)');
  });

});