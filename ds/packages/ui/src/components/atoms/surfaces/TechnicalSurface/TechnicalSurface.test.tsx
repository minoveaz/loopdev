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
    expect(root).toHaveClass('dark:bg-surface-dark');
    expect(root).toHaveClass('shadow-2xl');
    expect(root).toHaveClass('overflow-visible');
    expect(root).toHaveAttribute('data-surface-variant', 'glass');
    expect(root).toHaveAttribute('data-surface-depth', 'overlay');
    expect(root).toHaveAttribute('data-surface-overflow', 'visible');
    expect(root?.firstElementChild).toHaveClass('h-full', 'min-h-0');
  });

  it('renders optional grid and hover aura layers', () => {
    const { container } = render(
      <TechnicalSurface withGrid withHoverAura>
        <span>Layered</span>
      </TechnicalSurface>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
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

  it('exposes the explicit interaction contract without changing static surfaces', () => {
    const { container, rerender } = render(<TechnicalSurface interaction="interactive">Interactive</TechnicalSurface>);
    expect(container.firstElementChild).toHaveClass('cursor-pointer');

    rerender(<TechnicalSurface interaction="static">Static</TechnicalSurface>);
    expect(container.firstElementChild).not.toHaveClass('cursor-pointer');
  });

  it('exposes the complete semantic surface contract for governance', () => {
    const { container } = render(
      <TechnicalSurface radius="md" border="technical" borderWidth="medium" interaction="interactive">
        Contract surface
      </TechnicalSurface>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-surface-radius', 'md');
    expect(root).toHaveAttribute('data-surface-border', 'technical');
    expect(root).toHaveAttribute('data-surface-border-width', 'medium');
    expect(root).toHaveAttribute('data-surface-interaction', 'interactive');
  });

  it('forwards DOM attributes and event handlers to the surface root', () => {
    const onKeyDown = vi.fn();
    const { container } = render(
      <TechnicalSurface
        aria-label="Technical surface"
        data-testid="surface-root"
        onKeyDown={onKeyDown}
      >
        Forwarded contract
      </TechnicalSurface>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveAttribute('aria-label', 'Technical surface');
    expect(root).toHaveAttribute('data-testid', 'surface-root');
    fireEvent.keyDown(root!, { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
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
