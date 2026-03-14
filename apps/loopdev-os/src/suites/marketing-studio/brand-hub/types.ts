import { Severity } from '@loopdev/ui';

export type BrandStatus = 'published' | 'draft' | 'archived';
export type OperatingMode = 'read-only' | 'draft-mode' | 'review-mode';
export type HealthStatus = 'ok' | 'warn' | 'block';

// --- VISUAL SYSTEM ---
export interface ColorToken {
  id: string;
  name: string;
  description?: string;
  group: 'core' | 'semantic' | 'surface' | 'neutral';
  role?: string;
  resolvesTo: {
    light: string;
    dark: string;
  };
}

export interface BrandPalette {
  tokens: ColorToken[];
}

// --- CORE BRAND ---
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
  identity?: BrandIdentity;
  palette?: BrandPalette; // New Palette Field
}

// --- IDENTITY DOMAIN ---
export interface BrandIdentity {
  narrative: {
    mission: string;
    vision: string;
    promise?: string;
    values: Array<{ title: string; description: string }>;
  };
  voice: {
    profiles: ToneProfile[];
  };
  claims: {
    forbidden: string[];
    regulated: RegulatedClaim[];
  };
}

export interface ToneProfile {
  id: string;
  name: string;
  description: string;
  examples: {
    do: string[];
    dont: string[];
  };
}

export interface RegulatedClaim {
  id: string;
  text: string;
  jurisdiction: string;
  severity: 'warn' | 'block';
  reason: string;
}

// --- OVERVIEW METRICS ---
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