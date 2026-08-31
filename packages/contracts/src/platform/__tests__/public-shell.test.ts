import {
  createPublicContextualTriptychComposition,
  PublicBrandThemeSchema,
  PublicNavigationSchema,
  PublicPageSpecSchema,
  PublicViewCompositionSchema,
} from '../public-shell';

describe('Public Shell Contracts', () => {
  it('validates a standard 3-column contextual triptych composition with equal-height stretch', () => {
    const triptych = createPublicContextualTriptychComposition({
      idPrefix: 'cimo-test',
      leftColSpan: 3,
      mainColSpan: 6,
      rightColSpan: 3,
      gap: 'md',
      maxWidth: 'full',
      alignment: 'stretch',
    });

    const parsed = PublicViewCompositionSchema.safeParse(triptych);
    expect(parsed.success).toBe(true);
    expect(triptych.recipe).toBe('PublicContextualTriptych');
    expect(triptych.grid.alignment).toBe('stretch');
    expect(triptych.regions).toHaveLength(3);
  });
  it('validates a bounded 3-column public social feed composition (CIMO pattern)', () => {
    const validCimoComposition = {
      recipe: 'PublicSocialFeed',
      grid: { columns: 12, gap: 'md', maxWidth: '7xl' },
      regions: [
        {
          id: 'cimo-filters',
          slot: 'sidebar-filters',
          component: 'SportFiltersBlock',
          colSpan: 3,
          sizing: 'fill',
          overflow: 'auto-y',
          responsive: { tablet: 'drawer', mobile: 'sheet' },
        },
        {
          id: 'cimo-feed',
          slot: 'main-feed',
          component: 'ActivitiesFeedBlock',
          colSpan: 6,
          sizing: 'fill',
          overflow: 'auto-y',
          responsive: { tablet: 'preserve', mobile: 'stack' },
        },
        {
          id: 'cimo-inspector',
          slot: 'context-inspector',
          component: 'SelectedCrewInspectorBlock',
          colSpan: 3,
          sizing: 'fill',
          overflow: 'auto-y',
          responsive: { tablet: 'stack', mobile: 'modal' },
        },
      ],
    };

    const parsed = PublicViewCompositionSchema.safeParse(validCimoComposition);
    expect(parsed.success).toBe(true);
  });

  it('validates a 2-column split discovery composition', () => {
    const validSplit = {
      recipe: 'PublicDiscoverySplit',
      grid: { columns: 12, gap: 'md' },
      regions: [
        {
          id: 'plans-list',
          slot: 'main-feed',
          component: 'PlanListBlock',
          colSpan: 5,
        },
        {
          id: 'interactive-map',
          slot: 'context-inspector',
          component: 'MapBlock',
          colSpan: 7,
        },
      ],
    };

    expect(PublicViewCompositionSchema.safeParse(validSplit).success).toBe(true);
  });

  it('rejects duplicate region IDs in public composition', () => {
    const duplicateIds = {
      recipe: 'PublicSocialFeed',
      grid: { columns: 12, gap: 'md' },
      regions: [
        { id: 'duplicate-id', slot: 'main-feed', component: 'Feed', colSpan: 6 },
        { id: 'duplicate-id', slot: 'context-inspector', component: 'Detail', colSpan: 6 },
      ],
    };

    const result = PublicViewCompositionSchema.safeParse(duplicateIds);
    expect(result.success).toBe(false);
  });

  it('rejects colSpan exceeding the 12-column grid limit', () => {
    const exceedingColSpan = {
      recipe: 'PublicSocialFeed',
      grid: { columns: 12, gap: 'md' },
      regions: [
        { id: 'invalid-col', slot: 'main-feed', component: 'Feed', colSpan: 14 },
      ],
    };

    const result = PublicViewCompositionSchema.safeParse(exceedingColSpan);
    expect(result.success).toBe(false);
  });

  it('validates brand themes for white-label styling (CIMO and VitaBlue)', () => {
    const cimoTheme = {
      id: 'cimo',
      name: 'CIMO Social Sports',
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
        markSvg: '<svg>...</svg>',
        fullSvg: '<svg>...</svg>',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
      },
    };

    expect(PublicBrandThemeSchema.safeParse(cimoTheme).success).toBe(true);
  });

  it('rejects invalid hex colors in brand themes', () => {
    const invalidTheme = {
      id: 'bad-theme',
      name: 'Invalid Color Theme',
      colors: {
        primary: 'not-a-hex-color',
        primaryHover: '#009678',
        secondary: '#1F4E5F',
        accent: '#7FB77E',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        textMain: '#161D1A',
        textSecondary: '#6C757D',
      },
      logos: {
        markSvg: '<svg></svg>',
        fullSvg: '<svg></svg>',
      },
      typography: {
        fontFamily: 'Inter',
      },
    };

    expect(PublicBrandThemeSchema.safeParse(invalidTheme).success).toBe(false);
  });

  it('validates a complete public navigation schema with mobile primary route bounds', () => {
    const navigation = {
      brandId: 'cimo',
      defaultRouteId: 'feed',
      mobilePrimaryRouteIds: ['feed', 'explore', 'chats', 'profile'],
      routes: [
        { id: 'feed', path: '/', label: 'Feed', icon: 'Home', presentation: 'tab' },
        { id: 'explore', path: '/explorar', label: 'Explorar', icon: 'Compass', presentation: 'tab' },
        { id: 'chats', path: '/chats', label: 'Chats', icon: 'MessageCircle', badgeCount: 3, presentation: 'tab' },
        { id: 'profile', path: '/perfil', label: 'Perfil', icon: 'User', requiresAuth: true, presentation: 'tab' },
      ],
    };

    expect(PublicNavigationSchema.safeParse(navigation).success).toBe(true);
  });

  it('validates a complete PublicPageSpec', () => {
    const pageSpec = {
      id: 'cimo-home',
      title: 'CIMO | Conoce personas entrenando',
      initialState: 'ready',
      composition: {
        recipe: 'PublicSocialFeed',
        grid: { columns: 12, gap: 'md', maxWidth: '7xl' },
        regions: [
          { id: 'main', slot: 'main-feed', component: 'FeedBlock', colSpan: 12 },
        ],
      },
      navigation: {
        brandId: 'cimo',
        defaultRouteId: 'feed',
        mobilePrimaryRouteIds: ['feed'],
        routes: [
          { id: 'feed', path: '/', label: 'Feed', icon: 'Home' },
        ],
      },
      theme: {
        id: 'cimo',
        name: 'CIMO',
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
          markSvg: '<svg></svg>',
          fullSvg: '<svg></svg>',
        },
        typography: {
          fontFamily: 'Inter',
        },
      },
    };

    expect(PublicPageSpecSchema.safeParse(pageSpec).success).toBe(true);
  });
});
