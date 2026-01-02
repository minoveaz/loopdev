import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LogoSpinner } from './index';

describe('LogoSpinner Primitive', () => {
  
  it('renders correctly with default props', () => {
    render(<LogoSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'LoopDev Generative System Processing');
  });

  it('calculates size correctly based on semantic props', () => {
    const { container } = render(<LogoSpinner size="xl" />);
    const wrapper = container.firstChild as HTMLElement;
    // XL is 64px based on useLogoSpinner.ts
    expect(wrapper.style.width).toBe('64px');
  });

  it('applies custom className', () => {
    render(<LogoSpinner className="custom-test-class" />);
    const spinner = screen.getByRole('status');
    expect(spinner.className).toContain('custom-test-class');
  });

  it('renders the SVG paths', () => {
    const { container } = render(<LogoSpinner />);
    const paths = container.querySelectorAll('path');
    // We expect at least two paths: Ghost and Momentum
    expect(paths.length).toBe(2);
  });

  it('handles extreme scaling (micro and macro sizes)', () => {
    const { rerender, container } = render(<LogoSpinner size={8} />);
    let wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('8px');

    rerender(<LogoSpinner size={800} />);
    wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('800px');
  });

});
