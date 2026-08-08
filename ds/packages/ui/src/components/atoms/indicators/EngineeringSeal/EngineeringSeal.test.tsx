import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { EngineeringSeal } from './index';

describe('EngineeringSeal', () => {
  it('renders semantic status with version bracket', () => {
    render(<EngineeringSeal version="1.3.7" />);

    expect(screen.getByRole('status', { name: /versi\u00f3n del sistema: 1.3.7/i })).toBeInTheDocument();
    expect(screen.getByText('LOOPDEV.LAB')).toBeInTheDocument();
    expect(screen.getByText('{ 1.3.7 }')).toBeInTheDocument();
  });

  it('supports alternate status palette', () => {
    const { container } = render(<EngineeringSeal version="2.0.0" status="lab" />);
    expect(container.querySelector('.bg-purple-600')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EngineeringSeal version="1.0.0" status="audit" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
