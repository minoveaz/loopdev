import { PathSegment } from './types';

export const CONTEXT_PATH_FIXTURES: Record<string, PathSegment[]> = {
  marketing_brands: [
    { id: 'suite', label: 'Marketing Studio', href: '/marketing-studio' },
    { id: 'module', label: 'Brand Hub', href: '/marketing-studio/brands' },
    { id: 'view', label: 'Logotipos', isActive: true }
  ],
  deep_route: [
    { id: '1', label: 'Marketing', href: '#' },
    { id: '2', label: 'Campaigns', href: '#' },
    { id: '3', label: 'Black Friday 2026', href: '#' },
    { id: '4', label: 'Social Assets', href: '#' },
    { id: '5', label: 'Instagram Post', isActive: true }
  ]
};
