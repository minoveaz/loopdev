import { ModuleHeaderProps } from './types';

export const MODULE_HEADER_FIXTURES: Record<string, ModuleHeaderProps> = {
  moduleMode: {
    segments: [
      { id: 'suite', label: 'Marketing Studio', href: '/marketing-studio' },
      { id: 'module', label: 'Brand Hub', isActive: true },
    ],
    statusLabel: 'SYSTEM_ACTIVE',
    statusSeverity: 'success',
    sidebarToggle: {
      isOpen: true,
      onToggle: () => console.log('Toggle Sidebar'),
    },
  },
  brandMode: {
    segments: [
      { id: 'suite', label: 'Marketing', href: '/marketing-studio' },
      { id: 'module', label: 'Brand Hub', href: '/marketing-studio/brand-hub' },
      { id: 'entity', label: 'Acme Corp', isActive: true },
    ],
    statusLabel: 'DRAFT_VERSION',
    statusSeverity: 'warning',
    sidebarToggle: {
      isOpen: true,
      onToggle: () => console.log('Toggle Sidebar'),
    },
  }
};