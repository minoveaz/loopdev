import { ModuleSidebarProps } from './types';

export const MODULE_SIDEBAR_FIXTURES: Record<string, ModuleSidebarProps> = {
  moduleMode: {
    mode: 'module',
    brands: [
      { id: '1', name: 'Acme Corp', status: 'published', updatedAt: '2h ago' },
      { id: '2', name: 'Loop Labs', status: 'draft', updatedAt: '1d ago' },
      { id: '3', name: 'Neon Future', status: 'archived', updatedAt: '1w ago' },
    ],
    onSearchChange: (v) => console.log('Search:', v),
    onSelectBrand: (id) => console.log('Select:', id),
  },
  brandMode: {
    mode: 'brand',
    activeRouteId: 'visual.colors',
    navGroups: [
      {
        id: 'identity',
        label: 'Brand Identity',
        items: [
          { id: 'identity.overview', label: 'Overview', icon: 'Home' },
          { id: 'identity.narrative', label: 'Narrative', icon: 'Book' },
        ]
      },
      {
        id: 'visual',
        label: 'Visual System',
        items: [
          { id: 'visual.colors', label: 'Colors', icon: 'Palette' },
          { id: 'visual.typography', label: 'Typography', icon: 'Type' },
        ]
      },
      {
        id: 'governance',
        label: 'Governance',
        collapsed: true,
        items: [
          { id: 'gov.rules', label: 'Rules Engine', icon: 'Shield' },
        ]
      }
    ] as any, // Cast temporal mientras unificamos NavGroup types
    onBackToDirectory: () => console.log('Back'),
  }
};
