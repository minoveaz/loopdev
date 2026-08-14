import { SuiteIdentity } from '@loopdev/contracts';

export const AVAILABLE_SUITES_FIXTURES: SuiteIdentity[] = [
  {
    suiteId: 'financialOps',
    suiteName: 'Financial Ops',
    suiteIcon: 'Banknote',
    surfaceVariant: 'canvas',
    route: { routeId: '/financial-ops' }
  },
  {
    suiteId: 'quant-ops',
    suiteName: 'Quant Ops',
    suiteIcon: 'Activity',
    surfaceVariant: 'canvas',
    route: { routeId: '/quant-ops' }
  },
];

export const SHELL_SHOWCASE_SUITES_FIXTURES: SuiteIdentity[] = [
  {
    suiteId: 'marketing-studio',
    suiteName: 'Marketing Studio',
    suiteIcon: 'Megaphone',
    surfaceVariant: 'canvas',
    route: { routeId: '/marketing-studio' },
  },
  {
    suiteId: 'salesCRM',
    suiteName: 'Sales & CRM',
    suiteIcon: 'Users',
    surfaceVariant: 'canvas',
    route: { routeId: '/sales-crm' },
  },
  ...AVAILABLE_SUITES_FIXTURES,
];
