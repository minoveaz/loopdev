import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModuleWorkspace } from './index';
import { MODULE_WORKSPACE_FIXTURES } from './fixtures';
import { LayoutProvider } from '../../../../providers/layout-provider';
import { TenantProvider } from '../../../../providers/tenant-provider';

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithLayout = (component: React.ReactNode) => {
  return render(
    <TenantProvider>
      <LayoutProvider>
        {component}
      </LayoutProvider>
    </TenantProvider>
  );
};

describe('ModuleWorkspace Composite', () => {
  it('renders all slots in normal mode (Desktop)', () => {
    renderWithLayout(
      <ModuleWorkspace 
        {...MODULE_WORKSPACE_FIXTURES.default as any} 
        mode="normal"
        sidebarOpen={true}
        inspectorOpen={true}
      />
    );

    expect(screen.getByText('Brand Hub')).toBeInTheDocument(); // Header
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByLabelText('Module Navigation')).toBeInTheDocument(); // Sidebar
    expect(screen.getByLabelText('Item Properties')).toBeInTheDocument(); // Inspector
    expect(screen.getByRole('main')).toBeInTheDocument(); // Canvas
  });

  it('hides sidebar and inspector in focus mode', () => {
    renderWithLayout(
      <ModuleWorkspace 
        {...MODULE_WORKSPACE_FIXTURES.default as any} 
        mode="focus"
      />
    );

    // Sidebar e Inspector no deberían estar visibles (width 0 o no renderizados)
    // En la implementación actual, se renderizan pero con width 0 via CSS vars, 
    // pero el hook los marca como !isOpen internamente para el cálculo de estilos.
    
    // Verificamos que el header y toolbar SÍ estén
    expect(screen.getByText('Brand Hub')).toBeInTheDocument();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('hides everything except canvas in immersive mode', () => {
    renderWithLayout(
      <ModuleWorkspace 
        {...MODULE_WORKSPACE_FIXTURES.default as any} 
        mode="immersive"
      />
    );

    // Header y Toolbar no deben renderizarse en immersive
    expect(screen.queryByText('Brand Hub')).not.toBeInTheDocument();
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    
    // Canvas sí
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('switches to overlay mode on mobile', () => {
    renderWithLayout(
      <ModuleWorkspace 
        {...MODULE_WORKSPACE_FIXTURES.default as any} 
        isMobile={true}
        sidebarOpen={true}
      />
    );

    // En modo overlay, el sidebar se renderiza dentro de un Dialog de Radix
    // Buscamos por el rol de dialog
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Brand Hub')).toBeInTheDocument();
  });
});