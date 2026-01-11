import { Severity } from '@loopdev/ui';

export type BrandStatus = 'published' | 'draft' | 'archived';
export type OperatingMode = 'read-only' | 'draft-mode' | 'review-mode';
export type HealthStatus = 'ok' | 'warn' | 'block';

export interface BrandSummary {
  id: string;
  name: string;
  status: BrandStatus;
  mode: OperatingMode;
  activeVersion: string;
  draftVersion?: string;
  lastUpdated: string;
  lastActor: string;
  lockReason?: string;
  inheritance?: {
    parentId: string;
    parentName: string;
    parentVersion: string;
  };
  overridesCount: number;
}

export interface HealthMetric {
  id: string;
  label: string;
  value: string | number;
  status: HealthStatus;
  meta?: string;
}

export interface BrandHealth {
  compliance: HealthMetric;
  approvals: HealthMetric;
  overrides: HealthMetric;
  dependencies: HealthMetric;
}

export interface GovernanceDomain {
  id: 'identity' | 'tokens' | 'rules' | 'overrides';
  label: string;
  access: 'allowed' | 'approval-required' | 'restricted';
}

export interface BrandEvent {
  id: string;
  type: 'rule_change' | 'token_change' | 'override' | 'publish' | 'metadata_change';
  label: string;
  actor: string;
  timestamp: string;
  severity: Severity;
  hasDiff?: boolean;
}
