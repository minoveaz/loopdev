import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { CertificationStamp } from './index';

describe('CertificationStamp', () => {
  it('renders default certification metadata', () => {
    render(<CertificationStamp version="v2.4" phase={3} date="2026-08-08" />);

    expect(screen.getByText('Loopdev.lab')).toBeInTheDocument();
    expect(screen.getByText('Certified_Ready')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('2026-08-08')).toBeInTheDocument();
  });

  it('renders beta state label', () => {
    render(<CertificationStamp status="beta" />);
    expect(screen.getByText('Engineering_Audit')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CertificationStamp status="experimental" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
