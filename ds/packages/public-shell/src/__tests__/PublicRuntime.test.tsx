import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import type { PublicBrandTheme, PublicNavigation, PublicViewComposition } from '@loopdev/contracts';
import { PublicRuntime } from '../runtime/PublicRuntime';

const mockTheme: PublicBrandTheme = {
  id: 'cimo',
  name: 'CIMO Sports',
  colors: {
    primary: '#00B894',
    primaryHover: '#009678',
    secondary: '#1F4E5F',
    accent: '#7FB77E',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    textMain: '#161D1A',
    textSecondary: '#6C757D',
  },
  logos: {
    markSvg: '<svg data-testid="mark-logo"></svg>',
    fullSvg: '<svg data-testid="full-logo"></svg>',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
};

const mockNavigation: PublicNavigation = {
  brandId: 'cimo',
  defaultRouteId: 'feed',
  mobilePrimaryRouteIds: ['feed', 'explore', 'chats', 'profile'],
  routes: [
    { id: 'feed', path: '/', label: 'Feed', icon: 'Home', presentation: 'tab' },
    { id: 'explore', path: '/explorar', label: 'Explorar', icon: 'Compass', presentation: 'tab' },
    { id: 'chats', path: '/chats', label: 'Chats', icon: 'MessageCircle', badgeCount: 2, presentation: 'tab' },
    { id: 'profile', path: '/perfil', label: 'Perfil', icon: 'User', presentation: 'tab' },
  ],
};

const mockComposition: PublicViewComposition = {
  recipe: 'PublicSocialFeed',
  grid: { columns: 12, gap: 'md', maxWidth: '7xl' },
  regions: [
    {
      id: 'cimo-filters-col',
      slot: 'sidebar-filters',
      component: 'SportFilters',
      colSpan: 3,
    },
    {
      id: 'cimo-feed-col',
      slot: 'main-feed',
      component: 'ActivitiesFeed',
      colSpan: 6,
    },
    {
      id: 'cimo-inspector-col',
      slot: 'context-inspector',
      component: 'CrewInspector',
      colSpan: 3,
    },
  ],
};

describe('PublicRuntime Orchestrator', () => {
  it('mounts every declared public slot without inline layout markup', () => {
    render(
      <PublicRuntime
        brandTheme={mockTheme}
        navigation={mockNavigation}
        composition={mockComposition}
        renderers={{
          sidebarFilters: <div data-testid="filters-slot">Filters Content</div>,
          mainFeed: <div data-testid="feed-slot">Feed Content</div>,
          contextInspector: <div data-testid="inspector-slot">Inspector Content</div>,
        }}
      />,
    );

    expect(screen.getByTestId('feed-slot')).toBeDefined();
    expect(screen.getByTestId('filters-slot')).toBeDefined();
    expect(screen.getByTestId('inspector-slot')).toBeDefined();
  });

  it('applies the public brand theme variables to the document root', () => {
    render(
      <PublicRuntime
        brandTheme={mockTheme}
        navigation={mockNavigation}
        composition={mockComposition}
        renderers={{
          mainFeed: <div>Feed</div>,
        }}
      />,
    );

    expect(document.documentElement.style.getPropertyValue('--lpd-brand-primary')).toBe('#00B894');
    expect(document.documentElement.style.getPropertyValue('--lpd-brand-secondary')).toBe('#1F4E5F');
  });
});
