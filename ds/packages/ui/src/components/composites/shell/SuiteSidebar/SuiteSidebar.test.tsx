import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SuiteSidebar } from './index';
import { MARKETING_STUDIO_SCHEMA } from './fixtures';

describe('SuiteSidebar', () => {
  it('renders the suite context and hides modules with hidden access', () => {
    render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode="expanded"
        accessMap={{ 'brand-hub': 'hidden' } as any}
        onExitToOS={vi.fn()}
        onToggleNavMode={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.queryByText('Marketing Studio')).not.toBeInTheDocument();
    expect(screen.getByText('loop.dev')).toBeInTheDocument();
    expect(screen.queryByText('Brand Hub')).not.toBeInTheDocument();
    expect(screen.getByText('Suite Dashboard')).toBeInTheDocument();
  });

  it('fires main action callbacks from exit, settings and rail controls', () => {
    const onExitToOS = vi.fn();
    const onToggleNavMode = vi.fn();
    const onAction = vi.fn();

    render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode="expanded"
        accessMap={{}}
        onExitToOS={onExitToOS}
        onToggleNavMode={onToggleNavMode}
        onNavigate={vi.fn()}
        onAction={onAction}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Back to OS' }));
    expect(onExitToOS).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle('Ajustes de cuenta'));
    expect(onAction).toHaveBeenCalledWith('openSettings');

    fireEvent.click(screen.getByTitle('Contraer'));
    expect(onToggleNavMode).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations in expanded mode', async () => {
    const { container } = render(
      <SuiteSidebar
        schema={MARKETING_STUDIO_SCHEMA}
        navMode="expanded"
        accessMap={{}}
        onExitToOS={vi.fn()}
        onToggleNavMode={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
