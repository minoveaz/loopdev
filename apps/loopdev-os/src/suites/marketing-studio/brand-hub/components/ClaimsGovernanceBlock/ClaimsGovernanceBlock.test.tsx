/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ClaimsGovernanceBlock } from './index';

describe('ClaimsGovernanceBlock Composite', () => {
  const mockForbidden = ['forbidden1'];
  const mockRegulated: any = [
    { id: 'c1', text: 'Regulated 1', reason: 'R1', jurisdiction: 'EU', severity: 'block' }
  ];

  it('renders both forbidden and regulated sections', () => {
    render(<ClaimsGovernanceBlock forbidden={mockForbidden} regulated={mockRegulated} />);
    expect(screen.getByText('forbidden1')).toBeDefined();
    expect(screen.getByText('Regulated 1')).toBeDefined();
  });

  it('calls onForbiddenClick when a forbidden item is clicked', () => {
    const onClick = vi.fn();
    render(<ClaimsGovernanceBlock forbidden={mockForbidden} regulated={mockRegulated} onForbiddenClick={onClick} />);
    fireEvent.click(screen.getByText('forbidden1'));
    expect(onClick).toHaveBeenCalledWith('forbidden1');
  });

  it('calls onClaimClick when a regulated item is clicked', () => {
    const onClick = vi.fn();
    render(<ClaimsGovernanceBlock forbidden={mockForbidden} regulated={mockRegulated} onClaimClick={onClick} />);
    fireEvent.click(screen.getByText('Regulated 1').closest('button')!);
    expect(onClick).toHaveBeenCalledWith(mockRegulated[0]);
  });
});
