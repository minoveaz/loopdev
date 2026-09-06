import type { NavigationSchema, SuiteConfig } from '@loopdev/contracts';

export const DOCUMENT_INTELLIGENCE_NAVIGATION: NavigationSchema = {
  version: '1.0',
  suite: {
    suiteId: 'document-intelligence',
    suiteName: 'Document Intelligence',
    suiteIcon: 'document_scanner',
    surfaceVariant: 'canvas',
    route: { routeId: '/document-intelligence' },
  },
  exitHatch: {
    label: 'Back to Launchpad',
    icon: 'arrow-left',
    route: { routeId: '/launchpad' },
  },
  groups: [
    {
      id: 'di-workspace',
      label: 'Document intelligence',
      priority: 1,
      items: [
        {
          id: 'di.overview',
          kind: 'module',
          moduleId: 'overview',
          label: 'Overview',
          icon: 'LayoutDashboard',
          priority: 1,
          route: { routeId: '/document-intelligence' },
        },
        {
          id: 'di.new-extraction',
          kind: 'module',
          moduleId: 'workbench',
          label: 'New document extraction',
          icon: 'ScanSearch',
          priority: 2,
          route: { routeId: '/document-intelligence/new' },
        },
      ],
    },
  ],
};

export const DOCUMENT_INTELLIGENCE_SUITE_CONFIG: SuiteConfig = {
  identity: DOCUMENT_INTELLIGENCE_NAVIGATION.suite,
  navigation: DOCUMENT_INTELLIGENCE_NAVIGATION,
  accessMap: {},
  navMode: 'expanded',
  modules: [
    {
      moduleId: 'overview',
      label: 'Overview',
      route: '/document-intelligence',
      breadcrumbs: ['Document Intelligence', 'Overview'],
      capabilities: ['mobile-navigation'],
      shell: {
        canvasMode: 'overview',
      },
    },
    {
      moduleId: 'workbench',
      label: 'Document extraction',
      route: '/document-intelligence/new',
      breadcrumbs: ['Document Intelligence', 'Document extraction'],
      capabilities: ['mobile-navigation'],
      shell: {
        canvasMode: 'workspace',
        moduleContextPanel: {
          label: 'Extraction context',
        },
      },
    },
  ],
};
