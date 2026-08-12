import type { SuiteConfig } from '@loopdev/contracts';

export const OPERATION_OS_CONFIG: SuiteConfig = {
  identity: {
    suiteId: 'operation-os',
    suiteName: 'Operation OS',
    suiteIcon: 'Activity',
    surfaceVariant: 'canvas',
    route: { routeId: '/operation-os' },
  },
  navigation: {
    version: '1.0',
    suite: {
      suiteId: 'operation-os',
      suiteName: 'Operation OS',
      suiteIcon: 'Activity',
      surfaceVariant: 'canvas',
      route: { routeId: '/operation-os' },
    },
    exitHatch: {
      label: 'Back to OS',
      icon: 'ArrowLeft',
      route: { routeId: '/launchpad' },
    },
    groups: [
      {
        id: 'operations',
        label: 'Operations',
        priority: 10,
        collapsible: false,
        items: [
          {
            id: 'operation-overview',
            kind: 'module',
            moduleId: 'operation-overview',
            label: 'Overview',
            icon: 'LayoutDashboard',
            priority: 10,
            route: { routeId: '/operation-os' },
          },
          {
            id: 'operation-runbooks',
            kind: 'module',
            moduleId: 'operation-runbooks',
            label: 'Runbooks',
            icon: 'ClipboardList',
            priority: 20,
            route: { routeId: '/operation-os/runbooks' },
          },
        ],
      },
    ],
  },
  accessMap: {
    'operation-overview': 'enabled',
    'operation-runbooks': 'enabled',
  },
  requiredPermissions: ['operations.read'],
  navMode: 'expanded',
  modules: [
    {
      moduleId: 'operation-overview',
      label: 'Overview',
      route: '/operation-os',
      breadcrumbs: ['Operation OS'],
      capabilities: ['sidebar'],
    },
    {
      moduleId: 'operation-runbooks',
      label: 'Runbooks',
      route: '/operation-os/runbooks',
      breadcrumbs: ['Operation OS', 'Runbooks'],
      capabilities: ['sidebar'],
    },
  ],
};
