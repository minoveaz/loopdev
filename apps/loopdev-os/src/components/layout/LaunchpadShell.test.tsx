import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { NavRouteRef } from '@loopdev/contracts';
import { LaunchpadShell } from './LaunchpadShell';

vi.mock('./ContextSwitcher', () => ({
  ContextSwitcher: () => null,
}));

describe('LaunchpadShell', () => {
  it('wires PlatformHeader and SuiteSidebar through the canonical AppShell slots', () => {
    render(
      <LaunchpadShell
        userEmail="owner@loopdev.local"
        userId="user-1"
        isPlatformAdministrator
        signOut={vi.fn()}
        platformToolsAvailable
        platformAccessMap={{ 'document-intelligence': 'enabled' }}
        navMode="rail"
        onNavModeChange={vi.fn()}
        onNavigate={vi.fn<(route: NavRouteRef) => void>()}
      >
        <div data-testid="launchpad-content">Content</div>
      </LaunchpadShell>,
    );

    const header = screen.getAllByRole('banner')[0];
    const navigation = screen.getByRole('navigation', { name: 'Global Navigation' });
    const footer = screen.getByRole('contentinfo');
    const mobileNavigationTrigger = screen.getByRole('button', { name: 'Toggle navigation' });

    expect(header).not.toContainElement(navigation);
    expect(navigation).toContainElement(footer);
    expect(footer).toHaveClass('mt-auto', 'shrink-0');
    expect(mobileNavigationTrigger).toHaveAttribute('aria-controls', 'app-shell-nav');
    expect(screen.queryByText('Platform tools')).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Suite Dashboard' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Document Intelligence' })).toBeInTheDocument();
    expect(screen.getByTestId('launchpad-content')).toBeInTheDocument();
  });

  it('shows the contextual title and labels when the responsive sidebar is expanded', async () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      media: '(max-width: 1024px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(
      <LaunchpadShell
        userEmail="owner@loopdev.local"
        isPlatformAdministrator
        signOut={vi.fn()}
        platformToolsAvailable
        platformAccessMap={{ 'document-intelligence': 'enabled' }}
        navMode="rail"
        onNavModeChange={vi.fn()}
        onNavigate={vi.fn<(route: NavRouteRef) => void>()}
      >
        <div>Content</div>
      </LaunchpadShell>,
    );

    await waitFor(() => {
      expect(screen.getByText('Platform tools')).toBeInTheDocument();
    });
    expect(screen.getByRole('menuitem', { name: 'Document Intelligence' })).toHaveTextContent(
      'Document Intelligence',
    );

    vi.unstubAllGlobals();
  });
});
