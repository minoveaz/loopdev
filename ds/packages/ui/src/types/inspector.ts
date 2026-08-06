export type RouteScope = 'suite' | 'module' | 'entity';

export type InspectorMode = 'read' | 'draft' | 'review' | 'locked';

export type InspectorIntent =
  | 'inspect'
  | 'compare'
  | 'impact'
  | 'publish-preflight'
  | 'request-approval'
  | 'approve'
  | 'reject'
  | 'resolve';

export type Severity = 'info' | 'warn' | 'block';

export interface EntityRef {
  moduleId: string;
  type: string; // e.g., 'brand.token', 'brand.identity'
  id: string;
  versionId?: string;
  tenantId?: string;
  name?: string; // Display name cache
}

export interface InspectorPermissions {
  canEdit: boolean;
  canApprove: boolean;
  canPublish: boolean;
  canOverride: boolean;
}

export interface InspectorContext {
  scope: RouteScope;
  mode: InspectorMode;
  intent: InspectorIntent;
  entity?: EntityRef;
  selectionPath?: string[];
  permissions: InspectorPermissions;
}

export type InspectorTabId = 'context' | 'impact' | 'diff' | 'governance' | 'validation' | 'explain';

export interface InspectorTabDef {
  id: InspectorTabId;
  label: string;
  icon?: string;
  isEnabled: boolean;
  hasIndicator?: boolean; // e.g. red dot for errors
}
