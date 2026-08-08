import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandLogo } from './index';

describe('BrandLogo', () => {
  it('renders full brand with isotype and logotype by default', () => {
    const { container } = render(<BrandLogo />);
    expect(screen.getByText('loop.dev')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders only logotype for logotype variant', () => {
    const { container } = render(<BrandLogo variant="logotype" />);
    expect(screen.getByText('loop.dev')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
