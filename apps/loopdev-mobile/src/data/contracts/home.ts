export type MobileOrganization = {
  id: string;
  name: string;
  slug?: string;
  memberCount: number;
  status: 'active' | 'paused';
};

export type ActivityItem = { id: string; title: string; detail: string; age: string };
export type NotificationItem = { id: string; title: string; detail: string; unread: boolean };

export type MobileOrganizationMembership = {
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'agent' | 'viewer';
};

export type PlatformOverview = {
  systemStatus: 'operational' | 'degraded';
  activeUsers: number;
  activeOrganizations: number;
  pendingNotifications: number;
};

export interface HomeDataSource {
  getOrganizations(): Promise<MobileOrganization[]>;
  getActivity(): Promise<ActivityItem[]>;
  getNotifications(): Promise<NotificationItem[]>;
  getPlatformOverview(): Promise<PlatformOverview>;
}
