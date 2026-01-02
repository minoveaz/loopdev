import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Skeleton } from './index';
import { TextSkeleton } from './components';

describe('Skeleton Primitive', () => {
  
  it('Story 1: renders the base structural shape', () => {
    render(<Skeleton variant="rect" width={100} height={50} />);
    const skeleton = screen.getByRole('presentation', { hidden: true });
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.className).toContain('rounded-md');
  });

  it('Story 2: applies the shimmer animation by default', () => {
    const { container } = render(<Skeleton animation="shimmer" />);
    // Buscamos el elemento hijo que tiene el gradiente (el overlay)
    const shimmer = container.firstChild?.firstChild as HTMLElement;
    expect(shimmer).toBeInTheDocument();
    expect(shimmer.className).toContain('bg-gradient-to-r');
  });

  it('Story 3: renders multiple lines in TextSkeleton with a shorter last line', () => {
    const { container } = render(<TextSkeleton lines={3} />);
    const lines = container.querySelectorAll('.rounded-sm');
    expect(lines.length).toBe(3);
    
    const lastLine = lines[2] as HTMLElement;
    expect(lastLine.style.width).toBe('65%');
  });

  it('Story 6: implements aria-hidden for accessibility silence', () => {
    render(<Skeleton />);
    const skeleton = screen.getByRole('presentation', { hidden: true });
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('Story 7: reacts to variant-specific border radius', () => {
    render(<Skeleton variant="circle" />);
    const skeleton = screen.getByRole('presentation', { hidden: true });
    expect(skeleton.className).toContain('rounded-full');
  });

});