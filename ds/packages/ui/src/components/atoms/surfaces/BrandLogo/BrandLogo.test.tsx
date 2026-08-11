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

  it('keeps the corporate blue independent from the active organization theme', () => {
    const { container } = render(<BrandLogo variant="full" />);
    const isotype = container.firstElementChild?.firstElementChild;
    const path = container.querySelector('path');
    const logotype = screen.getByText('loop.dev').parentElement;

    expect(isotype).toHaveClass('bg-[#135bec]');
    expect(path).toHaveClass('text-white');
    expect(logotype).toHaveClass('text-[#135bec]');
  });

  it('keeps the plain logo blue without hover or accent theme colors', () => {
    const { container } = render(<BrandLogo variant="isotype" surface="plain" />);

    expect(container.querySelector('path')).toHaveClass('text-[#135bec]');
  });
});
