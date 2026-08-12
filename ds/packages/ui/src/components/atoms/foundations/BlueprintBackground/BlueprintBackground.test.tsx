import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { BlueprintBackground } from './index';

describe('BlueprintBackground', () => {
  it('renders as hidden decorative layer', () => {
    const { container } = render(<BlueprintBackground />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders scanline effect when enabled', () => {
    const { container } = render(<BlueprintBackground withScanline />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
