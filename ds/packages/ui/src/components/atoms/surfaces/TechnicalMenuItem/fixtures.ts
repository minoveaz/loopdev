import { TechnicalMenuItemProps } from './types';

export const TECHNICAL_MENU_ITEM_FIXTURES: Record<string, TechnicalMenuItemProps> = {
  profile: {
    icon: 'User',
    label: 'Profile Settings',
    shortcut: '⌘P',
    variant: 'default'
  },
  logout: {
    icon: 'LogOut',
    label: 'Logout Session',
    variant: 'danger'
  },
  active: {
    icon: 'CheckCircle',
    label: 'Currently Active',
    isActive: true
  }
};
