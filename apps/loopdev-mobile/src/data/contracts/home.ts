export type MobileOrganization = {
  id: string;
  name: string;
  slug?: string;
  role?: MobileOrganizationMembership['role'];
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
  getActivity(organizationId?: string): Promise<ActivityItem[]>;
  getNotifications(organizationId?: string): Promise<NotificationItem[]>;
  getPlatformOverview(organizationId?: string): Promise<PlatformOverview>;
}
