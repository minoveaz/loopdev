import type { OrganizationRole, SuiteKey } from './tenancy';

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

export type PlatformSuiteSummary = {
  id: string;
  suiteKey: SuiteKey;
  name: string;
  slug: string;
  status: 'active' | 'disabled' | 'archived';
};

export interface PlatformHomeDataSource {
  getOrganizations(): Promise<OrganizationSummary[]>;
  getSuites(organizationId?: string): Promise<PlatformSuiteSummary[]>;
  getActivity(organizationId?: string): Promise<PlatformActivityItem[]>;
  getNotifications(organizationId?: string): Promise<PlatformNotificationItem[]>;
  getPlatformOverview(organizationId?: string): Promise<PlatformOverview>;
}
