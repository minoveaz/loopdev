import { SystemStatusProps } from './types';

export const SYSTEM_STATUS_FIXTURES: Record<string, SystemStatusProps> = {
  operational: {
    state: 'operational',
    id: 't-800-active',
    label: 'ID'
  },
  degraded: {
    state: 'degraded',
    id: 'api-gateway-01',
    label: 'NODE'
  },
  critical: {
    state: 'outage',
    id: 'db-cluster-main'
  }
};
