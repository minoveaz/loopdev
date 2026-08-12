import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SuiteCanvas } from './index';

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
    expect(screen.getByText('Module content')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'SuiteCanvas' }).querySelector('main')).toBeNull();
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
});
