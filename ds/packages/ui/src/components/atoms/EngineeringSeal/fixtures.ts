import { EngineeringSealProps } from './types';

export const ENGINEERING_SEAL_FIXTURES: Record<string, EngineeringSealProps> = {
  certified: {
    status: 'ready',
    version: '1.0.4',
  },
  inAudit: {
    status: 'audit',
    version: '0.8.2',
  },
  experimental: {
    status: 'lab',
    version: '0.5.0-alpha',
  }
};
