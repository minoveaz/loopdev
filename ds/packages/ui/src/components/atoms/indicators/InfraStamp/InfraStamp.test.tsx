import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { InfraStamp } from './index';

describe('InfraStamp', () => {
  it('renders default infrastructure metadata', () => {
    render(<InfraStamp version="v3.2" security="RLS_OK" date="2026-08-08" />);

    expect(screen.getByText('Loopdev.infra')).toBeInTheDocument();
    expect(screen.getByText('Infra_Certified')).toBeInTheDocument();
    expect(screen.getByText('RLS_OK')).toBeInTheDocument();
    expect(screen.getByText('2026-08-08')).toBeInTheDocument();
  });

  it('renders audit status label', () => {
    render(<InfraStamp status="audit" />);
    expect(screen.getByText('Security_Review')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<InfraStamp status="lab" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});