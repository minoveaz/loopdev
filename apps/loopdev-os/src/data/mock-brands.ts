export const MOCK_BRANDS = [
  { id: '1', name: 'Acme Corp', status: 'published' as const, updatedAt: '2h ago' },
  { id: '2', name: 'Loop Labs', status: 'draft' as const, updatedAt: '1d ago' },
  { id: '3', name: 'Neon Future', status: 'archived' as const, updatedAt: '1w ago' },
  { id: '4', name: 'Zenith AI', status: 'published' as const, updatedAt: '3d ago' },
  { id: '5', name: 'Polaris', status: 'draft' as const, updatedAt: '5h ago' }
];

export const MOCK_NAV_GROUPS = [
  {
    id: 'identity',
    label: 'Brand Identity',
    items: [
      { id: 'identity.overview', label: 'Overview', icon: 'Home' },
      { id: 'identity.narrative', label: 'Identity', icon: 'Book' },
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
    collapsed: false,
    items: [
      { id: 'gov.rules', label: 'Rules Engine', icon: 'Shield' },
    ]
  }
];
