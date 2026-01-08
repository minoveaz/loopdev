import { NavSidebarItemProps } from './types';

export const NAV_SIDEBAR_ITEM_FIXTURES: Record<string, NavSidebarItemProps> = {
  active: {
    icon: 'LibraryBig',
    label: 'Brand Hub',
    isActive: true,
    status: 'enabled',
    accentColor: 'var(--lpd-color-brand-primary)'
  },
  inactive: {
    icon: 'Sparkles',
    label: 'Content Engine',
    isActive: false,
    status: 'enabled'
  },
  locked: {
    icon: 'ShieldCheck',
    label: 'Governance',
    status: 'disabled'
  },
  upcoming: {
    icon: 'Compass',
    label: 'Advisor System',
    status: 'coming-soon'
  },
  railMode: {
    icon: 'FolderKanban',
    label: 'Digital Assets',
    isRail: true,
    isActive: true,
    accentColor: 'var(--lpd-color-brand-primary)'
  }
};
