import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TechnicalCard } from './index';

describe('TechnicalCard Atom', () => {
  it('renders children correctly', () => {
    render(<TechnicalCard>Card Content</TechnicalCard>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies interactive classes when variant is interactive', () => {
    const { container } = render(<TechnicalCard variant="interactive">Content</TechnicalCard>);
    const card = container.firstChild as HTMLElement;
    // Expected classes for interactive mode (based on spec)
    expect(card.className).toContain('hover:border-primary');
    expect(card.className).toContain('hover:shadow');
  });

  it('supports custom className', () => {
    const { container } = render(<TechnicalCard className="custom-class">Content</TechnicalCard>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
