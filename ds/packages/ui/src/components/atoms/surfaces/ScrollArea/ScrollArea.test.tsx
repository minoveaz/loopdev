import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ScrollArea } from './index';

describe('ScrollArea', () => {
  it('renders children content', () => {
    render(
      <ScrollArea>
        <p>Scrollable payload</p>
      </ScrollArea>,
    );

    expect(screen.getByText('Scrollable payload')).toBeInTheDocument();
  });

  it('applies hidden visibility classes', () => {
    const { container } = render(
      <ScrollArea visibility="hidden">
        <p>Hidden scrollbar</p>
      </ScrollArea>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('custom-scrollbar');
    expect(root).toHaveClass('scrollbar-hide');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ScrollArea>
        <p>A11y content</p>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
