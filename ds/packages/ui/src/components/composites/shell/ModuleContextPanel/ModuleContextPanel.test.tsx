import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ModuleContextPanel } from './index';

describe('ModuleContextPanel', () => {
  it('renders an accessible right-side module context surface', () => {
    render(
      <ModuleContextPanel label="ModuleContextPanel">
        <div>Module details</div>
      </ModuleContextPanel>,
    );

    expect(screen.getByRole('complementary', { name: 'ModuleContextPanel' })).toBeInTheDocument();
    expect(screen.getByText('Module details')).toBeInTheDocument();
  });

  it('uses a left border and keeps the footer separate from scrolling content', () => {
    render(
      <ModuleContextPanel label="ModuleContextPanel" width="wide" footer={<div>Panel actions</div>}>
        <div>Content</div>
      </ModuleContextPanel>,
    );

    const panel = screen.getByTestId('module-context-panel');
    expect(panel).toHaveClass('w-80', 'border-l');
    expect(panel.className).not.toMatch(/rounded/);
    expect(screen.getByText('Panel actions').parentElement).toHaveClass('border-t');
  });
});
