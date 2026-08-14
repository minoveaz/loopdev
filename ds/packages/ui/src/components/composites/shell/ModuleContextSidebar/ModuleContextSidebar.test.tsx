import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ModuleContextSidebar } from './index';

describe('ModuleContextSidebar', () => {
  it('renders an accessible optional module context surface', () => {
    render(
      <ModuleContextSidebar label="Table Editor">
        <div>Schema resources</div>
      </ModuleContextSidebar>,
    );

    expect(screen.getByRole('complementary', { name: 'Table Editor' })).toBeInTheDocument();
    expect(screen.getByText('Schema resources')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Table Editor' })).toHaveClass('text-primary');
  });

  it('uses the requested structural width without rounded corners', () => {
    render(
      <ModuleContextSidebar label="Table Editor" width="wide">
        <div>Content</div>
      </ModuleContextSidebar>,
    );

    const sidebar = screen.getByTestId('module-context-sidebar');
    expect(sidebar).toHaveClass('w-72', 'border-r');
    expect(sidebar.className).not.toMatch(/rounded/);
  });

  it('renders an optional footer below the scrollable content', () => {
    render(
      <ModuleContextSidebar label="ModuleContextSidebar" footer={<div>Footer actions</div>}>
        <div>Content region</div>
      </ModuleContextSidebar>,
    );

    expect(screen.getByText('Content region')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
    expect(screen.getByText('Footer actions').parentElement).toHaveClass('border-t');
  });

  it('hides the collapsed rail when the reopen action is delegated to the suite sidebar', () => {
    render(
      <ModuleContextSidebar label="Selection context" collapsed showCollapsedTrigger={false}>
        <div>Selection content</div>
      </ModuleContextSidebar>,
    );

    expect(screen.getByTestId('module-context-sidebar')).toHaveClass('hidden');
  });

  it('keeps the collapsed rail when the module owns its reopen trigger', () => {
    render(
      <ModuleContextSidebar label="Selection context" collapsed showCollapsedTrigger>
        <div>Selection content</div>
      </ModuleContextSidebar>,
    );

    expect(screen.getByTestId('module-context-sidebar')).toHaveClass('w-14');
  });
});
