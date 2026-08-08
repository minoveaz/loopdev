import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TechnicalIsotype } from './index';

describe('TechnicalIsotype', () => {
  it('renders central icon glyph', () => {
    render(<TechnicalIsotype icon="memory" />);
    expect(screen.getByText('memory')).toBeInTheDocument();
  });

  it('applies size and tone visual classes', () => {
    const { container } = render(<TechnicalIsotype icon="hub" size="lg" tone="energy" />);
    const root = container.firstElementChild;

    expect(root).toHaveClass('w-20');
    expect(root).toHaveClass('h-20');
    expect(container.querySelector('.text-energy-yellow')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TechnicalIsotype icon="neurology" tone="neutral" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});