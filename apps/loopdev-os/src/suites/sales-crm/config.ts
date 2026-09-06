import type { NavigationSchema, SuiteConfig } from '@loopdev/contracts';

export const SALES_CRM_NAVIGATION: NavigationSchema = {
  version: '1.0',
  suite: {
    suiteId: 'sales-crm',
    suiteName: 'Sales & CRM',
    suiteIcon: 'groups',
    surfaceVariant: 'canvas',
    route: { routeId: '/sales-crm' },
  },
  exitHatch: {
    label: 'Back to Launchpad',
    icon: 'arrow-left',
    route: { routeId: '/launchpad' },
  },
  groups: [
    {
      id: 'crm-workspace',
      label: 'CRM workspace',
      priority: 1,
      items: [
        {
          id: 'crm.contacts',
          kind: 'module',
          moduleId: 'contacts',
          label: 'Contacts',
          icon: 'Users',
          priority: 1,
          route: { routeId: '/sales-crm/contacts' },
        },
        {
          id: 'crm.leads',
          kind: 'module',
          moduleId: 'leads',
          label: 'Leads',
          icon: 'UserPlus',
          priority: 2,
          route: { routeId: '/sales-crm/leads' },
        },
        {
          id: 'crm.pipeline',
          kind: 'module',
          moduleId: 'pipeline',
          label: 'Pipeline',
          icon: 'KanbanSquare',
          priority: 3,
          route: { routeId: '/sales-crm/pipeline' },
        },
        {
          id: 'crm.tasks',
          kind: 'module',
          moduleId: 'tasks',
          label: 'Tasks',
          icon: 'ListTodo',
          priority: 4,
          route: { routeId: '/sales-crm/tasks' },
        },
        {
          id: 'crm.communications',
          kind: 'module',
          moduleId: 'communications',
          label: 'Communications',
          icon: 'MessageCircle',
          priority: 5,
          route: { routeId: '/sales-crm/communications' },
        },
      ],
    },
  ],
};

export const SALES_CRM_SUITE_CONFIG: SuiteConfig = {
  identity: SALES_CRM_NAVIGATION.suite,
  navigation: SALES_CRM_NAVIGATION,
  accessMap: {},
  navMode: 'expanded',
  requiredPermissions: ['crm.read'],
  modules: [
    {
      moduleId: 'contacts',
      label: 'Contacts',
      route: '/sales-crm/contacts',
      breadcrumbs: ['Sales & CRM', 'Contacts'],
      capabilities: ['mobile-navigation'],
      shell: {
        canvasMode: 'data',
      },
    },
    {
      // Canvas mode is resolved per pathname in SalesCrmShell (see
      // shellRouting.ts): the list uses `split`, the capture workflow at
      // `/sales-crm/leads/new` uses `full-bleed`, and both keep this same
      // `leads` module active for sidebar highlighting.
      moduleId: 'leads',
      label: 'Leads',
      route: '/sales-crm/leads',
      breadcrumbs: ['Sales & CRM', 'Leads'],
      capabilities: ['mobile-navigation'],
    },
    {
      moduleId: 'pipeline',
      label: 'Pipeline',
      route: '/sales-crm/pipeline',
      breadcrumbs: ['Sales & CRM', 'Pipeline'],
      capabilities: ['mobile-navigation'],
      shell: {
        canvasMode: 'board',
      },
    },
    {
      moduleId: 'tasks',
      label: 'Tasks',
      route: '/sales-crm/tasks',
      breadcrumbs: ['Sales & CRM', 'Tasks'],
      capabilities: ['mobile-navigation'],
      shell: {
        canvasMode: 'split',
      },
    },
    {
      moduleId: 'communications',
      label: 'Communications',
      route: '/sales-crm/communications',
      breadcrumbs: ['Sales & CRM', 'Communications'],
      capabilities: ['mobile-navigation'],
      shell: {
        canvasMode: 'split',
        moduleContextSidebar: {
          label: 'Inbox',
          width: 'standard',
          contentScrollable: true,
        },
        moduleContextPanel: {
          label: 'CRM context',
          width: 'standard',
          contentScrollable: true,
        },
      },
    },
  ],
};
