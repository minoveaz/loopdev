import type { NavGroup } from '@loopdev/contracts';

export const ASSET_MANAGER_NAV_GROUPS: NavGroup[] = [
  {
    id: 'asset-library',
    label: 'Asset Library',
    priority: 10,
    items: [
      { id: 'library.all', kind: 'action', actionId: 'asset-library.all', label: 'All assets', icon: 'FolderKanban', priority: 10 },
      { id: 'library.approved', kind: 'action', actionId: 'asset-library.approved', label: 'Approved media', icon: 'CheckCircle', priority: 20 },
      { id: 'library.archived', kind: 'action', actionId: 'asset-library.archived', label: 'Archived', icon: 'Archive', priority: 30 },
    ],
  },
  {
    id: 'asset-governance',
    label: 'Governance',
    priority: 20,
    items: [
      { id: 'governance.review', kind: 'action', actionId: 'asset-governance.review', label: 'Review queue', icon: 'ShieldCheck', priority: 10 },
    ],
  },
];

export const ASSET_MANAGER_FLYOUT = {
  title: 'Asset Manager',
  description: 'Inspect, filter and govern media available to the active brand workspace.',
};