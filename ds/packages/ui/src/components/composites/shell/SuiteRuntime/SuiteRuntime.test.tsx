import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SuiteRuntime } from './index';
import { MARKETING_STUDIO_SCHEMA } from '../SuiteSidebar/fixtures';
import type { SuiteConfig } from '@loopdev/contracts';

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

  it('keeps Suite Dashboard active when no module is selected', () => {
    render(
      <SuiteRuntime
        config={{ ...suiteConfig, navMode: 'expanded' }}
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
        moduleContextWidths={{ 'brand-hub': 'wide' }}
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
});
