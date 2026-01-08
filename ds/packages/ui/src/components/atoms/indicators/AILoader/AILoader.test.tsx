import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AILoader } from './index';

describe('AILoader Primitive', () => {
  
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders brackets and starts typing', () => {
    render(<AILoader messages={['Test']} />);
    
    // Check brackets
    expect(screen.getByText('{')).toBeInTheDocument();
    expect(screen.getByText('}')).toBeInTheDocument();
    
    // Advance timers character by character to ensure state updates are captured
    for (let i = 0; i < 4; i++) {
      act(() => {
        vi.advanceTimersByTime(100); // 80ms is default type speed
      });
    }
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applies the innovation purple color to brackets', () => {
    render(<AILoader />);
    const brackets = screen.getAllByText(/[\{\}]/);
    brackets.forEach(bracket => {
      expect(bracket.className).toContain('text-innovation-purple');
    });
  });

  it('shows cursor by default', () => {
    const { container } = render(<AILoader />);
    const cursor = container.querySelector('.bg-energy');
    expect(cursor).toBeInTheDocument();
  });

  it('hides cursor when showCursor is false', () => {
    const { container } = render(<AILoader showCursor={false} />);
    const cursor = container.querySelector('.bg-energy');
    expect(cursor).not.toBeInTheDocument();
  });

  it('handles stress content (very long strings) without crashing', () => {
    const longMessage = 'A'.repeat(500); // 500 characters
    render(<AILoader messages={[longMessage]} />);
    
    act(() => {
      vi.advanceTimersByTime(5000); // Wait for some typing
    });
    
    // We don't check for full text because typing is progressive, 
    // but we ensure it's rendering something from that long string
    expect(screen.getByText(/A+/)).toBeInTheDocument();
  });

});