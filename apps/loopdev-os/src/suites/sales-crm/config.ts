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
    },
    {
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
    },
    {
      moduleId: 'tasks',
      label: 'Tasks',
      route: '/sales-crm/tasks',
      breadcrumbs: ['Sales & CRM', 'Tasks'],
      capabilities: ['mobile-navigation'],
    },
  ],
};
