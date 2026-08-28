import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { PlatformHeader } from './index';

describe('PlatformHeader Composite', () => {
  it('renders the platform slots without adding a second layout row', () => {
    render(
      <PlatformHeader
        identitySlot={<span data-testid="identity">LoopDev</span>}
        contextSlot={<span data-testid="context">Workspace</span>}
        environmentSlot={<span data-testid="environment">Production</span>}
        primaryActionSlot={<span data-testid="primary-action">Connect</span>}
        searchSlot={<span data-testid="search">Search</span>}
        controlsSlot={<span data-testid="controls">Notifications</span>}
        profileSlot={<span data-testid="profile">Profile</span>}
      />,
    );

    expect(screen.getByTestId('identity')).toBeInTheDocument();
    expect(screen.getByTestId('context')).toBeInTheDocument();
    expect(screen.getByTestId('environment')).toBeInTheDocument();
    expect(screen.getByTestId('primary-action')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('profile')).toBeInTheDocument();
    expect(screen.getByTestId('identity').parentElement?.parentElement).toHaveClass('h-full');
  });

  it('preserves the semantic shell surface and technical boundary', () => {
    render(<PlatformHeader identitySlot="LoopDev" />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-shell-canvas', 'border-border-technical');
  });

  it('reserves the mobile navigation gutter through the iPad breakpoint', () => {
    render(<PlatformHeader identitySlot="LoopDev" hasMobileNavigation />);

    expect(screen.getByRole('banner')).toHaveClass('max-[1024px]:!pl-14');
  });

  it('marks the header inert when a blocking overlay is active', () => {
    render(<PlatformHeader identitySlot="LoopDev" isInert />);

    const header = screen.getByRole('banner', { hidden: true });
    expect(header).toHaveAttribute('aria-hidden', 'true');
    expect(header).toHaveClass('pointer-events-none');
  });

  it('has no accessibility violations with the platform slots', async () => {
    const { container } = render(
      <PlatformHeader identitySlot="LoopDev" searchSlot="Search" profileSlot="Profile" />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
