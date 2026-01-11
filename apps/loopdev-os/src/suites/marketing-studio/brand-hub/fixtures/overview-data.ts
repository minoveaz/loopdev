import { BrandSummary, BrandHealth, BrandEvent } from '../types';

export const MOCK_PUBLISHED_BRAND: BrandSummary = {
  id: '1',
  name: 'Acme Corp',
  status: 'published',
  mode: 'read-only',
  activeVersion: 'v1.2.0',
  lastUpdated: '2024-01-10T14:30:00Z',
  lastActor: 'Jane Doe',
  overridesCount: 2,
};

export const MOCK_DRAFT_BRAND: BrandSummary = {
  id: '2',
  name: 'Loop Labs',
  status: 'draft',
  mode: 'draft-mode',
  activeVersion: 'v0.9.5',
  draftVersion: 'v0.9.6-draft',
  lastUpdated: '2024-01-11T09:15:00Z',
  lastActor: 'You',
  overridesCount: 0,
};

export const MOCK_BRAND_HEALTH: BrandHealth = {
  compliance: {
    id: 'compliance',
    label: 'Compliance',
    value: '2 Warnings',
    status: 'warn',
    meta: '12 Rules Passed'
  },
  approvals: {
    id: 'approvals',
    label: 'Approvals',
    value: '0 Pending',
    status: 'ok',
    meta: 'Stable'
  },
  overrides: {
    id: 'overrides',
    label: 'Overrides',
    value: '2 Active',
    status: 'ok',
    meta: 'Market specific'
  },
  dependencies: {
    id: 'dependencies',
    label: 'Dependencies',
    value: '12 Modules',
    status: 'ok',
    meta: 'High Usage'
  }
};

export const MOCK_RECENT_EVENTS: BrandEvent[] = [
  {
    id: 'e1',
    type: 'publish',
    label: 'Brand Published',
    actor: 'Jane Doe',
    timestamp: '2h ago',
    severity: 'info'
  },
  {
    id: 'e2',
    type: 'token_change',
    label: 'Primary Color Updated',
    actor: 'John Smith',
    timestamp: '5h ago',
    severity: 'info',
    hasDiff: true
  },
  {
    id: 'e3',
    type: 'rule_change',
    label: 'Logo Usage Rule Modified',
    actor: 'Jane Doe',
    timestamp: '1d ago',
    severity: 'warn',
    hasDiff: true
  }
];
