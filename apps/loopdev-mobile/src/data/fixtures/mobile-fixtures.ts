import type { SuiteCardContract } from '@loopdev/design-contracts';
import type {
  OrganizationSummary,
  PlatformActivityItem,
  PlatformHomeDataSource,
  PlatformNotificationItem,
  PlatformOverview,
  PlatformSuiteSummary,
} from '@loopdev/contracts';
import type { MobileUser } from '../../auth/session';

export type MobileFixtureScenario = 'operational' | 'empty' | 'degraded' | 'paused' | 'error';

export const fixtureUser: MobileUser = {
  id: 'fixture-supervisor',
  username: 'supervisor',
  displayName: 'LoopDev Supervisor',
  isGlobalAdmin: true,
};

export const fixtureSuites: SuiteCardContract[] = [
  {
    suiteId: 'marketing',
    title: 'Marketing Studio',
    description: 'High-performance identity governance and generative content engine for modern teams.',
    availability: 'enabled',
    status: 'ready',
  },
  {
    suiteId: 'crm',
    title: 'Sales & CRM',
    description: 'Pipeline intelligence and relationship management powered by predictive neural models.',
    availability: 'enabled',
    status: 'ready',
  },
  {
    suiteId: 'quant',
    title: 'Quant Ops',
    description: 'Algorithmic trading engine and high-frequency execution command center.',
    availability: 'enabled',
    status: 'lab',
  },
  {
    suiteId: 'health',
    title: 'Health OS',
    description: 'Industrial-grade clinical care, electronic health records (HCE), and medical agenda for IPS providers.',
    availability: 'disabled',
    status: 'audit',
  },
];

const suites: PlatformSuiteSummary[] = [
  { id: 'fixture-marketing', suiteKey: 'marketing', name: 'Marketing Studio', slug: 'marketing-studio', status: 'active' },
  { id: 'fixture-crm', suiteKey: 'crm', name: 'Sales & CRM', slug: 'sales-crm', status: 'active' },
  { id: 'fixture-quant', suiteKey: 'quant', name: 'Quant Ops', slug: 'quant-ops', status: 'active' },
];

const organizations: OrganizationSummary[] = [
  { id: 'org-loopdev', name: 'LoopDev', slug: 'loopdev', role: 'owner', memberCount: 24, status: 'active' },
  { id: 'org-acme', name: 'Acme Corp', slug: 'acme', role: 'admin', memberCount: 12, status: 'active' },
];

const activity: PlatformActivityItem[] = [
  { id: 'activity-1', title: 'Suite sincronizada', detail: 'Marketing Studio actualizó sus permisos.', age: '2 min' },
  { id: 'activity-2', title: 'Organización actualizada', detail: 'Acme Corp agregó un nuevo administrador.', age: '18 min' },
];

const notifications: PlatformNotificationItem[] = [
  { id: 'notification-1', title: 'Revisión pendiente', detail: 'Quant Ops requiere aprobación de acceso.', unread: true },
  { id: 'notification-2', title: 'Sincronización completa', detail: 'Los datos de LoopDev están actualizados.', unread: false },
];

const overview: PlatformOverview = {
  systemStatus: 'operational',
  activeUsers: 48,
  activeOrganizations: 2,
  pendingNotifications: 1,
};

function delayed<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 120));
}

export function createFixtureHomeDataSource(scenario: MobileFixtureScenario = 'operational'): PlatformHomeDataSource {
  if (scenario === 'error') {
    return {
      getOrganizations: async () => { throw new Error('Fixture backend unavailable'); },
      getSuites: async () => { throw new Error('Fixture backend unavailable'); },
      getActivity: async () => { throw new Error('Fixture backend unavailable'); },
      getNotifications: async () => { throw new Error('Fixture backend unavailable'); },
      getPlatformOverview: async () => { throw new Error('Fixture backend unavailable'); },
    };
  }

  const scenarioOrganizations = scenario === 'empty' ? [] : scenario === 'paused'
    ? organizations.map((organization) => ({ ...organization, status: 'paused' as const }))
    : organizations;
  const scenarioOverview = scenario === 'degraded'
    ? { ...overview, systemStatus: 'degraded' as const, pendingNotifications: 3 }
    : scenario === 'empty'
      ? { ...overview, activeOrganizations: 0, activeUsers: 0, pendingNotifications: 0 }
      : overview;

  return {
    getOrganizations: async () => delayed(scenarioOrganizations),
    getSuites: async () => delayed(scenario === 'empty' ? [] : suites),
    getActivity: async () => delayed(scenario === 'empty' ? [] : activity),
    getNotifications: async () => delayed(scenario === 'empty' ? [] : notifications),
    getPlatformOverview: async () => delayed(scenarioOverview),
  };
}
