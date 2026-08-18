import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SuiteRuntime } from './index';
import { MARKETING_STUDIO_SCHEMA } from '../SuiteSidebar/fixtures';
import type { SuiteConfig } from '@loopdev/contracts';
import { SUITE_SHELL_MODE_PRESETS } from './presets';

const suiteConfig: SuiteConfig = {
  identity: MARKETING_STUDIO_SCHEMA.suite,
  navigation: MARKETING_STUDIO_SCHEMA,
  accessMap: {},
  navMode: 'hidden',
  modules: [
    {
      moduleId: 'overview',
      label: 'Overview',
      route: '/marketing-studio',
      breadcrumbs: ['Marketing Studio'],
      capabilities: ['toolbar'],
    },
    {
      moduleId: 'brand-hub',
      label: 'Brand Hub',
      route: '/marketing-studio/brand-hub',
      breadcrumbs: ['Marketing Studio', 'Brand Hub'],
      capabilities: ['sidebar', 'inspector'],
    },
  ],
};

describe('SuiteRuntime', () => {
  it('exposes certified structural presets for every canvas mode', () => {
    expect(Object.keys(SUITE_SHELL_MODE_PRESETS)).toEqual([
      'overview',
      'data',
      'workspace',
      'split',
      'board',
      'full-bleed',
    ]);
    expect(SUITE_SHELL_MODE_PRESETS.split).toMatchObject({
      canvasGeometry: {
        mode: 'split',
        geometry: 'split',
        columns: 8,
        mobileColumns: 4,
        maxWidth: 'full',
        padding: 'none',
        gap: 'md',
        overflowX: 'hidden',
        overflowY: 'canvas',
      },
      contextSidebarWidth: 'standard',
      contextPanelWidth: 'standard',
      contextPanelPresentation: 'inline',
      contextSidebarHasCollapseControl: true,
    });
    expect(SUITE_SHELL_MODE_PRESETS.board.canvasGeometry).toMatchObject({
      geometry: 'wide',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'wide',
      overflowX: 'zone-only',
    });
    expect(SUITE_SHELL_MODE_PRESETS['full-bleed'].canvasGeometry).toMatchObject({
      geometry: 'full-bleed',
      maxWidth: 'full',
      padding: 'none',
      overflowX: 'hidden',
    });
  });

  it('renders the configured active module through the shared shell', () => {
    render(
      <SuiteRuntime
        config={suiteConfig}
        activeModuleId="brand-hub"
        moduleRenderers={{
          'brand-hub': (module) => <div>{module.label} content</div>,
        }}
        leftSlot={<div>identity</div>}
        centerSlot={<div>search</div>}
        rightSlot={<div>controls</div>}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText('Brand Hub content')).toBeInTheDocument();
    expect(screen.queryByText('Overview content')).not.toBeInTheDocument();
  });

  it('passes the active module geometry preset to SuiteCanvas', () => {
    render(
      <SuiteRuntime
        config={{
          ...suiteConfig,
          modules: suiteConfig.modules.map((module) =>
            module.moduleId === 'brand-hub'
              ? { ...module, shell: { canvasMode: 'board' } }
              : module,
          ),
        }}
        activeModuleId="brand-hub"
        moduleRenderers={{
          'brand-hub': () => <div>Board content</div>,
        }}
        leftSlot={<div>identity</div>}
        centerSlot={<div>search</div>}
        rightSlot={<div>controls</div>}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByRole('region', { name: 'SuiteCanvas' })).toHaveAttribute(
      'data-canvas-geometry-preset',
      'wide',
    );
  });

  it('renders Suite Home content and keeps Suite Dashboard active when no module is selected', () => {
    render(
      <SuiteRuntime
        config={{ ...suiteConfig, navMode: 'expanded' }}
        children={<div>Suite Home content</div>}
        leftSlot={<div>identity</div>}
        centerSlot={<div>search</div>}
        rightSlot={<div>controls</div>}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByRole('menuitem', { name: 'Suite Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('Suite Home content')).toBeInTheDocument();
    expect(screen.queryByText('Overview content')).not.toBeInTheDocument();
  });

  it('renders contextual content only for the active module', () => {
    render(
      <SuiteRuntime
        config={suiteConfig}
        activeModuleId="brand-hub"
        moduleContextRenderers={{
          'brand-hub': (module) => <div>{module.label} context</div>,
          overview: () => <div>Overview context</div>,
        }}
        leftSlot={<div>identity</div>}
        centerSlot={<div>search</div>}
        rightSlot={<div>controls</div>}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByRole('complementary', { name: 'Brand Hub' })).toBeInTheDocument();
    expect(screen.getByText('Brand Hub context')).toBeInTheDocument();
    expect(screen.queryByText('Overview context')).not.toBeInTheDocument();
  });

  it('composes module header and toolbar through the active module shell contract', () => {
    render(
      <SuiteRuntime
        config={{
          ...suiteConfig,
          modules: suiteConfig.modules.map((module) =>
            module.moduleId === 'brand-hub'
              ? { ...module, shell: { canvasMode: 'data', suiteHeader: { visible: true }, suiteToolbar: { visible: true } } }
              : module,
          ),
        }}
        activeModuleId="brand-hub"
        moduleHeaderRenderers={{ 'brand-hub': () => <div>Module header</div> }}
        moduleToolbarRenderers={{ 'brand-hub': () => <div>Module toolbar</div> }}
        leftSlot={<div>identity</div>}
        centerSlot={<div>search</div>}
        rightSlot={<div>controls</div>}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText('Module header')).toBeInTheDocument();
    expect(screen.getByText('Module toolbar')).toBeInTheDocument();
  });

  it('allows runtime visibility overrides for module header and toolbar', () => {
    render(
      <SuiteRuntime
        config={suiteConfig}
        activeModuleId="brand-hub"
        moduleHeaderRenderers={{ 'brand-hub': () => <div>Hidden module header</div> }}
        moduleToolbarRenderers={{ 'brand-hub': () => <div>Hidden module toolbar</div> }}
        moduleHeaderVisibility={{ 'brand-hub': false }}
        moduleToolbarVisibility={{ 'brand-hub': false }}
        leftSlot={<div>identity</div>}
        centerSlot={<div>search</div>}
        rightSlot={<div>controls</div>}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.queryByText('Hidden module header')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden module toolbar')).not.toBeInTheDocument();
  });
});
