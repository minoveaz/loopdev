import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Icon } from './index';

describe('Icon', () => {
  it('renders glyph with default size classes', () => {
    render(<Icon name="settings" />);
    const glyph = screen.getByText('settings');
    expect(glyph).toHaveClass('material-symbols-outlined');
    expect(glyph).toHaveClass('text-[16px]');
  });

  it('renders boxed variant with container and custom color', () => {
    const { container } = render(<Icon name="bolt" variant="boxed" color="#ff0000" size="lg" />);
    const boxed = container.firstElementChild;
    const glyph = screen.getByText('bolt');

    expect(boxed?.tagName).toBe('DIV');
    expect(boxed).toHaveClass('bg-[var(--lpd-color-brand-primary)]');
    expect(glyph).toHaveStyle({ color: '#ff0000' });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Icon name="target" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});