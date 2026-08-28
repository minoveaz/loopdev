import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SuiteCanvas } from './index';
import { SUITE_SHELL_MODE_PRESETS } from '../../shell/SuiteRuntime';

describe('SuiteCanvas', () => {
  it('renders the selected semantic mode and module content', () => {
    render(
      <SuiteCanvas mode="split">
        <div>Module content</div>
      </SuiteCanvas>,
    );

    expect(screen.getByRole('region', { name: 'SuiteCanvas' })).toHaveAttribute(
      'data-canvas-mode',
      'split',
    );
    expect(screen.getByRole('region', { name: 'SuiteCanvas' })).toHaveAttribute(
      'data-canvas-geometry',
      'split',
    );
    expect(screen.getByText('Module content')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'SuiteCanvas' }).querySelector('main')).toBeNull();
  });

  it('exposes the supplied geometry preset without applying layout ownership locally', () => {
    render(
      <SuiteCanvas
        mode="board"
        geometryPreset={SUITE_SHELL_MODE_PRESETS.board.canvasGeometry}
      >
        <div>Board content</div>
      </SuiteCanvas>,
    );

    expect(screen.getByRole('region', { name: 'SuiteCanvas' })).toHaveAttribute(
      'data-canvas-geometry-preset',
      'wide',
    );
  });

  it('applies the board geometry contract to the central content zone', () => {
    render(
      <SuiteCanvas
        mode="board"
        geometryPreset={SUITE_SHELL_MODE_PRESETS.board.canvasGeometry}
      >
        <div>Board content</div>
      </SuiteCanvas>,
    );

    const canvas = screen.getByRole('region', { name: 'SuiteCanvas' });
    const content = canvas.querySelector('.suite-canvas__content');
    expect(canvas).toHaveAttribute('data-canvas-columns', '12');
    expect(canvas).toHaveAttribute('data-canvas-mobile-columns', '4');
    expect(canvas).toHaveAttribute('data-canvas-overflow-x', 'zone-only');
    expect(content).toHaveClass('grid-cols-12', 'max-lg:grid-cols-4', 'overflow-x-auto');
  });

  it('applies full-bleed geometry without bounded width or exterior padding', () => {
    render(
      <SuiteCanvas
        mode="full-bleed"
        geometryPreset={SUITE_SHELL_MODE_PRESETS['full-bleed'].canvasGeometry}
      >
        <div>Workflow content</div>
      </SuiteCanvas>,
    );

    const canvas = screen.getByRole('region', { name: 'SuiteCanvas' });
    const content = canvas.querySelector('.suite-canvas__content');
    expect(canvas).toHaveAttribute('data-canvas-geometry-preset', 'full-bleed');
    expect(content).toHaveClass('max-w-none', 'p-0', 'overflow-x-hidden');
    expect(content).not.toHaveClass('max-w-7xl', 'px-4', 'sm:px-6');
  });

  it.each([
    ['overview', 12, '4', 'bounded', 'comfortable', 'hidden'],
    ['data', 12, '4', 'bounded', 'comfortable', 'hidden'],
    ['workspace', 12, '4', 'bounded', 'comfortable', 'hidden'],
    ['split', 8, '4', 'full', 'none', 'hidden'],
    ['board', 12, '4', 'wide', 'comfortable', 'zone-only'],
    ['full-bleed', 12, '4', 'full', 'none', 'hidden'],
  ] as const)('exposes the complete geometry matrix for %s', (mode, columns, mobileColumns, maxWidth, padding, overflowX) => {
    render(
      <SuiteCanvas
        mode={mode}
        geometryPreset={SUITE_SHELL_MODE_PRESETS[mode].canvasGeometry}
      >
        <div>{mode} content</div>
      </SuiteCanvas>,
    );

    const canvas = screen.getByRole('region', { name: 'SuiteCanvas' });
    expect(canvas).toHaveAttribute('data-canvas-columns', String(columns));
    expect(canvas).toHaveAttribute('data-canvas-mobile-columns', mobileColumns);
    expect(canvas).toHaveAttribute('data-canvas-padding', padding);
    expect(canvas).toHaveAttribute('data-canvas-overflow-x', overflowX);
    expect(canvas.querySelector('.suite-canvas__content')).toHaveClass('min-w-0', 'overflow-y-auto');
  });

  it('keeps horizontal overflow inside the board content zone and preserves canvas scroll bounds', () => {
    render(
      <SuiteCanvas
        mode="board"
        geometryPreset={SUITE_SHELL_MODE_PRESETS.board.canvasGeometry}
        contextAside={<aside>Context navigation</aside>}
        aside={<div>Context details</div>}
      >
        <div>Board content</div>
      </SuiteCanvas>,
    );

    const canvas = screen.getByRole('region', { name: 'SuiteCanvas' });
    const body = canvas.querySelector('.suite-canvas__body');
    const content = canvas.querySelector('.suite-canvas__content');
    expect(canvas).toHaveClass('min-w-0', 'overflow-hidden');
    expect(body).toHaveClass('min-w-0', 'overflow-hidden');
    expect(content).toHaveClass('min-w-0', 'overflow-x-auto', 'overflow-y-auto');
  });

  it('renders optional structural regions without owning their content', () => {
    render(
      <SuiteCanvas
        mode="workspace"
        header={<div>Module header</div>}
        toolbar={<div>Module toolbar</div>}
        localNav={<div>Local navigation</div>}
        tabs={<div>Workspace tabs</div>}
        contextAside={<aside>Context navigation</aside>}
        aside={<div>Context details</div>}
        footer={<div>Module footer</div>}
      >
        <div>Main content</div>
      </SuiteCanvas>,
    );

    expect(screen.getByText('Module header')).toBeInTheDocument();
    expect(screen.getByText('Module toolbar')).toBeInTheDocument();
    expect(screen.getByText('Local navigation')).toBeInTheDocument();
    expect(screen.getByText('Workspace tabs')).toBeInTheDocument();
    expect(screen.getByText('Context navigation')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Context details')).toBeInTheDocument();
    expect(screen.getByText('Module footer')).toBeInTheDocument();
  });

  it('defaults to overview when no mode is provided', () => {
    render(
      <SuiteCanvas>
        <div>Overview content</div>
      </SuiteCanvas>,
    );

    expect(screen.getByRole('region', { name: 'SuiteCanvas' })).toHaveAttribute(
      'data-canvas-mode',
      'overview',
    );
  });

  it.each(['overview', 'data', 'workspace', 'split', 'board', 'full-bleed'] as const)(
    'supports the declared %s mode without changing ownership of content',
    (mode) => {
      render(
        <SuiteCanvas mode={mode}>
          <div>{mode} content</div>
        </SuiteCanvas>,
      );

      expect(screen.getByRole('region', { name: 'SuiteCanvas' })).toHaveAttribute(
        'data-canvas-mode',
        mode,
      );
      expect(screen.getByText(`${mode} content`)).toBeInTheDocument();
    },
  );

  it.each([
    ['overview', 'bounded'],
    ['data', 'bounded'],
    ['workspace', 'bounded'],
    ['split', 'split'],
    ['board', 'wide'],
    ['full-bleed', 'full-bleed'],
  ] as const)('exposes the canonical %s geometry as %s', (mode, geometry) => {
    render(
      <SuiteCanvas mode={mode}>
        <div>{mode} content</div>
      </SuiteCanvas>,
    );

    expect(screen.getByRole('region', { name: 'SuiteCanvas' })).toHaveAttribute(
      'data-canvas-geometry',
      geometry,
    );
  });
});
