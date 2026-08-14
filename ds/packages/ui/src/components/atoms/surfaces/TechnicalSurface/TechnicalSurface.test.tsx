import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TechnicalSurface } from './index';

describe('TechnicalSurface', () => {
  it('renders content and applies configured visual classes', () => {
    const { container } = render(
      <TechnicalSurface variant="glass" depth="overlay" overflow="visible">
        <span>Technical payload</span>
      </TechnicalSurface>,
    );

    expect(screen.getByText('Technical payload')).toBeInTheDocument();
    const root = container.firstElementChild;
    expect(root).toHaveClass('backdrop-blur-md');
    expect(root).toHaveClass('shadow-2xl');
    expect(root).toHaveClass('overflow-visible');
  });

  it('renders optional grid and hover aura layers', () => {
    const { container } = render(
      <TechnicalSurface withGrid withHoverAura>
        <span>Layered</span>
      </TechnicalSurface>,
    );

    expect(container.querySelector('[style*="linear-gradient"]')).toBeInTheDocument();
    expect(container.innerHTML).toContain('blur-[60px]');
  });

  it('applies semantic radius, border tone and border width', () => {
    const { container } = render(
      <TechnicalSurface radius="sm" border="strong" borderWidth="medium">
        <span>Styled surface</span>
      </TechnicalSurface>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('rounded-sm');
    expect(root).toHaveClass('border-slate-400');
    expect(root).toHaveClass('border-2');
  });

  it('calls onClick handler when surface is interactive', () => {
    const onClick = vi.fn();
    render(
      <TechnicalSurface onClick={onClick}>
        <span>Clickable</span>
      </TechnicalSurface>,
    );

    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <TechnicalSurface>
        <span>A11y</span>
      </TechnicalSurface>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
