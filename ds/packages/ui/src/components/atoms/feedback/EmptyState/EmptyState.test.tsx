import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './index';

describe('EmptyState Primitive', () => {
  
  it('Story 1: renders title and description correctly', () => {
    render(<EmptyState title="System Empty" description="No data found" />);
    expect(screen.getByText('System Empty')).toBeInTheDocument();
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('Story 5: activates AI Mode and renders AILoader when isLoading is true', () => {
    render(
      <EmptyState 
        title="Thinking" 
        description="Static text" 
        isLoading={true} 
        loadingMessages={['AI is thinking...']}
      />
    );
    
    // Check if title has innovation purple color
    const title = screen.getByText('Thinking');
    expect(title.className).toContain('text-innovation-purple');
    
    // Should NOT show static description, but the loader components
    expect(screen.queryByText('Static text')).not.toBeInTheDocument();
    
    // Check for multiple brackets (one set for AI visual, one set for terminal loader)
    const brackets = screen.getAllByText('{');
    expect(brackets.length).toBeGreaterThanOrEqual(2);
  });

  it('Story 3: handles Stress Scenario: Narrative Overload', () => {
    const longDesc = 'A'.repeat(1000);
    render(<EmptyState title="Stress" description={longDesc} />);
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });

  it('Story 2: renders action and badge correctly', () => {
    render(
      <EmptyState 
        title="Action" 
        description="Desc" 
        iconBadge="+"
        action={<button>Create</button>} 
      />
    );
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('Story 4: handles Scalability Match (sizes and ghost variant)', () => {
    const { rerender, container } = render(<EmptyState title="T" description="D" size="sm" />);
    let wrapper = container.firstChild as HTMLElement;
    // Check sm padding (p-8)
    expect(wrapper.className).toContain('p-8');

    rerender(<EmptyState title="T" description="D" variant="ghost" />);
    wrapper = container.firstChild as HTMLElement;
    // Ghost variant should not have border or card background
    expect(wrapper.className).toContain('bg-transparent');
    expect(wrapper.className).not.toContain('bg-white');
  });

});
