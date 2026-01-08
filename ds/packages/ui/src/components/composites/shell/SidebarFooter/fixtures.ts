import { SidebarFooterProps } from './types';

export const SIDEBAR_FOOTER_FIXTURES: Record<string, SidebarFooterProps> = {
  expanded: {
    userName: 'Miller Vega',
    userRole: 'Tenant_Admin',
    isRail: false,
    onToggleRail: () => console.log('Toggle Rail')
  },
  rail: {
    userName: 'Miller Vega',
    userRole: 'Tenant_Admin',
    isRail: true,
    onToggleRail: () => console.log('Toggle Rail')
  }
};
