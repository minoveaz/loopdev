import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './index';

describe('Badge', () => {
  it('renders content and status dot by default', () => {
    const { container } = render(<Badge>Live feed</Badge>);
    expect(screen.getByText('Live feed')).toBeInTheDocument();
    expect(container.querySelector('[class*="h-1.5"][class*="w-1.5"]')).toBeInTheDocument();
  });

  it('renders icon and animated dot for live energy states', () => {
    const { container } = render(
      <Badge status="energy" isLive icon="bolt">
        Energy
      </Badge>,
    );

    expect(screen.getByText('bolt')).toBeInTheDocument();
    expect(container.querySelector('.animate-badge-pulse')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge status="primary">Primary</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
