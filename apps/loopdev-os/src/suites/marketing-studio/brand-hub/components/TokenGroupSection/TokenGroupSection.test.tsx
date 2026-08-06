/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TokenGroupSection } from './index';
import type { ColorToken } from '../../types';

describe('TokenGroupSection Composite', () => {
  const mockTokens: ColorToken[] = [
    { id: 't1', name: 't1', group: 'core', resolvesTo: { light: '#fff', dark: '#000' } },
    { id: 't2', name: 't2', group: 'core', resolvesTo: { light: '#fff', dark: '#000' } }
  ];

  it('renders title and token count', () => {
    render(<TokenGroupSection title="Core Brand" tokens={mockTokens} theme="light" />);
    expect(screen.getByText(/Core Brand/i)).toBeDefined();
    expect(screen.getByText(/{ 2 tokens }/i)).toBeDefined();
  });

  it('renders all tokens in the group', () => {
    render(<TokenGroupSection title="Core" tokens={mockTokens} theme="light" />);
    expect(screen.getByText('t1')).toBeDefined();
    expect(screen.getByText('t2')).toBeDefined();
  });

  it('returns null if tokens array is empty', () => {
    const { container } = render(<TokenGroupSection title="Empty" tokens={[]} theme="light" />);
    expect(container.firstChild).toBeNull();
  });
});
