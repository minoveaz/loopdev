import { UserMenuProps } from './types';

export const USER_MENU_FIXTURES: Record<string, UserMenuProps> = {
  admin: {
    userName: 'Miller Vega',
    userEmail: 'ing.miller.vega@gmail.com',
    userRole: 'Admin',
    onLogout: () => console.log('Logout Admin')
  },
  viewer: {
    userName: 'Ana Pro',
    userEmail: 'ana@loop.dev',
    userRole: 'Viewer',
    onLogout: () => console.log('Logout Viewer')
  }
};
