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
  }
];
