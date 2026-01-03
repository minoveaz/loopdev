import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ModuleWorkspace } from '..';

describe('ModuleWorkspace: Industrial Certification', () => {

  it('should render correct moduleId as a data attribute for telemetry', () => {
    render(
      <ModuleWorkspace moduleId="certified-id-123">
        <div>Content</div>
      </ModuleWorkspace>
    );
    const section = screen.getByLabelText('Module certified-id-123');
    expect(section).toHaveAttribute('data-module-id', 'certified-id-123');
  });

  it('should correctly handle sidebar visibility in desktop mode', () => {
    render(
      <ModuleWorkspace 
        moduleId="test"
        sidebarSlot={<div data-testid="sidebar">Sidebar</div>}
        sidebarOpen={true}
      >
        <div>Content</div>
      </ModuleWorkspace>
    );
    expect(screen.getByTestId('sidebar')).toBeVisible();
  });

  it('should hide sidebar when open is false in desktop mode', () => {
    const { container } = render(
      <ModuleWorkspace 
        moduleId="test"
        sidebarSlot={<div data-testid="sidebar">Sidebar</div>}
        sidebarOpen={false}
      >
        <div>Content</div>
      </ModuleWorkspace>
    );
    // In our implementation, we use visibility and width for push mode
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('invisible');
  });

});