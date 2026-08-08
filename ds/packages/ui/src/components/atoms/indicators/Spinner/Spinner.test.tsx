import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Spinner } from './index';

describe('Spinner', () => {
  it('renders progress glyph', () => {
    render(<Spinner />);
    expect(screen.getByText('progress_activity')).toBeInTheDocument();
  });

  it('applies spinning class', () => {
    render(<Spinner color="energy" />);
    expect(screen.getByText('progress_activity')).toHaveClass('animate-spin');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
