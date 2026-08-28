import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TechnicalCard } from './index';

describe('TechnicalCard Atom', () => {
  it('renders children correctly', () => {
    render(<TechnicalCard>Card Content</TechnicalCard>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('uses the shared surface interaction contract without local surface effects', () => {
    const { container } = render(<TechnicalCard variant="interactive">Content</TechnicalCard>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
    expect(card.className).toContain('shadow-xl');
    expect(card.className).not.toContain('hover:border-primary');
    expect(card.className).not.toContain('hover:shadow-sm');
    expect(card).toHaveAttribute('data-card-variant', 'interactive');
  });

  it('declares disabled state without treating opacity as its accessibility contract', () => {
    const { container } = render(<TechnicalCard variant="disabled">Unavailable</TechnicalCard>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('aria-disabled', 'true');
    expect(card).toHaveClass('opacity-60');
    expect(card).not.toHaveClass('cursor-pointer');
    expect(card).not.toHaveClass('pointer-events-none');
    expect(card).toHaveAttribute('data-card-disabled', 'true');
  });

  it('does not add warning styling to the shared surface', () => {
    const { container } = render(<TechnicalCard variant="warning">Warning content</TechnicalCard>);
    expect(container.firstChild).not.toHaveClass('border-strong');
  });

  it('forwards attributes and events to the shared surface root', () => {
    const onKeyDown = vi.fn();
    const { container } = render(
      <TechnicalCard aria-label="Card" data-testid="technical-card" onKeyDown={onKeyDown}>
        Forwarded card
      </TechnicalCard>,
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('aria-label', 'Card');
    expect(card).toHaveAttribute('data-testid', 'technical-card');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('supports custom className', () => {
    const { container } = render(<TechnicalCard className="custom-class">Content</TechnicalCard>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <TechnicalCard variant="disabled">Unavailable card</TechnicalCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
