import type { ActivityItem, NotificationItem, Organization } from '../adapters/fixtures/home';

export type PlatformOverview = {
  systemStatus: 'operational' | 'degraded';
  activeUsers: number;
  activeOrganizations: number;
  pendingNotifications: number;
};

export interface HomeDataSource {
  getOrganizations(): Promise<Organization[]>;
  getActivity(): Promise<ActivityItem[]>;
  getNotifications(): Promise<NotificationItem[]>;
  getPlatformOverview(): Promise<PlatformOverview>;
}