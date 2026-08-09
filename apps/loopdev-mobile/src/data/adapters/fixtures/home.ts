import type {
  OrganizationSummary,
  PlatformActivityItem,
  PlatformHomeDataSource,
  PlatformNotificationItem,
  PlatformOverview,
} from '@loopdev/contracts';

export const organizations: OrganizationSummary[] = [
  { id: 'org-loopdev', name: 'LoopDev', memberCount: 24, status: 'active' },
  { id: 'org-nova', name: 'Nova Labs', memberCount: 11, status: 'active' },
  { id: 'org-atlas', name: 'Atlas Studio', memberCount: 7, status: 'paused' },
];

export const activity: PlatformActivityItem[] = [
  {
    id: 'activity-1',
    title: 'Nueva organización conectada',
    detail: 'Nova Labs',
    age: 'Hace 12 min',
  },
  { id: 'activity-2', title: 'Permisos revisados', detail: 'LoopDev', age: 'Hace 48 min' },
  {
    id: 'activity-3',
    title: 'Sesión administrativa iniciada',
    detail: 'SuperDev',
    age: 'Hoy, 09:14',
  },
];

export const notifications: PlatformNotificationItem[] = [
  {
    id: 'notification-1',
    title: 'Revisión pendiente',
    detail: 'Atlas Studio necesita atención',
    unread: true,
  },
  {
    id: 'notification-2',
    title: 'Sincronización completada',
    detail: 'Todos los servicios operativos',
    unread: false,
  },
];

export const platformOverview: PlatformOverview = {
  systemStatus: 'operational' as const,
  activeUsers: 42,
  activeOrganizations: organizations.filter(({ status }) => status === 'active').length,
  pendingNotifications: notifications.filter(({ unread }) => unread).length,
};

export const fixturesHomeDataSource: PlatformHomeDataSource = {
  async getOrganizations() {
    return organizations;
  },
  async getActivity() {
    return activity;
  },
  async getNotifications() {
    return notifications;
  },
  async getPlatformOverview() {
    return platformOverview;
  },
};
