import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ModuleWorkspace } from '..';

describe('ModuleWorkspace: Composition (Slots)', () => {

  it('should render children content correctly', () => {
    render(
      <ModuleWorkspace moduleId="test-module">
        <div>Child Content</div>
      </ModuleWorkspace>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render header and toolbar slots when provided', () => {
    render(
      <ModuleWorkspace 
        moduleId="test-module"
        headerSlot={<div>Header Slot</div>}
        toolbarSlot={<div>Toolbar Slot</div>}
      >
        <div>Child Content</div>
      </ModuleWorkspace>
    );
    expect(screen.getByText('Header Slot')).toBeInTheDocument();
    expect(screen.getByText('Toolbar Slot')).toBeInTheDocument();
  });

  it('should render sidebar and inspector slots when provided and open', () => {
    render(
      <ModuleWorkspace 
        moduleId="test-module"
        sidebarSlot={<div>Sidebar Slot</div>}
        inspectorSlot={<div>Inspector Slot</div>}
        sidebarOpen={true}
        inspectorOpen={true}
      >
        <div>Child Content</div>
      </ModuleWorkspace>
    );
    expect(screen.getByText('Sidebar Slot')).toBeInTheDocument();
    expect(screen.getByText('Inspector Slot')).toBeInTheDocument();
  });

  it('should not break if slots are null or undefined', () => {
    const { rerender } = render(
      <ModuleWorkspace 
        moduleId="test-module"
        headerSlot={null}
        sidebarSlot={undefined}
      >
        <div>Child Content</div>
      </ModuleWorkspace>
    );
    
    // Check that it doesn't crash and still renders children
    expect(screen.getByText('Child Content')).toBeInTheDocument();

    // Rerender with all slots null to be sure
    rerender(
      <ModuleWorkspace 
        moduleId="test-module"
        headerSlot={null}
        toolbarSlot={null}
        sidebarSlot={null}
        inspectorSlot={null}
      >
        <div>New Child Content</div>
      </ModuleWorkspace>
    );
    expect(screen.getByText('New Child Content')).toBeInTheDocument();
  });

});
