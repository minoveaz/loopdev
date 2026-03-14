import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { UnifiedInspector } from './UnifiedInspector';
import { InspectorContext } from '@/types/inspector';

describe('UnifiedInspector', () => {
  const mockContext: InspectorContext = {
    scope: 'entity',
    mode: 'read',
    intent: 'inspect',
    entity: {
      moduleId: 'test-module',
      type: 'test.type',
      id: 'test-id',
      name: 'Test Entity'
    },
    permissions: {
      canEdit: true,
      canApprove: false,
      canPublish: false,
      canOverride: false
    }
  };

  it('renders correctly when open', () => {
    render(
      <UnifiedInspector 
        isOpen={true} 
        onClose={() => {}} 
        context={mockContext}
      >
        <div>Inspector Content</div>
      </UnifiedInspector>
    );

    // Use getAllByText because it appears in header and context area
    expect(screen.getAllByText('Test Entity').length).toBeGreaterThan(0);
    expect(screen.getByText('TEST.TYPE')).toBeDefined();
    expect(screen.getByText('Inspector Content')).toBeDefined();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <UnifiedInspector 
        isOpen={true} 
        onClose={onClose} 
        context={mockContext}
      />
    );

    // The close button has aria-label="Cerrar panel" based on the error log output
    const closeButton = screen.getByRole('button', { name: /cerrar panel/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('changes tabs correctly', () => {
    const onTabChange = vi.fn();
    render(
      <UnifiedInspector 
        isOpen={true} 
        onClose={() => {}} 
        context={mockContext}
        onTabChange={onTabChange}
      />
    );

    // UnifiedInspector renders tabs as buttons
    const impactTab = screen.getByRole('button', { name: /Impact/i });
    fireEvent.click(impactTab);
    expect(onTabChange).toHaveBeenCalledWith('impact');
  });

  it('renders governance footer when intent requires it', () => {
    const govContext: InspectorContext = {
      ...mockContext,
      intent: 'request-approval'
    };

    render(
      <UnifiedInspector 
        isOpen={true} 
        onClose={() => {}} 
        context={govContext}
      />
    );

    expect(screen.getByText('Confirm Decision')).toBeDefined();
  });
});