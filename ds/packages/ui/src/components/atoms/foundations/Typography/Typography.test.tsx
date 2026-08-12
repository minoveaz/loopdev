import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TechnicalText } from './index';

describe('TechnicalText', () => {
  it('uses technical typography defaults', () => {
    render(<TechnicalText>system_status</TechnicalText>);

    expect(screen.getByText('system_status')).toHaveClass('font-mono', 'text-lpd-sm');
  });

  it('preserves semantic element and allows token size overrides', () => {
    render(<TechnicalText as="time" size="xs">2026-08-08</TechnicalText>);

    const timestamp = screen.getByText('2026-08-08');
    expect(timestamp.tagName).toBe('TIME');
    expect(timestamp).toHaveClass('font-mono', 'text-lpd-xs');
  });
});