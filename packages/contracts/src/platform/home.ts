import type { OrganizationRole } from './tenancy';

export type OrganizationSummary = {
  id: string;
  name: string;
  slug?: string;
  role?: OrganizationRole;
  memberCount: number;
  status: 'active' | 'paused';
};

export type OrganizationMembershipSummary = {
  organizationId: string;
  userId: string;
  role: OrganizationRole;
};

export type PlatformActivityItem = {
  id: string;
  title: string;
  detail: string;
  age: string;
};

export type PlatformNotificationItem = {
  id: string;
  title: string;
  detail: string;
  unread: boolean;
};

export type PlatformOverview = {
  systemStatus: 'operational' | 'degraded';
  activeUsers: number;
  activeOrganizations: number;
  pendingNotifications: number;
};

export interface PlatformHomeDataSource {
  getOrganizations(): Promise<OrganizationSummary[]>;
  getActivity(organizationId?: string): Promise<PlatformActivityItem[]>;
  getNotifications(organizationId?: string): Promise<PlatformNotificationItem[]>;
  getPlatformOverview(organizationId?: string): Promise<PlatformOverview>;
}
