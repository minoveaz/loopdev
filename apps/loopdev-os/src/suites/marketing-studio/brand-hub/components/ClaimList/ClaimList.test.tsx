/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ClaimList } from './index';

describe('ClaimList Molecule', () => {
  it('renders forbidden terms as buttons/tags', () => {
    const items = ['word1', 'word2'];
    render(<ClaimList title="Forbidden" items={items} type="forbidden" />);
    expect(screen.getByText(/word1/i)).toBeDefined();
    expect(screen.getByText(/word2/i)).toBeDefined();
  });

  it('renders regulated claims with jurisdiction and severity', () => {
    const items: any = [
      { id: 'c1', text: 'Claim 1', reason: 'Test reason', jurisdiction: 'EU', severity: 'block' }
    ];
    render(<ClaimList title="Regulated" items={items} type="regulated" />);
    expect(screen.getByText('Claim 1')).toBeDefined();
    expect(screen.getByText('EU')).toBeDefined();
    expect(screen.getByText(/BLOCK/i)).toBeDefined();
  });

  it('calls onItemClick when a forbidden term is clicked', () => {
    const onItemClick = vi.fn();
    render(<ClaimList title="Forbidden" items={['forbidden1']} type="forbidden" onItemClick={onItemClick} />);
    fireEvent.click(screen.getByText('forbidden1'));
    expect(onItemClick).toHaveBeenCalledWith('forbidden1');
  });

  it('calls onItemClick when a regulated claim is clicked', () => {
    const onItemClick = vi.fn();
    const items: any = [{ id: 'id123', text: 'Regulated 1', reason: 'R', jurisdiction: 'J', severity: 'block' }];
    render(<ClaimList title="Regulated" items={items} type="regulated" onItemClick={onItemClick} />);
    fireEvent.click(screen.getByText('Regulated 1').closest('button')!);
    expect(onItemClick).toHaveBeenCalledWith('id123');
  });
});
