import { ModuleHeaderProps } from './types';

export const MODULE_HEADER_FIXTURES: Record<string, ModuleHeaderProps> = {
  default: {
    title: 'Brand Hub',
    breadcrumbs: [
      { label: 'Marketing' },
      { label: 'Identidad Visual' }
    ],
    status: { label: 'LIVE', tone: 'success' },
    sidebarToggle: {
      isOpen: true,
      onToggle: () => console.log('Toggle sidebar'),
    }
  },
  draft: {
    title: 'Summer Campaign',
    breadcrumbs: [
      { label: 'Campaigns' },
      { label: '2026' }
    ],
    status: { label: 'DRAFT', tone: 'warning' },
    showBack: true,
    onBack: () => console.log('Back clicked')
  }
};
